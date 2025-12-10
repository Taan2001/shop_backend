// libs
import rateLimit from "express-rate-limit";

// utils
import { ResponseError } from "../utils/common";
import { NextFunction, Request, Response } from "express";
import { ERROR_LIST } from "../constants/error.constant";

export const signInLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: "E000xx",
            errorMessages: ["Temporarily unable to sign in. Please try again in 5 minutes."],
        });
    },
});

export const signUpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: "E000xx",
            errorMessages: ["Temporarily unable to sign up. Please try again in 15 minutes."],
        });
    },
});

export const refreshAccessTokenLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 2,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: ERROR_LIST.VERIFY_REFRESH_TOKEN_ERROR.ERROR_CODE,
            errorMessages: [ERROR_LIST.VERIFY_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
            errorParams: ["refreshToken"],
            errorDetails: [
                {
                    functionName: "refreshAccessTokenLimiter",
                    params: [request.body.refreshToken],
                    errorMessage: "Temporarily unable to get access Token. Please try sign in again.",
                },
            ],
        });
    },
});

export const getUsersLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: "E000xx",
            errorMessages: ["The number of accesses is exceeded. Please try again in 5 minutes."],
        });
    },
});

export const getUserDetailLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: "E000xx",
            errorMessages: ["The number of accesses is exceeded. Please try again in 5 minutes."],
        });
    },
});

export const postUserDetailLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "",
    handler: (request: Request, response: Response, nextFunction: NextFunction) => {
        throw ResponseError({
            statusCode: 429,
            errorCode: "E000xx",
            errorMessages: ["The number of accesses is exceeded. Please try again in 5 minutes."],
        });
    },
});
