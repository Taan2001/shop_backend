// libs
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

// database
import { queryPromise, transactionQueryPromise } from "../connection-pool";

// data transfer object
import { CountGetShopsDTO, CountGetShopsValue, GetShopsDTO, GetShopsValue } from "../dto/shop.dto";

// utils
import { ResponseError } from "../../utils/common";

// constants
import { ERROR_LIST } from "../../constants/error.constant";
import { FIELD_SORT_LIST_IN_GET_SHOPS, SORT_TYPE } from "../../constants/sort.constant";

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
