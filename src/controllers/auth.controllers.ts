// libs
import { Request, Response, NextFunction } from "express";

// services
import { getSignInService } from "../services";

// utils
import logger from "../utils/logger";

export const getSignInController = async (req: Request, res: Response, next: NextFunction) => {
    const timeStart = Date.now().toString();
    try {
        logger.request(timeStart, req.baseUrl + req.route?.path, req.query);

        const result = await getSignInService(req, res, next);

        logger.response(timeStart, req.baseUrl + req.route?.path, result);

        return res.status(200).json(result);
    } catch (error: unknown) {
        logger.newError(timeStart, req.baseUrl + req.route?.path, error);
        next(error);
    }
};
