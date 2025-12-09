import { DefaultInsertDTO, DefaultValues } from ".";

export interface GetUserRoleInformationByUserIdValue {
    [index: number]: string;
}

export interface GetUserRoleInformationByUserIdDTO {
    roleId: string;
    roleName: string;
}

export interface CountGetUsersValue {
    [index: number]: string;
}

export interface CountGetUsersDTO {
    totalUsers: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUsersValue extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUsersDTO extends GetUserDetailDTO {}

export interface GetUserDetailValue {
    [index: number]: string;
}

export interface GetUserDetailDTO {
    firstName: string;
    lastName: string;
    roleId: string;
    roleName: string;
    age: number;
    address: string;
    isVerified: number;
}

export interface IUpdateUserInformationPayload {
    userId: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phoneNumber: string;
    address: string;
    updateBy: string;
    updatedDate: string;
    timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserInformationValues extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserInformationDTO extends DefaultInsertDTO {}

export interface IInsertNewRolesForUserPayload {
    roleIds: string[];
    userId: string;
    insertBy: string;
    createdDate: string;
    updatedDate: string;
    timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertNewRolesForUserValues extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertNewRolesForUserDTO extends DefaultInsertDTO {}

export interface IDeleteRolesForUserPayload {
    userId: string;
    roleIds: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DeleteRolesForUserValues extends DefaultValues {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DeleteRolesForUserDTO extends DefaultInsertDTO {}
