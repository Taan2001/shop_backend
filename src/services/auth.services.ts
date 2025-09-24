// libs
import { Request, NextFunction } from "express";

// interfaces
import { ISignInSuccess } from "../interfaces/auth.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

/**
 * Sign In Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getSignInService = async (request: Request, nextFunction: NextFunction) => {
    try {
        // Simulate some business logic, e.g., validating user credentials
        const { username, password } = request.query;

        const accessToken = await generateAccessToken(request, nextFunction, { username });
        const refreshToken = await generateRefreshToken(request, nextFunction, { username });

        if (username === "admin" && password === "password") {
            return ResponseSuccess<ISignInSuccess>({ statusCode: 200, data: { user: { username: username }, accessToken, refreshToken } });
        } else {
            throw ResponseError({
                statusCode: 400,
                apiName: request.baseUrl + request.route.path,
                errorCode: "E99999",
                errorMessages: ["Invalid credentials"],
            });
        }
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
    const { username, password } = request.query;

    if (username === "admin" && password === "password") {
        return ResponseSuccess<ISignInSuccess>({ statusCode: 200, data: { user: { username: username } } });
    } else {
        throw ResponseError({ statusCode: 400, apiName: request.baseUrl + request.route.path, errorCode: "E00001", errorMessages: ["Invalid credentials"] });
    }
};
