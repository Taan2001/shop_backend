import "express";
import { ICurrentUser } from "../../interfaces/app.interface";

declare module "express-serve-static-core" {
    interface Request {
        requestId: string | "";
        apiName: string | "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: any;
        currentUser: ICurrentUser;
    }
}
