// libs
import { Request, Response, NextFunction } from "express";

// utils
import logger from "../utils/logger";

const ErrorHandleMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
    logger.newError(request.requestId, request.baseUrl + request.route?.path, error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (error as any).statusCode || 500;
    const message = error.message || "Internal Server Error";
    response.status(statusCode).json({ message });
};

export default ErrorHandleMiddleware;
