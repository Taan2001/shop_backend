// libs
import { Router } from "express";

// controllers
import { getShopDetailController, getShopsController } from "../controllers/shop.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";

// create router

const shopRouter = Router();

// GET /
shopRouter.get("/", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), getShopsController);

// GET /:shopId
shopRouter.get(
    "/:shopId",
    headerHandlerMiddleware,
    authenticationHandlerMiddleware,
    authorizationHandlerMiddleware(["ADMIN", "SHOP"]),
    getShopDetailController
);

// // POST /:shopId
// shopRouter.post(
//     "/:shopId",
//     headerHandlerMiddleware,
//     authenticationHandlerMiddleware,
//     authorizationHandlerMiddleware(["ADMIN", "SHOP"]),
//     postShopDetailController
// );

// // DELETE /:shopId
// shopRouter.delete("/:shopId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), deleteShopController);

// // POST /create
// shopRouter.post("/create", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), postCreateShopController);

export default shopRouter;
