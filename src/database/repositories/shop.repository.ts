// libs
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

// database
import { queryPromise, transactionQueryPromise } from "../connection-pool";

// data transfer object
import {
    CountGetShopsDTO,
    CountGetShopsValue,
    GetShopDetailDTO,
    GetShopDetailValue,
    GetShopsDTO,
    GetShopsValue,
    IPostShopDetailPayload,
    PostShopDetailDTO,
    PostShopDetailValues,
} from "../dto/shop.dto";

// utils
import { ResponseError } from "../../utils/common";

// constants
import { ROLES } from "../../constants/common.constant";
import { ERROR_LIST } from "../../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_SHOPS, SORT_TYPE } from "../../constants/sort.constant";

export const updateShopInformationById = async (transaction: PoolConnection, payload: IPostShopDetailPayload): Promise<PostShopDetailDTO[]> => {
    try {
        let sqlSet = `SET 
                SHOP_NAME = ?,
                SHOP_DESCRIPTION = ?,
                SHOP_EMAIL = ?,
                SHOP_PHONE = ?,
                SHOP_ADDRESS = ?,
                SHOP_CITY = ?,
                SHOP_UPDATED_BY = ?,
                SHOP_UPDATED_AT = ?,
                SHOP_UPDATED_AT_SYSTEM = ?`;

        const sqlValues = [
            payload.shopName,
            payload.description,
            payload.email,
            payload.phone,
            payload.address,
            payload.city,
            payload.updatedBy,
            payload.timestamp,
            payload.updatedDate,
        ];

        if (payload.deleteFlg !== undefined) {
            sqlSet = `${sqlSet},
                SHOP_DELETE_FLG = ?`;
            sqlValues.push(payload.deleteFlg);
        }
        if (payload.status !== undefined) {
            sqlSet = `${sqlSet},
                SHOP_STATUS = ?`;
            sqlValues.push(payload.status);
        }

        const sqlUpdate = `
            UPDATE M_SHOPS
            ${sqlSet}
            WHERE
                SHOP_ID = ?;
        `;

        const rows = await transactionQueryPromise<PostShopDetailDTO, PostShopDetailValues>(transaction, sqlUpdate, [...sqlValues, payload.shopId]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_UPDATE_SHOP_INFOR_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_UPDATE_SHOP_INFOR_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "updateShopInformationById",
                    params: [
                        JSON.stringify({
                            shopId: payload.shopId,
                            shopName: payload.shopName,
                            description: payload.description,
                            email: payload.email,
                            phone: payload.phone,
                            address: payload.address,
                            city: payload.city,
                            status: payload.status,
                            updatedBy: payload.updatedBy,
                            timestamp: payload.timestamp,
                            updatedDate: payload.updatedDate,
                        }),
                    ],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

export const getShopDetailInformationById = async (shopId: string, roleIds: string[]): Promise<GetShopDetailDTO[]> => {
    try {
        let sqlSelect = `
            SELECT
                MSs.SHOP_ID AS shopId,
                MSs.SHOP_CODE AS shopCode,
                MSs.SHOP_NAME AS shopName,
                MSs.SHOP_OWNER AS ownerId,
                CONCAT(MUs.USER_FIRST_NAME, " ", MUs.USER_LAST_NAME) AS ownerName,
                MSs.SHOP_DESCRIPTION AS description,
                MSs.SHOP_EMAIL AS email,
                MSs.SHOP_PHONE AS phone,
                MSs.SHOP_ADDRESS AS address,
                MSs.SHOP_CITY AS city,
                MSs.SHOP_STATUS AS status,
                MSs.SHOP_VERIFIED AS isVerified
        `;
        const sqlFrom = `
            FROM 	
                M_SHOPS AS MSs
                INNER JOIN M_USERS AS MUs ON MUs.USER_ID = MSs.SHOP_OWNER
        `;
        let sqlWhere = `
            WHERE	
                MSs.SHOP_ID = ?
        `;
        if (roleIds.includes(ROLES.ADMIN)) {
            sqlSelect += `,
                MSs.SHOP_DELETE_FLG AS deleteFlg
            `;
        } else {
            sqlWhere += `
                AND MSs.SHOP_DELETE_FLG = 0
            `;
        }

        const sqlQuery = `
            ${sqlSelect}
            ${sqlFrom}
            ${sqlWhere};
        `;

        const rows = await queryPromise<GetShopDetailDTO, GetShopDetailValue>(sqlQuery, [shopId]);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_SHOP_DETAIL_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_SHOP_DETAIL_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getShopDetailInformationById",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * count shop in database
 * @returns { Promise<CountGetShopsDTO> } - Promise resolving to count of shops
 */
export const countGetShops = async (): Promise<CountGetShopsDTO> => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS totalShops
            FROM 
                M_SHOPS
        `;

        const rows = await queryPromise<CountGetShopsDTO, CountGetShopsValue>(query);

        return { totalShops: Number(rows[0]?.totalShops) || 0 };
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_COUNT_GET_SHOPS_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_COUNT_GET_SHOPS_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "countGetShops",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * get the shops in database
 * @returns { Promise<GetShopsDTO[]> } - Promise resolving to query result
 */
export const getShops = async (limit: number, offset: number, sortField: string, sortType: string): Promise<GetShopsDTO[]> => {
    try {
        let sortFieldQuery = "SHOP_NAME";
        let sortTypeQuery = "ASC";

        const sqlValue = [];

        if (FIELD_SORT_LIST_IN_GET_SHOPS.includes(sortField.toLocaleUpperCase())) {
            sortFieldQuery = sortField.toLocaleUpperCase();
        }

        if (SORT_TYPE.includes(sortType.toLocaleUpperCase())) {
            sortTypeQuery = sortType.toLocaleUpperCase();
        }

        sqlValue.push(limit);
        sqlValue.push(offset);

        const sqlQuery = ` 
            SELECT	
                MSs.SHOP_ID AS shopId,
                MSs.SHOP_CODE AS shopCode,
                MSs.SHOP_NAME AS shopName,
                MSs.SHOP_OWNER AS ownerId,
                CONCAT(MUs.USER_FIRST_NAME, " ", MUs.USER_LAST_NAME) AS ownerName,
                MSs.SHOP_DESCRIPTION AS description,
                MSs.SHOP_EMAIL AS email,
                MSs.SHOP_PHONE AS phone,
                MSs.SHOP_ADDRESS AS address,
                MSs.SHOP_CITY AS city,
                MSs.SHOP_DELETE_FLG AS deleteFlg,
                MSs.SHOP_STATUS AS status,
                MSs.SHOP_VERIFIED AS isVerified
            FROM 	
                M_SHOPS AS MSs
                INNER JOIN M_USERS AS MUs ON MUs.USER_ID = MSs.SHOP_OWNER
            ORDER BY 	
                ${sortFieldQuery} ${sortTypeQuery}
            LIMIT ?
            OFFSET ?;
        `;
        const rows = await queryPromise<GetShopsDTO, GetShopsValue>(sqlQuery, sqlValue);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERROR_LIST.QUERY_GET_SHOPS_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.QUERY_GET_SHOPS_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getShops",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
