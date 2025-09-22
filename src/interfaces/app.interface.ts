import { Request, Response, NextFunction } from "express";

export interface IAppSuccess<D> {
    status?: "success";
    data: D;
}

export interface IAppError<T> {
    status?: "error";
    statusCode: string;
    message: T;
}

export interface IAsyncFunction {
    (request: Request, response: Response, next: NextFunction): Promise<void>;
}
