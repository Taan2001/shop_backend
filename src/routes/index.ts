// libs
import { Router } from "express";

// routes
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

// create router
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
