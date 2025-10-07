import { ERROR_LIST } from "../../constants/error.constant";
import { ResponseError } from "../../utils/common";
import { queryPromise } from "../connection-pool";
import {
    GetUserInformationByUsernamePasswordDTO,
    GetUserInformationByUsernamePasswordValue,
    GetUserInformationByUserIdDTO,
    GetUserInformationByUserIdValue,
} from "../dto/auth.dto";

/**
 * get the user information by user id
 * @param {string} userId
 * @returns { Promise<GetUserInformationByUserIdDTO[]> } - Promise resolving to query result
 */
export const getUserInformationByUserId = async (userId: string): Promise<GetUserInformationByUserIdDTO[]> => {
    try {
        const sqlQuery = `
    SELECT
        USER_ID AS userId,
        USER_LAST_NAME AS lastName,
        USER_AGE AS age,
        USER_DELETE_FLG AS deleteFlg
    FROM
        M_USERS
    WHERE
        USER_ID = ?
    `;

        const rows = await queryPromise<GetUserInformationByUserIdDTO, GetUserInformationByUserIdValue>(sqlQuery, [userId]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_USER_INFOR_BY_ID_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USER_INFOR_BY_ID_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUserInformationByUserId",
                    params: [userId],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * get the user information by username and password
 * @param {string} username
 * @param {string} password
 * @returns { Promise<GetUserInformationByUsernamePasswordDTO[]> } - Promise resolving to query result
 */
export const getUserInformationByUsernamePassword = async (username: string, password: string): Promise<GetUserInformationByUsernamePasswordDTO[]> => {
    try {
        const sqlQuery = `
    SELECT
        USER_ID AS userId,
        USER_LAST_NAME AS lastName,
        USER_AGE AS age,
        USER_DELETE_FLG AS deleteFlg
    FROM
        M_USERS
    WHERE
        USER_NAME = ? AND
        USER_PASSWORD = SHA2(?, 256)
    `;

        const rows = await queryPromise<GetUserInformationByUsernamePasswordDTO, GetUserInformationByUsernamePasswordValue>(sqlQuery, [username, password]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_USER_INFOR_BY_USERNAME_PASSWORD_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USER_INFOR_BY_USERNAME_PASSWORD_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUserInformationByUsernamePassword",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
