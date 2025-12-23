// libs
import { Request, Response, NextFunction } from "express";

// services
import { getShopDetailService, getShopsService, postShopDetailService, deleteShopService } from "../services/shop.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

/**
 * Get Shops Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getShopsController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.query };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await getShopsService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * Get Shop Detail Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getShopDetailController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { shopId: request.params.shopId };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await getShopDetailService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * Post Shop Detail Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postShopDetailController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.params, ...request.body };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await postShopDetailService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * Delete Shop Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const deleteShopController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.params };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await deleteShopService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});
