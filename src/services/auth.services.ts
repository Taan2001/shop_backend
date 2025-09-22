// libs
import { Request, Response, NextFunction } from "express";
import { ResponseError, ResponseSuccess } from "../utils/common";
import { SignInSuccess } from "../interfaces/auth.interface";

export const getSignInService = async (req: Request, res: Response, next: NextFunction) => {
    // Simulate some business logic, e.g., validating user credentials
    const { username, password } = req.query;

    if (username === "admin" && password === "password") {
        return ResponseSuccess<SignInSuccess>({ data: { user: { username: username } } });
    } else {
        throw ResponseError<string>({ status: "error", statusCode: "E0001", message: "Invalid credentials" });
    }
};
