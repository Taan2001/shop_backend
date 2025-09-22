import { AppError, AppSuccess } from "../interfaces/app.interface";

export const ResponseSuccess = <D>({ data }: AppSuccess<D>) => {
    return { status: "success", data };
};

export const ResponseError = <T>(error: AppError<T>) => {
    return { status: "error", message: error.message, statusCode: error.statusCode };
};
