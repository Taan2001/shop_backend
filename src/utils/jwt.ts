// libs
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { Request, NextFunction } from "express";

// utils
import { ResponseError } from "./common";
import { ERROR_LIST } from "../constants/error.constant";
import { ICurrentUser } from "../interfaces/app.interface";

// interfaces

/**
 * Generate Access Token Function
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 * @param {string | object | Buffer} payload - Payload to sign, could be an literal, buffer or string
 * @returns {string} - The JSON Web Token string
 */
export const generateAccessToken = async <T extends string | object | Buffer>(request: Request, nextFunction: NextFunction, payload: T) => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_SECRET")],
                errorParams: ["JWT_ACCESS_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_ACCESS_TOKEN_SECRET"],
                        errorMessage: "The environment variable 'JWT_ACCESS_TOKEN_SECRET' does not exist or has no data.",
                    },
                ],
            });
        }

        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_EXPIRES_IN")],
                errorParams: ["JWT_ACCESS_TOKEN_EXPIRES_IN"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_ACCESS_TOKEN_EXPIRES_IN"],
                        errorMessage: "The environment variable 'JWT_ACCESS_TOKEN_EXPIRES_IN' does not exist or has no data.",
                    },
                ],
            });
        }
        // Generate token
        return await new Promise<string>((resolve, reject) => {
            jwt.sign(
                payload,
                String(process.env.JWT_ACCESS_TOKEN_SECRET),
                {
                    expiresIn: String(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) as StringValue,
                },
                (error, accessToken) => {
                    if (error || accessToken === undefined) {
                        reject(
                            ResponseError({
                                statusCode: 400,
                                errorCode: ERROR_LIST.GENERATE_ACCESS_TOKEN_ERROR.ERROR_CODE,
                                errorMessages: [ERROR_LIST.GENERATE_ACCESS_TOKEN_ERROR.ERROR_MESSAGE()],
                                errorParams: ["payload"],
                                errorDetails: [
                                    {
                                        functionName: "jwt.sign",
                                        params: [JSON.stringify(payload)],
                                        errorMessage: JSON.stringify(error),
                                    },
                                ],
                            })
                        );
                        return;
                    }

                    resolve(accessToken);
                }
            );
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Generate Refresh Token Function
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 * @param {string | object | Buffer} payload - Payload to sign, could be an literal, buffer or string
 * @returns {string} - The JSON Web Token string
 */
export const generateRefreshToken = async <T extends string | object | Buffer>(request: Request, nextFunction: NextFunction, payload: T) => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_SECRET")],
                errorParams: ["JWT_REFRESH_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_REFRESH_TOKEN_SECRET"],
                        errorMessage: "The environment variable 'JWT_REFRESH_TOKEN_SECRET' does not exist or has no data.",
                    },
                ],
            });
        }

        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_EXPIRES_IN")],
                errorParams: ["JWT_REFRESH_TOKEN_EXPIRES_IN"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_REFRESH_TOKEN_EXPIRES_IN"],
                        errorMessage: "The environment variable 'JWT_REFRESH_TOKEN_EXPIRES_IN' does not exist or has no data.",
                    },
                ],
            });
        }

        // Generate refresh token
        return await new Promise<string>((resolve, reject) => {
            jwt.sign(
                payload,
                String(process.env.JWT_REFRESH_TOKEN_SECRET),
                {
                    expiresIn: String(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) as StringValue,
                },
                (error, refreshToken) => {
                    if (error || !refreshToken) {
                        reject(
                            ResponseError({
                                statusCode: 400,
                                errorCode: ERROR_LIST.GENERATE_REFRESH_TOKEN_ERROR.ERROR_CODE,
                                errorMessages: [ERROR_LIST.GENERATE_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
                                errorParams: ["payload"],
                                errorDetails: [
                                    {
                                        functionName: "jwt.sign",
                                        params: [JSON.stringify(payload)],
                                        errorMessage: JSON.stringify(error),
                                    },
                                ],
                            })
                        );
                        return;
                    }

                    resolve(refreshToken);
                }
            );
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Access Token Function
 * @param {Request} request - Express Request
 * @param {string} accessToken - Access Token
 */
export const verifyAccessToken = async (request: Request, accessToken: string): Promise<ICurrentUser> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_SECRET")],
                errorParams: ["JWT_ACCESS_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "verifyToken",
                        params: ["JWT_ACCESS_TOKEN_SECRET"],
                        errorMessage: `The environment variable JWT_ACCESS_TOKEN_SECRET does not exist or has no data.`,
                    },
                ],
            });
        }

        // Verify token
        return await new Promise<ICurrentUser>((resolve, reject) => {
            jwt.verify(accessToken, String(process.env.JWT_ACCESS_TOKEN_SECRET), async (error, decoded) => {
                if (error) {
                    reject(
                        ResponseError({
                            statusCode: 401,
                            errorCode: ERROR_LIST.VERIFY_ACCESS_TOKEN_ERROR.ERROR_CODE,
                            errorMessages: [ERROR_LIST.VERIFY_ACCESS_TOKEN_ERROR.ERROR_MESSAGE()],
                            errorParams: ["accessToken"],
                            errorDetails: [
                                {
                                    functionName: "verifyAccessToken",
                                    params: [accessToken],
                                    errorMessage: String(error),
                                },
                            ],
                        })
                    );
                }
                // TO DO
                const currentUser = decoded as ICurrentUser;
                // =====

                resolve(currentUser);
            });
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Refresh Token Function
 * @param {Request} request - Express Request
 * @param {string} refreshToken - Refresh Token
 * @returns {boolean} -
 */
export const verifyRefreshToken = async (request: Request, refreshToken: string): Promise<ICurrentUser> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_SECRET")],
                errorParams: ["JWT_REFRESH_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "verifyToken",
                        params: ["JWT_REFRESH_TOKEN_SECRET"],
                        errorMessage: `The environment variable '${"JWT_REFRESH_TOKEN_SECRET"}' does not exist or has no data.`,
                    },
                ],
            });
        }

        // Verify token
        return await new Promise<ICurrentUser>((resolve, reject) => {
            jwt.verify(refreshToken, String(process.env.JWT_REFRESH_TOKEN_SECRET), async (error, decoded) => {
                if (error) {
                    reject(
                        ResponseError({
                            statusCode: 401,
                            errorCode: ERROR_LIST.VERIFY_REFRESH_TOKEN_ERROR.ERROR_CODE,
                            errorMessages: [ERROR_LIST.VERIFY_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
                            errorParams: ["refreshToken"],
                            errorDetails: [
                                {
                                    functionName: "verifyRefreshToken",
                                    params: [refreshToken],
                                    errorMessage: String(error),
                                },
                            ],
                        })
                    );
                }
                // TO DO
                const currentUser = decoded as ICurrentUser;
                // =====

                resolve(currentUser);
            });
        });
    } catch (error) {
        throw error;
    }
};
