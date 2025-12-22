// libs
import { Router } from "express";

// controllers
import { postRefreshTokenController, postSignInController, postSignUpController } from "../controllers/auth.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";
import { refreshAccessTokenLimiter, signInLimiter, signUpLimiter } from "../middlewares/limiter-handler.middleware";

// create router
const authRouter = Router();

// POST /refresh-token
authRouter.post("/refresh-token", headerHandlerMiddleware, refreshAccessTokenLimiter, postRefreshTokenController);

// POST /sign-in
authRouter.post("/sign-in", headerHandlerMiddleware, signInLimiter, postSignInController);

// POST /sign-up
authRouter.post(
    "/sign-up",
    headerHandlerMiddleware,
    signUpLimiter,
    authenticationHandlerMiddleware,
    authorizationHandlerMiddleware(["ADMIN"]),
    postSignUpController
);

export default authRouter;
