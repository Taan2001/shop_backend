// libs
import { Request, Response, NextFunction } from "express";

// services
import { getSignInService } from "../services";

export const getSignInController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getSignInService(req, res, next);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
