// libs
import { Router } from "express";

// routes
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import shopRouter from "./shop.routes";

// create router
const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/shops", shopRouter);

export default router;
