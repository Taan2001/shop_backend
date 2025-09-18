// libs
import { Router } from "express";

// controllers
import { getSignInController } from "../controllers";

// middlewares

// create router
const authRouter = Router();

// GET /signin
authRouter.get("/signin", getSignInController);

export default authRouter;
