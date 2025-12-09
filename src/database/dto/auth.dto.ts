import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";
import { DefaultInsertDTO, DefaultValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUserInformationByUserIdValue extends DefaultValues {}

export interface GetUserInformationByUserIdDTO {
    userId: string;
    lastName: string;
    age: number;
    deleteFlg: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUserInformationByUsernamePasswordValue extends DefaultValues {}

export interface GetUserInformationByUsernamePasswordDTO {
    userId: string;
    lastName: string;
    age: number;
    deleteFlg: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetRoleInformationByRoleIdValues extends DefaultValues {}

export interface GetRoleInformationByRoleIdDTO {
    roleId: string;
    roleName: string;
}

export interface IInsertUserInformationPayload {
    newUserId: string;
    firstName: string;
    lastName: string;
    age: number;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    address: string;
    userId: string;
    createdDate: string;
    updatedDate: string;
    timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertUserInformationValues extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertUserInformationDTO extends DefaultInsertDTO {}

export interface IInsertRoleRelationshipInformationPayload {
    roleId: string;
    newUserId: string;
    userId: string;
    createdDate: string;
    updatedDate: string;
    timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertRoleRelationshipInformationValues extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertRoleRelationshipInformationDTO extends DefaultInsertDTO {}
