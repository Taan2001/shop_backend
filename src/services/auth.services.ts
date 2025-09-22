// libs
import { Request, NextFunction } from "express";

// interfaces
import { ISignInSuccess } from "../interfaces/auth.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";

/**
 * Sign In Service
 * @param { Request } request - Express Request
 * @param { NextFunction }next - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const getSignInService = async (request: Request, next: NextFunction) => {
    // Simulate some business logic, e.g., validating user credentials
    const { username, password } = request.query;

    if (username === "admin" && password === "password") {
        return ResponseSuccess<ISignInSuccess>({ data: { user: { username: username } } });
    } else {
        throw ResponseError<string>({ statusCode: "E0001", message: "Invalid credentials" });
    }
};

/**
 * Sign Up Service
 * @param { Request } request - Express Request
 * @param { NextFunction }next - Express Next Function
 * @returns { Promise<IAppSuccess<ISignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postSignUpService = async (request: Request, next: NextFunction) => {
    // Simulate some business logic, e.g., validating user credentials
    const { username, password } = request.query;

    if (username === "admin" && password === "password") {
        return ResponseSuccess<ISignInSuccess>({ data: { user: { username: username } } });
    } else {
        throw ResponseError<string>({ statusCode: "E0001", message: "Invalid credentials" });
    }
};
