// libs
import { Request, NextFunction } from "express";
import dayjs from "dayjs";

// interfaces
import { IResponseSuccess } from "../interfaces/app.interface";
import {
    IDeleteShopSuccess,
    IGetShopDetailSuccess,
    IGetShopsSuccess,
    IPostShopDetailSuccess,
    IRequestBodyPostShopDetail,
    IRequestPathDeleteShop,
    IRequestPathGetShopDetail,
    IRequestPathPostShopDetail,
    IRequestQueryGetShops,
} from "../interfaces/shop.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isIntegerStringRegex } from "../utils/number";
import { isValidEmail, isVietnamesePhoneNumber } from "../utils/helpers";

// constants
import { ROLES } from "../constants/common.constant";
import { ERROR_LIST } from "../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_SHOPS, SORT_TYPE } from "../constants/sort.constant";

// database
import {
    countGetShops,
    deleteShopById,
    getShopDetailInformationById,
    getShops,
    updateShopDeleteFlg,
    updateShopInformationById,
} from "../database/repositories/shop.repository";
import { commitTransaction, createTransactionConnection, releaseTransaction, rollbackTransaction } from "../database/connection-pool";

/**
 * Get Shops Service
 * @param request - Express Request
 * @param nextFunction - Express NextFunction
 * @returns { Promise<IResponseSuccess<IGetShopsSuccess>> } - Promise resolving to service result
 */
export const getShopsService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IGetShopsSuccess>> => {
    // Step 3: Validate query parameters.
    const { limit, currentPage, sortType, sortField } = request.query as unknown as IRequestQueryGetShops;
    const messages: string[] = [];
    const params: string[] = [];

    // -----> Step 3-1: Check the required query parameters.
    if (limit === undefined) {
        messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("limit"));
        params.push("limit");
    }
    if (currentPage === undefined) {
        messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("currentPage"));
        params.push("currentPage");
    }
    if (sortField === undefined) {
        messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("sortField"));
        params.push("sortField");
    }
    if (sortType === undefined) {
        messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("sortType"));
        params.push("sortType");
    }

    if (messages.length > 0) {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_CODE,
            errorMessages: messages,
            errorParams: params,
        });
    }

    // -----> Step 2-2: Check the data of the query parameters.
    if (!isIntegerStringRegex(limit) || ![10, 20, 50, 100].includes(Number(limit))) {
        messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("limit"));
        params.push(limit);
    }
    if (!isIntegerStringRegex(currentPage) || Number(currentPage) <= 0) {
        messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("currentPage"));
        params.push(currentPage);
    }
    if (!SORT_TYPE.includes(sortType.toUpperCase())) {
        messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("sortType"));
        params.push(sortType);
    }
    if (sortField !== "" && !FIELD_SORT_LIST_IN_GET_SHOPS.includes(sortField.toUpperCase())) {
        messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_MESSAGE("sortField"));
        params.push(sortField);
    }

    if (messages.length > 0) {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.INVALID_QUERY_PARAMS_GET_SHOPS_ERROR.ERROR_CODE,
            errorMessages: messages,
            errorParams: params,
        });
    }

    // Step 4: Handle pagination information.
    const allShops = await countGetShops();

    const totalRecords = allShops.totalShops;
    const offset = Number(limit) * (Number(currentPage) - 1);

    if (offset > totalRecords) {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.PAGINATION_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.PAGINATION_ERROR.ERROR_MESSAGE()],
            errorParams: [limit, currentPage],
        });
    }

    const totalPages = Math.ceil(totalRecords / Number(limit));

    // Step 5: Select the data in database.
    const shops = await getShops(Number(limit), offset, sortField.toLocaleUpperCase(), sortType.toLocaleUpperCase());

    if (shops.length === 0) {
        throw ResponseError({
            statusCode: 404,
            errorCode: ERROR_LIST.NO_DATA_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.NO_DATA_ERROR.ERROR_MESSAGE()],
            errorParams: [limit, currentPage, sortField, sortType],
        });
    }
    return ResponseSuccess<IGetShopsSuccess>({
        statusCode: 200,
        data: {
            shops,
            pageInfo: {
                limit: Number(limit),
                currentPage: Number(currentPage),
                totalRecords,
                totalPages,
            },
        },
    });
};

/**
 * Get Shop Detail Service
 * @param request - Express Request
 * @param nextFunction - Express NextFunction
 * @returns { Promise<IResponseSuccess<IGetShopDetailSuccess>> } - Promise resolving to service result
 */
export const getShopDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IGetShopDetailSuccess>> => {
    // Step 3: Validate path parameters.
    const { shopId } = request.params as unknown as IRequestPathGetShopDetail;

    if (shopId === undefined || shopId.trim() === "") {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_GET_SHOP_DETAIL_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_GET_SHOP_DETAIL_ERROR.ERROR_MESSAGE("shopId")],
            errorParams: ["shopId"],
        });
    }

    // Step 4: Get shop information
    const shops = await getShopDetailInformationById(shopId, request.currentUser.roleIds);

    if (shops.length !== 1) {
        throw ResponseError({
            statusCode: 404,
            errorCode: ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            errorParams: ["shopId"],
        });
    }
    const shop = shops[0];

    // Step 5: Check current user.
    if (!request.currentUser.roleIds.includes(ROLES.ADMIN) && shop.ownerId !== request.currentUser.userId) {
        throw ResponseError({
            statusCode: 401,
            errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
            errorParams: [request.currentUser.userId],
        });
    }

    return ResponseSuccess<IGetShopDetailSuccess>({
        statusCode: 200,
        data: {
            shop,
        },
    });
};

/**
 * Post Shop Detail Service
 * @param request - Express Request
 * @param nextFunction - Express NextFunction
 * @returns { Promise<IResponseSuccess<IPostShopDetailSuccess>> } - Promise resolving to service result
 */
export const postShopDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IPostShopDetailSuccess>> => {
    // Step 3: Validate path parameters.
    const { shopId } = request.params as unknown as IRequestPathPostShopDetail;
    if (shopId === undefined || shopId.trim() === "") {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("shopId")],
            errorParams: ["shopId"],
        });
    }

    // Step 4: Get shop information
    const shops = await getShopDetailInformationById(shopId, request.currentUser.roleIds);

    if (shops.length !== 1) {
        throw ResponseError({
            statusCode: 404,
            errorCode: ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            errorParams: ["shopId"],
        });
    }

    const shop = shops[0];
    // Step 5: Check current user.
    if (!request.currentUser.roleIds.includes(ROLES.ADMIN) && shop.ownerId !== request.currentUser.userId) {
        throw ResponseError({
            statusCode: 401,
            errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
            errorParams: [request.currentUser.userId],
        });
    }

    // Step 6: Validate query parameters.
    const { shopName, description, email, address, phone, city, status, deleteFlg } = request.body as unknown as IRequestBodyPostShopDetail;
    const messages: string[] = [];
    const params: string[] = [];

    // -----> Step 6-1: Check the required query parameters.
    // shopName
    if (shopName === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("shopName"));
        params.push("shopName");
    }
    // description
    if (description === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("description"));
        params.push("description");
    }
    // email
    if (email === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("email"));
        params.push("email");
    }
    // phone
    if (phone === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("phone"));
        params.push("phone");
    }
    // address
    if (address === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("address"));
        params.push("address");
    }
    // city
    if (city === undefined) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("city"));
        params.push("city");
    }
    // ADMIN ?
    if (request.currentUser.roleIds.includes(ROLES.ADMIN)) {
        // status
        if (status === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("status"));
            params.push("status");
        }
        // deleteFlg
        if (deleteFlg === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("deleteFlg"));
            params.push("deleteFlg");
        }
    }

    if (messages.length > 0) {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR.ERROR_CODE,
            errorMessages: messages,
            errorParams: params,
        });
    }

    // -----> Step 6-2: Check the data of the query parameters.
    // shopName
    if (typeof shopName !== "string") {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("shopName", "dataType"));
    }
    if (typeof shopName === "string" && shopName.length === 0) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("shopName", "minLength"));
    }
    if (typeof shopName === "string" && shopName.length > 64) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("shopName", "maxLength"));
    }
    // description
    if (typeof description !== "string") {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("description", "dataType"));
    }
    if (typeof description === "string" && description.length === 0) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("description", "minLength"));
    }
    if (typeof description === "string" && description.length > 128) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("description", "maxLength"));
    }
    // email
    if (isValidEmail(email) === false) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("email", "dataType"));
    }
    if (typeof email === "string" && email.length > 64) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("email", "maxLength"));
    }
    // phone
    if (isVietnamesePhoneNumber(phone) === false) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("phone", "dataType"));
    }
    // address
    if (typeof address !== "string") {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("address", "dataType"));
    }
    if (typeof address === "string" && address.length === 0) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("address", "minLength"));
    }
    if (typeof address === "string" && address.length > 128) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("address", "maxLength"));
    }
    // city
    if (typeof city !== "string") {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("city", "dataType"));
    }
    if (typeof city === "string" && city.length === 0) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("city", "minLength"));
    }
    if (typeof city === "string" && city.length > 128) {
        messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("city", "maxLength"));
    }
    // ADMIN ?
    if (request.currentUser.roleIds.includes(ROLES.ADMIN)) {
        // status
        if (typeof status !== "number") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("status", "dataType"));
        }
        if (typeof status === "number" && [0, 1].includes(status) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("status", "invalid value"));
        }

        // deleteFlg
        if (typeof deleteFlg !== "number") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("deleteFlg", "dataType"));
        }
        if (typeof deleteFlg === "number" && [0, 1].includes(deleteFlg) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_MESSAGE("deleteFlg", "invalid value"));
        }
    }

    if (messages.length > 0) {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR.ERROR_CODE,
            errorMessages: messages,
        });
    }

    // Step 7: Calculate the value to be inserted.
    const timestamp = Date.now();
    const updatedDate = dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");

    // Step 8: Update data.
    // create transaction
    const transaction = await createTransactionConnection();
    try {
        await updateShopInformationById(transaction, {
            shopId,
            shopName,
            description,
            email,
            address,
            phone,
            city,
            status,
            deleteFlg,
            timestamp,
            updatedBy: request.currentUser.userId,
            updatedDate,
        });

        // commit transaction
        await commitTransaction(transaction);

        // release transaction
        await releaseTransaction(transaction);

        return ResponseSuccess<IPostShopDetailSuccess>({
            statusCode: 200,
            data: {
                shop: {
                    shopId,
                },
                messages: ["This shop is updated successfully."],
            },
        });
    } catch (error) {
        // rollback transaction
        await rollbackTransaction(transaction);

        // release transaction
        await releaseTransaction(transaction);

        throw error;
    }
};

/**
 * Post Shop Detail Service
 * @param request - Express Request
 * @param nextFunction - Express NextFunction
 * @returns { Promise<IResponseSuccess<IDeleteShopSuccess>> } - Promise resolving to service result
 */
export const deleteShopService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IDeleteShopSuccess>> => {
    // Step 3: Validate path parameters.
    const { shopId } = request.params as unknown as IRequestPathDeleteShop;
    if (shopId === undefined || shopId.trim() === "") {
        throw ResponseError({
            statusCode: 400,
            errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_DELETE_SHOP_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_DELETE_SHOP_ERROR.ERROR_MESSAGE("shopId")],
            errorParams: ["shopId"],
        });
    }
    // Step 4: Get shop information
    const shops = await getShopDetailInformationById(shopId, request.currentUser.roleIds);

    if (shops.length !== 1) {
        throw ResponseError({
            statusCode: 404,
            errorCode: ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            errorParams: ["shopId"],
        });
    }

    const shop = shops[0];
    // Step 5: Check current user.
    if (!request.currentUser.roleIds.includes(ROLES.ADMIN) && shop.ownerId !== request.currentUser.userId) {
        throw ResponseError({
            statusCode: 401,
            errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
            errorParams: [request.currentUser.userId],
        });
    }
    // Step 5: Update data.
    // create transaction
    const transaction = await createTransactionConnection();
    try {
        // If the currentUser is not ADMIN and currentUser.userId === ownerId, update deleteFlg field in database
        if (!request.currentUser.roleIds.includes(ROLES.ADMIN) && shop.ownerId === request.currentUser.userId) {
            const timestamp = Date.now();
            const date = dayjs(timestamp).format("YYYY-MM-DD HH:MM:SS");
            await updateShopDeleteFlg(transaction, { shopId, updatedDate: date, timestamp, updatedBy: request.currentUser.userId });
        } else if (request.currentUser.roleIds.includes(ROLES.ADMIN)) {
            await deleteShopById(transaction, shopId);
        }

        // commit transaction
        await commitTransaction(transaction);

        // release transaction
        await releaseTransaction(transaction);

        return ResponseSuccess<IDeleteShopSuccess>({
            statusCode: 200,
            data: {
                messages: ["This shop is deleted successfully."],
            },
        });
    } catch (error) {
        // rollback transaction
        await rollbackTransaction(transaction);

        // release transaction
        await releaseTransaction(transaction);

        throw error;
    }
};
