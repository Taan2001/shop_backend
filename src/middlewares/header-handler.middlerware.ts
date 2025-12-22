// libs
import { Request, Response, NextFunction } from "express";

/**
 * Header Handler
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 */
const headerHandlerMiddleware = async (request: Request, response: Response, nextFunction: NextFunction) => {
    // create request id, apiName
    request.requestId = Date.now().toString();
    request.apiName = request.baseUrl + request.route?.path;
    nextFunction();
};

export default headerHandlerMiddleware;
