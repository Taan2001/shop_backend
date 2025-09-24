// libs
import { Request, Response, NextFunction } from "express";

// interfaces
import { IAppError, IAppSuccess, IAsyncFunction, IResponseError, IResponseSuccess } from "../interfaces/app.interface";

/**
 * Response Success Function
 * @param {number} statusCode status code http
 * @param {D} data the data return to client
 * @returns IResponseSuccess<D>
 */
export const ResponseSuccess = <D>({ statusCode, data }: IAppSuccess<D>): IResponseSuccess<D> => {
    return {
        status: "success",
        statusCode,
        data,
    };
};

/**
 * Response Error Function
 * @param {string} apiName the api name
 * @param {number} statusCode status code http
 * @param {string} errrorCode error code
 * @param {string[]} errorMessage error message
 * @param {string[]} errorParams the params cause request error
 * @param {ErrorDetail[]} errorDetails the details of error
 * @returns {IResponseError} IResponseError
 */
export const ResponseError = ({ apiName, statusCode, errorCode, errorMessages, errorParams = [], errorDetails = [] }: IAppError): IResponseError => ({
    status: "error",
    apiName,
    statusCode,
    errorCode,
    errorMessages,
    errorParams,
    errorDetails,
});

/**
 * Catch Async Function
 * @param {IAsyncFunction} fn the async function
 * @returns (request: Request, response: Response, nextFunction: NextFunction) => void
 */
export const catchAsync = (fn: IAsyncFunction) => (request: Request, response: Response, nextFunction: NextFunction) => {
    fn(request, response, nextFunction).catch((error) => nextFunction(error));
};
