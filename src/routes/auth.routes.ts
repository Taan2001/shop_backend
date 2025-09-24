// libs
import { Router } from "express";

// controllers
import { getSignInController, postSignUpController } from "../controllers/auth.controllers";
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";

// middlewares

// create router
const authRouter = Router();

// GET /sign-in
authRouter.get("/sign-in", headerHandlerMiddleware, getSignInController);

// POST /sign-up
authRouter.post("/sign-up", headerHandlerMiddleware, authenticationHandlerMiddleware, postSignUpController);

export default authRouter;
