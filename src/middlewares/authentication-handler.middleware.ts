// libs
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/common";
import { verifyToken } from "../utils/jwt";

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
                apiName: request.apiName,
                errorCode: "E00004",
                errorMessages: ["Missing Authorization header."],
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

        await verifyToken(request, accessToken, "accessToken");

        nextFunction();
    } catch (error) {
        nextFunction(error);
    }
};

export default authenticationHandlerMiddleware;
