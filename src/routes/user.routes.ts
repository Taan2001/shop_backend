// libs
import { Router } from "express";

// controllers
import { getUsersController, getUserDetailController } from "../controllers/user.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";

// create router
const userRouter = Router();

// GET /
userRouter.get("/", headerHandlerMiddleware, authenticationHandlerMiddleware, getUsersController);

// GET /:userId

userRouter.get("/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, getUserDetailController);

export default userRouter;
