import { Request, Response, NextFunction } from "express";
import { IAppError, IAppSuccess, IAsyncFunction } from "../interfaces/app.interface";

export const ResponseSuccess = <D>({ data }: IAppSuccess<D>) => {
    return { status: "success", data };
};

export const ResponseError = <T>({ message, statusCode }: IAppError<T>) => {
    return { status: "error", statusCode, message };
};

export const catchAsync = (fn: IAsyncFunction) => (request: Request, response: Response, next: NextFunction) => {
    fn(request, response, next).catch((error) => next(error));
};
