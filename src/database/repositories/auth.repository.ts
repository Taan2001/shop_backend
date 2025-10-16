// database
import { queryPromise, transactionQueryPromise } from "../connection-pool";
import {
    GetUserInformationByUsernamePasswordDTO,
    GetUserInformationByUsernamePasswordValue,
    GetUserInformationByUserIdDTO,
    GetUserInformationByUserIdValue,
    GetRoleInformationByRoleIdDTO,
    GetRoleInformationByRoleIdValues,
    InsertUserInformationDTO,
    InsertUserInformationValues,
    IInsertUserInformationPayload,
    IInsertRoleRelationshipInformationPayload,
    InsertRoleRelationshipInformationDTO,
    InsertRoleRelationshipInformationValues,
} from "../dto/auth.dto";

// constants
import { ERROR_LIST } from "../../constants/error.constant";

// utils
import { ResponseError } from "../../utils/common";
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

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

/**
 * get the role information by username and password
 * @param {string} roleId
 * @returns { Promise<GetRoleInformationByRoleIdDTO[]> } - Promise resolving to query result
 */
export const getRoleInformationByRoleId = async (roleId: string): Promise<GetRoleInformationByRoleIdDTO[]> => {
    try {
        const sqlQuery = `
            SELECT
                ROLE_ID AS roleId,
                ROLE_NAME AS roleName
            FROM
                M_ROLES
            WHERE
                ROLE_ID = ? 
                AND ROLE_DELETE_FLG = 0
        `;

        const rows = await queryPromise<GetRoleInformationByRoleIdDTO, GetRoleInformationByRoleIdValues>(sqlQuery, [roleId]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_ROLE_INFOR_BY_ID_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_ROLE_INFOR_BY_ID_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getRoleInformationByRoleId",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * insert the user information
 * @param {PoolConnection} transaction
 * @param {IInsertUserInformationPayload} param1
 * @returns { Promise<InsertUserInformationDTO[]> } - Promise resolving to query result
 */
export const insertUserInformation = async (
    transaction: PoolConnection,
    {
        newUserId,
        firstName,
        lastName,
        age,
        username,
        password,
        email,
        phoneNumber,
        address,
        userId,
        createdDate,
        updatedDate,
        timestamp,
    }: IInsertUserInformationPayload
): Promise<InsertUserInformationDTO[]> => {
    try {
        const sqlInsert = `
            INSERT INTO M_USERS (
                USER_ID,
                USER_FIRST_NAME,
                USER_LAST_NAME,
                USER_AGE,
                USER_NAME,
                USER_PASSWORD,
                USER_EMAIL,
                USER_PHONE_NUMBER,
                USER_ADDRESS,
                USER_DELETE_FLG,
                USER_VERIFY,
                USER_VERIFY_CODE,
                USER_VERIFY_CODE_EXPIRATION,
                USER_CREATED_BY,
                USER_CREATED_AT,
                USER_CREATED_AT_SYSTEM,
                USER_UPDATED_BY,
                USER_UPDATED_AT,
                USER_UPDATED_AT_SYSTEM)
            VALUES (?, ?, ?, ?, ?, SHA(?), ?, ?, ?, '0', '0', NULL, NULL, ?, ?, ?, ?, ?, ?);
        `;

        const rows = await transactionQueryPromise<InsertUserInformationDTO, InsertUserInformationValues>(transaction, sqlInsert, [
            newUserId,
            firstName,
            lastName,
            age,
            username,
            password,
            email,
            phoneNumber,
            address,
            userId,
            timestamp,
            createdDate,
            userId,
            timestamp,
            updatedDate,
        ]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_INSERT_USER_INFOR_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_INSERT_USER_INFOR_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "insertUserInformation",
                    params: [
                        JSON.stringify({
                            newUserId,
                            firstName,
                            lastName,
                            age,
                            username,
                            password,
                            email,
                            phoneNumber,
                            address,
                            userId,
                            createdDate,
                            updatedDate,
                            timestamp,
                        }),
                    ],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * insert the role relationship information
 * @param {PoolConnection} transaction
 * @param {IInsertRoleRelationshipInformationPayload} param1
 * @returns { Promise<InsertRoleRelationshipInformationDTO[]> } - Promise resolving to query result
 */
export const insertRoleRelationshipInformation = async (
    transaction: PoolConnection,
    { roleId, newUserId, userId, createdDate, updatedDate, timestamp }: IInsertRoleRelationshipInformationPayload
): Promise<InsertRoleRelationshipInformationDTO[]> => {
    try {
        const sqlInsert = `
            INSERT INTO R_USER_ROLES (
                USER_ID,
                ROLE_ID,
                DELETE_FLG,
                CREATED_BY,
                CREATED_AT,
                CREATED_AT_SYSTEM,
                UPDATED_BY,
                UPDATED_AT,
                UPDATED_AT_SYSTEM)
            VALUES (?, ?, '0', ?, ?, ?, ?, ?, ?);
        `;

        const rows = await transactionQueryPromise<InsertRoleRelationshipInformationDTO, InsertRoleRelationshipInformationValues>(transaction, sqlInsert, [
            newUserId,
            roleId,
            userId,
            timestamp,
            createdDate,
            userId,
            timestamp,
            updatedDate,
        ]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_INSERT_ROLE_RELATIONSHIP_INFOR_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_INSERT_ROLE_RELATIONSHIP_INFOR_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "insertRoleRelationshipInformation",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
