// libs
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/common";
import { verifyAccessToken } from "../utils/jwt";
import { ERROR_LIST } from "../constants/error.constant";
import { getUserInformationByUserId } from "../database/repositories/auth.repository";

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

        const userInformation = await verifyAccessToken(request, accessToken);

        const users = await getUserInformationByUserId(userInformation.userId);

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        // Step 4: Generate a new accessToken (refer sheet postSignIn)
        const user = users[0];

        nextFunction();
    } catch (error) {
        nextFunction(error);
    }
};

export default authenticationHandlerMiddleware;
