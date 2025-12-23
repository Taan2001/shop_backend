import { IPageInfo } from "./app.interface";

// data transfer object
import { GetShopDetailDTO, GetShopsDTO } from "../database/dto/shop.dto";

export interface IRequestPathPostShopDetail {
    shopId: string;
}

export interface IRequestBodyPostShopDetail {
    shopName: string;
    description: string;
    email: string;
    address: string;
    phone: string;
    city: string;
    status: 0 | 1;
    deleteFlg: 0 | 1;
}

export interface IPostShopDetailSuccess {
    shop: { shopId: string };
    messages: string[];
}

export interface IRequestPathGetShopDetail {
    shopId: string;
}

export interface IGetShopDetailSuccess {
    shop: GetShopDetailDTO;
}
export interface IRequestQueryGetShops {
    limit: "10" | "20" | "50" | "100";
    currentPage: string;
    sortType: "ASC" | "DESC" | "asc" | "desc" | "";
    sortField: string;
}

export interface IGetShopsSuccess {
    shops: GetShopsDTO[];
    pageInfo: IPageInfo;
}
