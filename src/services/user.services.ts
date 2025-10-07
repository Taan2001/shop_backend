// libs
import { Request, NextFunction } from "express";

// interfaces
import { IRequestpPathUserDetail, IRequestQueryUsers, IUserDetailSuccess, IUsersSuccess } from "../interfaces/user.interface";
import { IResponseSuccess } from "../interfaces/app.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isIntegerStringRegex } from "../utils/number";

// constants
import { ERROR_LIST } from "../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_USERS } from "../constants/sort.constant";
import { ROLES } from "../constants/common.constant";

// database
import { countGetUsers, getUserDetailInformationByUserId, getUserRoleInformationByUserId, getUsers } from "../database/repositories/user.repository";
import { getUserInformationByUserId } from "../database/repositories/auth.repository";

/**
 * Users Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IUsersSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getUsersService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IUsersSuccess>> => {
    try {
        // Step 2: Validate query parameters.
        const { limit, currentPage, sortField, sortType } = request.query as unknown as IRequestQueryUsers;
        const messages: string[] = [];
        const params = [];

        // Step 2-1: Check the required query parameters.
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

        // Step 2-2: Check the data of the query parameters.
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
        const userRoles = await getUserRoleInformationByUserId(request.currentUser.userId);

        if (userRoles.length === 0 || !userRoles.map((role) => role.roleId).includes(ROLES.ADMIN)) {
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

        return ResponseSuccess<IUsersSuccess>({
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
 * User Detail Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getUserDetailService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IUserDetailSuccess>> => {
    try {
        // Step 2: Validate path parameters.
        const { userId } = request.params as unknown as IRequestpPathUserDetail;
        if (!userId) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_PATH_PARAMS_GET_USER_DETAIL_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.REQUEST_PATH_PARAMS_GET_USER_DETAIL_ERROR.ERROR_MESSAGE("userId")],
            });
        }
        // Step 3: Check Role(refer Common sheet)
        const users = await getUserInformationByUserId(request.currentUser.userId);
        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }
        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
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

        return ResponseSuccess<IUserDetailSuccess>({ statusCode: 200, data: { user: userDetail } });
    } catch (error) {
        throw error;
    }
};
