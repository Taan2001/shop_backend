import { Request, Response, NextFunction } from "express";

const ErrorHandleMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (err as any).statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
};

export default ErrorHandleMiddleware;
