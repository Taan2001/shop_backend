export interface AppSuccess<D> {
    data: D;
}

export interface AppError<T> {
    status: "error";
    statusCode?: string;
    message: T;
}
