// libs
import { Request, Response, NextFunction } from "express";

// services
import { getUsersService, getUserDetailService } from "../services/user.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

/**
 * Users Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getUsersController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    request.payload = { ...request.query };
    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await getUsersService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * User Detail Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getUserDetailController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    request.payload = { userId: request.params.userId };
    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await getUserDetailService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});
