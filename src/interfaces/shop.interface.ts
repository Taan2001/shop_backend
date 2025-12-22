import { IPageInfo } from "./app.interface";

// data transfer object
import { GetShopsDTO } from "../database/dto/shop.dto";

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
