// libs
import { Request, NextFunction } from "express";
import dayjs from "dayjs";

// interfaces
import {
    IRequestpPathGetUserDetail,
    IRequestQueryGetUsers,
    IGetUserDetailSuccess,
    IGetUsersSuccess,
    IPostUserDetailSuccess,
    IRequestBodyPostUserDetail,
    IRequestpPathPostUserDetail,
} from "../interfaces/user.interface";
import { IResponseSuccess } from "../interfaces/app.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isIntegerStringRegex } from "../utils/number";
import { isValidEmail, isVietnamesePhoneNumber } from "../utils/helpers";

// constants
import { ERROR_LIST } from "../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_USERS } from "../constants/sort.constant";
import { ADMIN_CONST, ROLES } from "../constants/common.constant";

// database
import { commitTransaction, createTransactionConnection, releaseTransaction, rollbackTransaction } from "../database/connection-pool";
import {
    countGetUsers,
    deleteRoleForUser,
    getUserDetailInformationByUserId,
    getUserRoleInformationByUserId,
    getUsers,
    insertNewRolesForUser,
    updateUserInformation,
} from "../database/repositories/user.repository";
import { getRoleInformationByRoleId, getUserInformationByUserId, insertRoleRelationshipInformation } from "../database/repositories/auth.repository";
import { get } from "http";

/**
 * Get Users Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IGetUsersSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getUsersService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IGetUsersSuccess>> => {
    try {
        // Step 2: Validate query parameters.
        const { limit, currentPage, sortField, sortType } = request.query as unknown as IRequestQueryGetUsers;
        const messages: string[] = [];
        const params = [];

        // -----> Step 2-1: Check the required query parameters.
        if (limit === undefined) {
            messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("limit"));
            params.push("limit");
        }
        if (currentPage === undefined) {
            messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("currentPage"));
            params.push("currentPage");
        }
        if (sortField === undefined) {
            messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("sortField"));
            params.push("sortField");
        }
        if (sortType === undefined) {
            messages.push(ERROR_LIST.REQUEST_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("sortType"));
            params.push("sortType");
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_QUERY_PARAMS_GET_USERS_ERROR.ERROR_CODE,
                errorMessages: messages,
                errorParams: params,
            });
        }

        // -----> Step 2-2: Check the data of the query parameters.
        if (!isIntegerStringRegex(limit) || (Number(limit) !== 10 && Number(limit) !== 20 && Number(limit) !== 50 && Number(limit) !== 100)) {
            messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("limit"));
            params.push(limit);
        }
        if (!isIntegerStringRegex(currentPage) || Number(currentPage) <= 0) {
            messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("currentPage"));
            params.push(currentPage);
        }
        if (sortType.toUpperCase() !== "ASC" && sortType.toUpperCase() !== "DESC" && sortType.toUpperCase() !== "") {
            messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("sortType"));
            params.push(sortType);
        }
        if (sortField !== "" && !FIELD_SORT_LIST_IN_GET_USERS.includes(sortField.toUpperCase())) {
            messages.push(ERROR_LIST.INVALID_QUERY_PARAMS_GET_USERS_ERROR.ERROR_MESSAGE("sortField"));
            params.push(sortField);
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.INVALID_QUERY_PARAMS_GET_USERS_ERROR.ERROR_CODE,
                errorMessages: messages,
                errorParams: params,
            });
        }

        // Step 3: Check Role(refer Common sheet)
        // -----> Step 3-1: Get current user information.
        const currentUsers = await getUserInformationByUserId(request.currentUser.userId);
        if (currentUsers.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }
        if (currentUsers.length === 1 && currentUsers[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
        }
        // -----> Step 3-2: Get the role information of the current user.
        const roles = await getUserRoleInformationByUserId(request.currentUser.userId);

        // -----> Step 3-3: Check role permission.
        if (!roles.some((role) => role.roleId === ROLES.ADMIN)) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
                errorParams: [request.currentUser.userId],
            });
        }

        // Step 4: Handle pagination information.
        const allUsers = await countGetUsers();

        const totalRecords = allUsers.totalUsers;
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
        const users = await getUsers(Number(limit), offset, sortField.toLocaleUpperCase(), sortType.toLocaleUpperCase());

        if (users.length === 0) {
            throw ResponseError({
                statusCode: 404,
                errorCode: ERROR_LIST.NO_DATA_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.NO_DATA_ERROR.ERROR_MESSAGE()],
                errorParams: [limit, currentPage, sortField, sortType],
            });
        }

        return ResponseSuccess<IGetUsersSuccess>({
            statusCode: 200,
            data: {
                users,
                pageInfo: {
                    limit: Number(limit),
                    currentPage: Number(currentPage),
                    totalRecords,
                    totalPages,
                },
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Get User Detail Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IGetUserDetailSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getUserDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IGetUserDetailSuccess>> => {
    try {
        // Step 2: Validate path parameters.
        const { userId } = request.params as unknown as IRequestpPathGetUserDetail;
        if (!userId) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_GET_USER_DETAIL_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_GET_USER_DETAIL_ERROR.ERROR_MESSAGE("userId")],
                errorParams: [userId],
            });
        }

        // Step 3: Check Role(refer Common sheet)
        if (request.currentUser.userId !== userId) {
            // -----> Step 3-1: Get current user information.
            const users = await getUserInformationByUserId(request.currentUser.userId);
            if (users.length !== 1) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
            if (users.length === 1 && users[0].deleteFlg !== 0) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
            // -----> Step 3-2: Get the role information of the current user.
            const currentUserRoles = await getUserRoleInformationByUserId(request.currentUser.userId);

            // -----> Step 3-3: Check role permission.
            if (!currentUserRoles.some((role) => role.roleId === ROLES.ADMIN)) {
                throw ResponseError({
                    statusCode: 400,
                    errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
        }

        // Step 4: Get the user detail information
        const userDetails = await getUserDetailInformationByUserId(userId);

        if (userDetails.length === 0) {
            throw ResponseError({
                statusCode: 404,
                errorCode: ERROR_LIST.NO_DATA_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.NO_DATA_ERROR.ERROR_MESSAGE()],
                errorParams: [userId],
            });
        }
        const userDetail = {
            ...userDetails[0],
            roles: userDetails.map((user) => ({
                roleId: user.roleId,
                roleName: user.roleName,
            })),
        };

        return ResponseSuccess<IGetUserDetailSuccess>({ statusCode: 200, data: { user: userDetail } });
    } catch (error) {
        throw error;
    }
};

/**
 * Post User Detail Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IPostUserDetailSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postUserDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IPostUserDetailSuccess>> => {
    try {
        // Step 2: Validate path parameters.
        const { userId } = request.params as unknown as IRequestpPathPostUserDetail;

        if (!userId) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_POST_USER_DETAIL_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("userId")],
                errorParams: [userId],
            });
        }

        // Step 3: Check Role(refer Common sheet)
        const currentUserRoles = await getUserRoleInformationByUserId(request.currentUser.userId);
        if (request.currentUser.userId !== userId) {
            // Step 3-1: Get current user information.
            const users = await getUserInformationByUserId(request.currentUser.userId);
            if (users.length !== 1) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
            if (users.length === 1 && users[0].deleteFlg !== 0) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
            // Step 3-2: Check role permission.
            if (!currentUserRoles.some((role) => role.roleId === ROLES.ADMIN)) {
                throw ResponseError({
                    statusCode: 400,
                    errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
                    errorParams: [request.currentUser.userId],
                });
            }
        }
        // Step 4: Validate path parameters.
        // Step 4-1: Check the required query parameters.
        const { firstName, lastName, age, email, phoneNumber, address, roleIds } = request.body as IRequestBodyPostUserDetail;
        let messages = [];

        if (firstName === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("firstName"));
        }
        if (lastName === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("lastName"));
        }
        if (age === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("age"));
        }
        if (email === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("email"));
        }
        if (phoneNumber === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("phoneNumber"));
        }
        if (address === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("address"));
        }
        if (roleIds === undefined || !Array.isArray(roleIds) || roleIds.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_MESSAGE("roleIds"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // -----> Step 2-2: Check the data of the query parameters.
        // firstName
        if (typeof firstName !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("firstName", "dataType"));
        }
        if (typeof firstName === "string" && firstName.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("firstName", "minLength"));
        }
        if (typeof firstName === "string" && firstName.length > 12) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("firstName", "maxLength"));
        }
        // lastName
        if (typeof lastName !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("lastName", "dataType"));
        }
        if (typeof lastName === "string" && lastName.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("lastName", "minLength"));
        }
        if (typeof lastName === "string" && lastName.length > 36) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("lastName", "maxLength"));
        }
        // age
        if (typeof age !== "number") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("age", "dataType"));
        }
        if (typeof age === "number" && age < 15) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("age", "minValue"));
        }
        if (typeof age === "number" && age > 120) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("age", "maxValue"));
        }
        // phoneNumber
        if (isVietnamesePhoneNumber(phoneNumber) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("phoneNumber", "dataType"));
        }
        // email
        if (isValidEmail(email) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("email", "dataType"));
        }
        if (typeof email === "string" && email.length > 64) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("email", "maxLength"));
        }
        // address
        if (typeof address !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("address", "dataType"));
        }
        if (typeof address === "string" && address.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("address", "minLength"));
        }
        if (typeof address === "string" && address.length > 64) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("address", "maxLength"));
        }
        // roleIds
        if (!currentUserRoles.some((role) => role.roleId === ROLES.ADMIN)) {
            if (Array.isArray(roleIds) && roleIds?.length > 0 && roleIds.some((roleId) => typeof roleId !== "string")) {
                messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("roleIds", "dataType"));
            }

            let isRoleError = false;
            if (Array.isArray(roleIds) && roleIds.length > 0 && roleIds.every((roleId) => typeof roleId === "string")) {
                const promiseRoles = roleIds.map(async (roleId) => {
                    const roles = await getRoleInformationByRoleId(roleId);
                    if (roles.length !== 1) {
                        isRoleError = true;
                    }
                });
                await Promise.all(promiseRoles);
            }

            if (isRoleError) {
                messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("roleIds", "exist in database"));
            }

            if (new Set(roleIds).size !== roleIds.length) {
                messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("roleIds", "duplicate"));
            }

            // if (currentUserRoles.some((role) => role.roleId === ROLES.ADMIN) && !roleIds.includes(ROLES.ADMIN)) {
            //     messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("roleIds", "admin role"));
            // }

            if (userId === ADMIN_CONST && !roleIds.includes(ROLES.ADMIN)) {
                messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_MESSAGE("roleIds", "admin role default"));
            }
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 5: Calculate the roleIds to be inserted.
        const newRoleIds = roleIds;
        const oldRoles = (await getUserRoleInformationByUserId(userId))?.map((role) => role.roleId) || [];

        const roleIdsToAdd = newRoleIds.filter((roleId) => !oldRoles.includes(roleId));
        const roleIdsToDelete = oldRoles.filter((roleId) => !newRoleIds.includes(roleId));

        // Step 6: Insert Data
        const timestamp = Date.now();
        const createdDate = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");
        const updatedDate = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // create transaction
        const transaction = await createTransactionConnection();
        try {
            await updateUserInformation(transaction, {
                userId,
                firstName,
                lastName,
                age,
                email,
                phoneNumber,
                address,
                updateBy: request.currentUser.userId,
                updatedDate,
                timestamp,
            });

            if (roleIdsToDelete.length > 0) {
                await deleteRoleForUser(transaction, {
                    userId,
                    roleIds: roleIdsToDelete,
                });
            }

            if (roleIdsToAdd.length > 0) {
                await insertNewRolesForUser(transaction, {
                    roleIds: roleIdsToAdd,
                    userId,
                    insertBy: request.currentUser.userId,
                    createdDate,
                    updatedDate,
                    timestamp,
                });
            }

            // commit transaction
            await commitTransaction(transaction);

            // release transaction
            await releaseTransaction(transaction);

            return ResponseSuccess<IPostUserDetailSuccess>({
                statusCode: 201,
                data: { messages: ["User update successful"] },
            });
        } catch (error) {
            await rollbackTransaction(transaction);
            await releaseTransaction(transaction);
            throw error;
        }
    } catch (error) {
        throw error;
    }
};
