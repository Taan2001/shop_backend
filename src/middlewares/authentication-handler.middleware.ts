// libs
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/common";
import { verifyAccessToken } from "../utils/jwt";
import { ERROR_LIST } from "../constants/error.constant";

/**
 * Authentication Handler
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 */
const authenticationHandlerMiddleware = async (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        const authorization = request.headers["authorization"];

        if (!authorization) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.MISSING_AUTHORIZATION_HEADER.ERROR_CODE,
                errorMessages: [ERROR_LIST.MISSING_AUTHORIZATION_HEADER.ERROR_MESSAGE()],
                errorParams: ["Authorization"],
                errorDetails: [
                    {
                        functionName: "authenticationHandlerMiddleware",
                        params: ["Authorization"],
                        errorMessage: "Bearer token is not passed in request header.",
                    },
                ],
            });
        }

        const accessToken = authorization.split(" ")[1];

        await verifyAccessToken(request, accessToken);

        nextFunction();
    } catch (error) {
        nextFunction(error);
    }
};

export default authenticationHandlerMiddleware;
