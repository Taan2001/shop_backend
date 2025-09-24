// libs
import { Router } from "express";

// routes
import authRouter from "./auth.routes";

// create router
const router = Router();

router.use("/auth", authRouter);

export default router;
