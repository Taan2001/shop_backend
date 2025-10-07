// database
import { queryPromise } from "../connection-pool";
import {
    GetUserRoleInformationByUserIdDTO,
    GetUserRoleInformationByUserIdValue,
    CountGetUsersDTO,
    CountGetUsersValue,
    GetUsersDTO,
    GetUsersValue,
    GetUserDetailDTO,
    GetUserDetailValue,
} from "../dto/user.dto";

// constants
import { ERROR_LIST } from "../../constants/error.constant";

// utils
import { ResponseError } from "../../utils/common";
import { FIELD_SORT_LIST_IN_GET_USERS, SORT_TYPE } from "../../constants/sort.constant";

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
                JOIN R_USER_ROLES AS RURs ON RURs.ROLE_ID = MRs.ROLE_ID
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
            errorCode: ERROR_LIST.QUERY_GET_USER_ROLE_INFOR_BY_ID_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_USER_ROLE_INFOR_BY_ID_ERROR.ERROR_MESSAGE()],
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
                JOIN R_USER_ROLES AS RURs ON MUs.USER_ID = RURs.USER_ID
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
                MUs.USER_VERIFY AS isVerified
            FROM 
                M_USERS AS MUs
                JOIN R_USER_ROLES AS RURs ON MUs.USER_ID = RURs.USER_ID
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
                MUs.USER_VERIFY AS isVerified
            FROM 
                M_USERS AS MUs
                JOIN R_USER_ROLES AS RURs ON MUs.USER_ID = RURs.USER_ID
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
