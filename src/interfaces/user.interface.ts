import { GetUsersDTO } from "../database/dto/user.dto";
import { IPageInfo } from "./app.interface";

export interface IRequestQueryGetUsers {
    limit: "10" | "20" | "50" | "100";
    currentPage: string;
    sortType: "ASC" | "DESC" | "asc" | "desc" | "";
    sortField: string;
}

export interface IGetUsersSuccess {
    users: GetUsersDTO[];
    pageInfo: IPageInfo;
}

export interface IRequestpPathGetUserDetail {
    userId: string;
}

export interface IGetUserDetailSuccess {
    user: Omit<GetUsersDTO, "roleId" | "roleName"> & {
        roles: {
            roleId: string;
            roleName: string;
        }[];
    };
}

export interface IRequestpPathPostUserDetail {
    userId: string;
}

export interface IRequestBodyPostUserDetail {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phoneNumber: string;
    address: string;
    roleIds: string[];
}

export interface IPostUserDetailSuccess {
    messages: string[];
}
