import { IPageInfo } from "./app.interface";

// data transfer object
import { GetShopDetailDTO, GetShopsDTO } from "../database/dto/shop.dto";

export interface IRequestpPathGetShopDetail {
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
