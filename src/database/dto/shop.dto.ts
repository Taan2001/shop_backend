import { DefaultInsertDTO, DefaultValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PostShopDetailValues extends DefaultValues {}

export interface IPostShopDetailPayload {
    shopId: string;
    shopName: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    status: number;
    deleteFlg: number;
    timestamp: number;
    updatedDate: string;
    updatedBy: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PostShopDetailDTO extends DefaultInsertDTO {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetShopDetailValue extends DefaultValues {}

export interface GetShopDetailDTO {
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
    deleteFlg?: number;
    status: number;
    isVerified: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CountGetShopsValue extends DefaultValues {}

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
    deleteFlg: number;
    status: number;
    isVerified: number;
}
