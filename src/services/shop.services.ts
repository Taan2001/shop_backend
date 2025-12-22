// libs
import { Request, NextFunction } from "express";
import dayjs from "dayjs";

// interfaces
import { IResponseSuccess } from "../interfaces/app.interface";
import { IGetShopDetailSuccess, IGetShopsSuccess, IRequestpPathGetShopDetail, IRequestQueryGetShops } from "../interfaces/shop.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isIntegerStringRegex } from "../utils/number";

// constants
import { ROLES } from "../constants/common.constant";
import { ERROR_LIST } from "../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_SHOPS, SORT_TYPE } from "../constants/sort.constant";

// database
import { countGetShops, getShopDetailInformationById, getShops } from "../database/repositories/shop.repository";

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

export const getShopDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IGetShopDetailSuccess>> => {
    // Step 3: Validate path parameters.
    const { shopId } = request.params as unknown as IRequestpPathGetShopDetail;

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
            errorMessages: [ERROR_LIST.QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE("shopId")],
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
