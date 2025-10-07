import { GetUsersDTO } from "../database/dto/user.dto";

export interface IRequestQueryUsers {
    limit: "10" | "20" | "50" | "100";
    currentPage: string;
    sortType: "ASC" | "DESC" | "asc" | "desc" | "";
    sortField: string;
}

export interface IUsersSuccess {
    users: GetUsersDTO[];
    pageInfo: {
        limit: number;
        currentPage: number;
        totalRecords: number;
        totalPages: number;
    };
}

export interface IRequestpPathUserDetail {
    userId: string;
}

export interface IUserDetailSuccess {
    user: Omit<GetUsersDTO, "roleId" | "roleName"> & {
        roles: {
            roleId: string;
            roleName: string;
        }[];
    };
}
