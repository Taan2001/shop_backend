// libs
import { Request, Response, NextFunction } from "express";

export const getSignInService = async (req: Request, res: Response, next: NextFunction) => {
    // Simulate some business logic, e.g., validating user credentials
    const { username, password } = req.query;

    if (username === "admin" && password === "password") {
        return { message: "Sign-in successful", user: { username } };
    } else {
        throw new Error("Invalid credentials");
    }
};
