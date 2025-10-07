import { Request, Response, NextFunction } from "express";

export interface IAppSuccess<D> {
    statusCode: number;
    data: D;
}

export interface IErrorDetail {
    functionName: string;
    params: string[];
    errorMessage: string;
}

export interface IAppError {
    statusCode: number;
    errorCode: string;
    errorMessages: string[];
    errorParams?: string[];
    errorDetails?: IErrorDetail[];
}

export interface IAsyncFunction {
    (request: Request, response: Response, nextFunction: NextFunction): Promise<void>;
}
export interface IResponseSuccess<D> extends IAppSuccess<D> {
    status: "success";
}

export interface IResponseError extends IAppError {
    status: "error";
}

export interface IExceptionResponseError extends Omit<IResponseError, "statusCode"> {
    errorException: Error;
}

export interface IRequestUserInformation {
    userId: string;
    lastName: string;
    age: number;
    deleteFlg: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICurrentUser extends IRequestUserInformation {}
