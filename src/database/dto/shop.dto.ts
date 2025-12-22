import { DefaultInsertDTO, DefaultValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CountGetShopsValue extends DefaultValues {
    [index: number]: string;
}

export interface CountGetShopsDTO {
    totalShops: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetShopsValue extends DefaultValues {}

export interface GetShopsDTO {
    shopId: string;
    shopCode: string;
    shopName: string;
    ownerId: string;
    ownerName: number;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    status: number;
    isVerified: number;
}
