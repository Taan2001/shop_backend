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

export interface GetUsersValue {
    [index: number]: string | number;
}

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
