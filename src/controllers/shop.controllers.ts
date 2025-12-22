// libs
import { Request, Response, NextFunction } from "express";

// services
import { getShopsService } from "../services/shop.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

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
