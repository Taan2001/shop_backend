// libs
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

// database
import { queryPromise, transactionQueryPromise } from "../connection-pool";
import {
    GetUserRoleInformationByUserIdDTO,
    GetUserRoleInformationByUserIdValue,
    CountGetUsersDTO,
    CountGetUsersValue,
    GetUsersDTO,
    GetUsersValue,
    GetUserDetailDTO,
    GetUserDetailValue,
    IUpdateUserInformationPayload,
    UpdateUserInformationDTO,
    UpdateUserInformationValues,
    IInsertNewRolesForUserPayload,
    InsertNewRolesForUserDTO,
    InsertNewRolesForUserValues,
    DeleteRolesForUserDTO,
    DeleteRolesForUserValues,
    IDeleteRolesForUserPayload,
} from "../dto/user.dto";

// constants
import { ERROR_LIST } from "../../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_USERS, SORT_TYPE } from "../../constants/sort.constant";

// utils
import { ResponseError } from "../../utils/common";

/**
 * get the user role information by user id
 * @param {string} userId
 * @returns { Promise<GetUserRoleInformationByUserIdDTO[]> } - Promise resolving to query result
 */
export const getUserRoleInformationByUserId = async (userId: string): Promise<GetUserRoleInformationByUserIdDTO[]> => {
    try {
        const sqlQuery = `
            SELECT
                MRs.ROLE_ID AS roleId,
                MRs.ROLE_NAME AS roleName
            FROM
                M_ROLES  AS MRs
                JOIN R_USER_ROLE AS RURs ON RURs.ROLE_ID = MRs.ROLE_ID
            WHERE
                RURs.USER_ID = ?
        `;

        const rows = await queryPromise<GetUserRoleInformationByUserIdDTO, GetUserRoleInformationByUserIdValue>(sqlQuery, [userId]);
        if (!rows) {
            return [];
        }

        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_USER_ROLE_INFOR_BY_USER_ID_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USER_ROLE_INFOR_BY_USER_ID_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUserRoleInformationByUserId",
                    params: [userId],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * count the user in database
 * @returns { Promise<CountGetUsersDTO> } - Promise resolving to query result
 */
export const countGetUsers = async (): Promise<CountGetUsersDTO> => {
    try {
        const sqlQuery = `
            SELECT
                COUNT(*) AS totalUsers
            FROM
                M_USERS AS MUs
                JOIN R_USER_ROLE AS RURs ON MUs.USER_ID = RURs.USER_ID
                JOIN M_ROLES AS MRs ON RURs.ROLE_ID = MRs.ROLE_ID
        `;

        const rows = await queryPromise<CountGetUsersDTO, CountGetUsersValue>(sqlQuery, []);
        if (!rows) {
            return { totalUsers: 0 };
        }

        return { totalUsers: Number(rows[0].totalUsers) };
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_COUNT_GET_USERS_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_COUNT_GET_USERS_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "countGetUsers",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * get the users in database
 * @returns { Promise<GetUsersDTO> } - Promise resolving to query result
 */
export const getUsers = async (limit: number, offset: number, sortField: string, sortType: string): Promise<GetUsersDTO[]> => {
    try {
        let sortFieldQuery = "CONCAT(MUs.USER_FIRST_NAME, MUs.USER_LAST_NAME)";
        let sortTypeQuery = "ASC";
        const sqlValue = [];

        if (FIELD_SORT_LIST_IN_GET_USERS.includes(sortField.toLocaleUpperCase())) {
            sortFieldQuery = sortField.toLocaleUpperCase();
        }

        if (SORT_TYPE.includes(sortType.toLocaleUpperCase())) {
            sortTypeQuery = sortType.toLocaleUpperCase();
        }
        sqlValue.push(limit);
        sqlValue.push(offset);

        const sqlQuery = `
            SELECT
                MUs.USER_FIRST_NAME AS firstName,
                MUs.USER_LAST_NAME AS lastName,
                MRs.ROLE_ID AS roleId,
                MRs.ROLE_NAME AS roleName,
                MUs.USER_AGE AS age,
                MUs.USER_ADDRESS AS address,
                MUs.USER_VERIFIED AS isVerified
            FROM 
                M_USERS AS MUs
                JOIN R_USER_ROLE AS RURs ON MUs.USER_ID = RURs.USER_ID
                JOIN M_ROLES AS MRs ON RURs.ROLE_ID = MRs.ROLE_ID
            
            ORDER BY 	
                ${sortFieldQuery} ${sortTypeQuery}
            LIMIT ?
            OFFSET ?;	

        `;

        const rows = await queryPromise<GetUsersDTO, GetUsersValue>(sqlQuery, sqlValue);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_USERS_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USERS_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUsers",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * get the user detail information in database
 * @returns { Promise<GetUserDetailDTO> } - Promise resolving to query result
 */
export const getUserDetailInformationByUserId = async (userId: string): Promise<GetUserDetailDTO[]> => {
    try {
        const sqlQuery = `
            SELECT
                MUs.USER_FIRST_NAME AS firstName,
                MUs.USER_LAST_NAME AS lastName,
                MRs.ROLE_ID AS roleId,
                MRs.ROLE_NAME AS roleName,
                MUs.USER_AGE AS age,
                MUs.USER_ADDRESS AS address,
                MUs.USER_VERIFIED AS isVerified
            FROM 
                M_USERS AS MUs
                JOIN R_USER_ROLE AS RURs ON MUs.USER_ID = RURs.USER_ID
                JOIN M_ROLES AS MRs ON RURs.ROLE_ID = MRs.ROLE_ID
            WHERE	
                MUs.USER_ID = ?
        `;

        const rows = await queryPromise<GetUserDetailDTO, GetUserDetailValue>(sqlQuery, [userId]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_USER_DETAIL_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USER_DETAIL_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUsers",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * update the user information
 * @param {PoolConnection} transaction
 * @param {IUpdateUserInformationPayload} param1
 * @returns { Promise<UpdateUserInformationDTO[]> } - Promise resolving to query result
 */
export const updateUserInformation = async (
    transaction: PoolConnection,
    { userId, firstName, lastName, age, email, phoneNumber, address, updateBy, updatedDate, timestamp }: IUpdateUserInformationPayload
): Promise<UpdateUserInformationDTO[]> => {
    try {
        const sqlUpdate = `
            UPDATE M_USERS
            SET
                USER_FIRST_NAME = ?,
                USER_LAST_NAME = ?,
                USER_AGE = ?,
                USER_EMAIL = ?,
                USER_PHONE_NUMBER = ?,
                USER_ADDRESS = ?,
                USER_UPDATED_BY = ?,
                USER_UPDATED_AT = ?,
                USER_UPDATED_AT_SYSTEM = ?
            WHERE USER_ID = ?;
        `;

        const rows = await transactionQueryPromise<UpdateUserInformationDTO, UpdateUserInformationValues>(transaction, sqlUpdate, [
            firstName,
            lastName,
            age,
            email,
            phoneNumber,
            address,
            updateBy,
            timestamp,
            updatedDate,
            userId,
        ]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_UPDATE_USER_INFOR_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_UPDATE_USER_INFOR_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "updateUserInformation",
                    params: [
                        JSON.stringify({
                            firstName,
                            lastName,
                            age,
                            email,
                            phoneNumber,
                            address,
                            updateBy,
                            timestamp,
                            updatedDate,
                            userId,
                        }),
                    ],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * delete a role for a user
 * @param {PoolConnection} transaction
 * @param {IDeleteRolesForUserPayload} param1
 * @returns { Promise<DeleteRolesForUserDTO[]> } - Promise resolving to query result
 */
export const deleteRoleForUser = async (transaction: PoolConnection, { roleIds, userId }: IDeleteRolesForUserPayload): Promise<DeleteRolesForUserDTO[]> => {
    try {
        const sqlInsert = `
            DELETE FROM R_USER_ROLE
            WHERE USER_ID = ? AND ROLE_ID IN (?);
        `;

        const rows = await transactionQueryPromise<DeleteRolesForUserDTO, DeleteRolesForUserValues>(transaction, sqlInsert, [userId, roleIds]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_INSERT_NEW_ROLES_FOR_USER_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_INSERT_NEW_ROLES_FOR_USER_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "deleteRolesForUser",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * insert new role for a user
 * @param {PoolConnection} transaction
 * @param {IInsertNewRolesForUserPayload} param1
 * @returns { Promise<InsertNewRolesForUserDTO[]> } - Promise resolving to query result
 */
export const insertNewRolesForUser = async (
    transaction: PoolConnection,
    { roleIds, userId, insertBy, createdDate, updatedDate, timestamp }: IInsertNewRolesForUserPayload
): Promise<InsertNewRolesForUserDTO[]> => {
    try {
        let sqlValues: InsertNewRolesForUserValues = [];
        let valueClauses = roleIds
            .map((roleId) => {
                sqlValues.push(userId, roleId, insertBy, timestamp, createdDate, insertBy, timestamp, updatedDate);
                return `(?, ?, '0', ?, ?, ?, ?, ?, ?)`;
            })
            .join(",");

        const sqlInsert = `
            INSERT INTO R_USER_ROLE (
                USER_ID,
                ROLE_ID,
                DELETE_FLG,
                CREATED_BY,
                CREATED_AT,
                CREATED_AT_SYSTEM,
                UPDATED_BY,
                UPDATED_AT,
                UPDATED_AT_SYSTEM)
            VALUES ${valueClauses};
        `;

        const rows = await transactionQueryPromise<InsertNewRolesForUserDTO, InsertNewRolesForUserValues>(transaction, sqlInsert, sqlValues);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_INSERT_NEW_ROLES_FOR_USER_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_INSERT_NEW_ROLES_FOR_USER_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "insertNewRolesForUser",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
