// libs
import { Router } from "express";

// controllers
import { getUsersController, getUserDetailController, postUserDetailController } from "../controllers/user.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";
import { getUserDetailLimiter, getUsersLimiter, postUserDetailLimiter } from "../middlewares/limiter-handler.middleware";

// create router
const userRouter = Router();

// GET /
userRouter.get("/", headerHandlerMiddleware, getUsersLimiter, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), getUsersController);

// GET /:userId
userRouter.get(
    "/:userId",
    headerHandlerMiddleware,
    getUserDetailLimiter,
    authenticationHandlerMiddleware,
    authorizationHandlerMiddleware(["ADMIN", "SHOP", "USER"]),
    getUserDetailController
);

// POST /:userId
userRouter.post(
    "/:userId",
    headerHandlerMiddleware,
    postUserDetailLimiter,
    authenticationHandlerMiddleware,
    authorizationHandlerMiddleware(["ADMIN", "SHOP", "USER"]),
    postUserDetailController
);

export default userRouter;
