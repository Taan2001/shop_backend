// libs
import { Router } from "express";

// controllers
import { postRefreshTokenController, postSignInController, postSignUpController } from "../controllers/auth.controllers";
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";

// middlewares

// create router
const authRouter = Router();

// POST /refresh-token
authRouter.post("/refresh-token", headerHandlerMiddleware, postRefreshTokenController);

// POST /sign-in
authRouter.post("/sign-in", headerHandlerMiddleware, postSignInController);

// POST /sign-up
authRouter.post("/sign-up", headerHandlerMiddleware, authenticationHandlerMiddleware, postSignUpController);

export default authRouter;
