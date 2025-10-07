// libs
import { Request, NextFunction } from "express";

// interfaces
import { IRefreshTokenSucess, IRequestBodyRefreshToken, IRequestBodySignIn, ISignInSuccess } from "../interfaces/auth.interface";
import { IResponseSuccess } from "../interfaces/app.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

// constants
import { ERROR_LIST } from "../constants/error.constant";

// database repositories
import { getUserInformationByUserId, getUserInformationByUsernamePassword } from "../database/repositories/auth.repository";

/**
 * Refresh Token Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postRefreshTokenService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IRefreshTokenSucess>> => {
    try {
        // Step 1: Get refreshToken in request body.
        const { refreshToken } = request.body as IRequestBodyRefreshToken;
        if (!refreshToken) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_REFRESH_TOKEN_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.REQUEST_BODY_PARAMS_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
            });
        }

        // Step 2: Verify and decode the refreshToken.
        const currentUser = await verifyRefreshToken(request, refreshToken);

        // Step 3: Get the userInformation.
        const users = await getUserInformationByUserId(currentUser.userId);

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
        const accessToken = await generateAccessToken(request, nextFunction, user);
        return ResponseSuccess<ISignInSuccess>({ statusCode: 200, data: { user: { userId: user.userId }, accessToken, refreshToken } });
    } catch (error) {
        throw error;
    }
};

/**
 * Sign In Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postSignInService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<ISignInSuccess>> => {
    try {
        // get value in request body
        const { username, password } = request.body as IRequestBodySignIn;
        const messages = [];

        // Step 1: Get and validate the request body.
        if (!username) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_MESSAGE("username"));
        }

        if (!password) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_MESSAGE("password"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 2: Get the userInformation in database.
        const users = await getUserInformationByUsernamePassword(username, password);

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

        // Step 3: Generate the accessToken and refreshToken.
        const user = users[0];
        const accessToken = await generateAccessToken(request, nextFunction, user);
        const refreshToken = await generateRefreshToken(request, nextFunction, user);

        return ResponseSuccess<ISignInSuccess>({ statusCode: 200, data: { user: { userId: user.userId }, accessToken, refreshToken } });
    } catch (error) {
        throw error;
    }
};

/**
 * Sign Up Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postSignUpService = async (request: Request, nextFunction: NextFunction) => {
    // Simulate some business logic, e.g., validating user credentials
    // const { username, password } = request.query;
    // if (username === "admin" && password === "password") {
    //     return ResponseSuccess<ISignInSuccess>({ statusCode: 200, data: { user: { userId: username } } });
    // } else {
    //     throw ResponseError({ statusCode: 400, apiName: request.baseUrl + request.route.path, errorCode: "E00001", errorMessages: ["Invalid credentials"] });
    // }
};
