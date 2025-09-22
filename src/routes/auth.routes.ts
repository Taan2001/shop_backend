// libs
import { Router } from "express";

// controllers
import { getSignInController, postSignUpController } from "../controllers/auth.controllers";

// middlewares

// create router
const authRouter = Router();

// GET /sign-in
authRouter.get("/sign-in", getSignInController);

// GET /sign-up
authRouter.get("/sign-up", postSignUpController);

export default authRouter;
