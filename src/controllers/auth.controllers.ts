// libs
import { Request, Response, NextFunction } from "express";

// services
import { getSignInService, postSignUpService } from "../services/auth.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

/**
 * Sign In Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getSignInController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    request.payload = { username: request.query.username };
    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await getSignInService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * Sign Up Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postSignUpController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // create request id
    request.requestId = Date.now().toString();

    // log request
    logger.request(request.requestId, request.baseUrl + request.route?.path, request.query);

    const result = await postSignUpService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.baseUrl + request.route?.path, result);

    // send response
    response.status(201).send(result);
});
