// libs
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { Request, NextFunction } from "express";

// utils
import { ResponseError } from "./common";

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
                apiName: request.apiName,
                errorCode: "E00001",
                errorMessages: ["The environment variable 'JWT_ACCESS_TOKEN_SECRET' does not exist."],
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
                apiName: request.apiName,
                errorCode: "E00001",
                errorMessages: ["The environment variable 'JWT_ACCESS_TOKEN_EXPIRES_IN' does not exist."],
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
                                apiName: request.apiName,
                                errorCode: "E00002",
                                errorMessages: ["An error occurred while generating the access token."],
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
                apiName: request.apiName,
                errorCode: "E00001",
                errorMessages: ["The environment variable 'JWT_REFRESH_TOKEN_SECRET' does not exist."],
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
                apiName: request.apiName,
                errorCode: "E00001",
                errorMessages: ["The environment variable 'JWT_REFRESH_TOKEN_EXPIRES_IN' does not exist."],
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
                                apiName: request.apiName,
                                errorCode: "E00003",
                                errorMessages: ["An error occurred while generating the refresh token."],
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
 * Generate Refresh Token Function
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 * @param {string | object | Buffer} payload - Payload to sign, could be an literal, buffer or string
 * @returns {boolean} -
 */
export const verifyToken = async (request: Request, token: string, tokenName: "accessToken" | "refreshToken") => {
    let paramName = "";
    let secret: string | undefined;
    let errorCode: string;

    if (tokenName === "accessToken") {
        paramName = "JWT_ACCESS_TOKEN_SECRET";
        secret = process.env.JWT_ACCESS_TOKEN_SECRET;
        errorCode = "E00005";
    }

    if (tokenName === "refreshToken") {
        paramName = "JWT_REFRESH_TOKEN_SECRET";
        secret = process.env.JWT_REFRESH_TOKEN_SECRET;
        errorCode = "E00006";
    }

    try {
        // Check if environment variables are set
        if (!secret) {
            throw ResponseError({
                statusCode: 400,
                apiName: request.apiName,
                errorCode: "E00001",
                errorMessages: [`The environment variable '${paramName}' does not exist.`],
                errorParams: [paramName],
                errorDetails: [
                    {
                        functionName: "verifyToken",
                        params: [paramName],
                        errorMessage: `The environment variable '${paramName}' does not exist or has no data.`,
                    },
                ],
            });
        }

        // Verify token
        await new Promise<void>((resolve, reject) => {
            jwt.verify(token, secret, async (error, decoded) => {
                if (error) {
                    reject(
                        ResponseError({
                            statusCode: 401,
                            apiName: request.apiName,
                            errorCode: errorCode,
                            errorMessages: [`Unauthorized ${tokenName}`],
                            errorParams: [tokenName],
                            errorDetails: [
                                {
                                    functionName: "jwt.verify",
                                    params: [tokenName],
                                    errorMessage: `The ${tokenName} is expired.`,
                                },
                            ],
                        })
                    );
                }
                // TO DO
                // =====

                resolve();
            });
        });
    } catch (error) {
        throw error;
    }
};
