// libs
import { Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// interfaces
import {
    IPostRefreshTokenSucess,
    IRequestBodyPostRefreshToken,
    IRequestBodyPostSignIn,
    IRequestBodyPostSignUp,
    IPostSignInSuccess,
    IPostSignUpSuccess,
} from "../interfaces/auth.interface";
import { IResponseSuccess } from "../interfaces/app.interface";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { isValidEmail, isVietnamesePhoneNumber } from "../utils/helpers";

// constants
import { ERROR_LIST } from "../constants/error.constant";

// database repositories
import { commitTransaction, createTransactionConnection, releaseTransaction, rollbackTransaction } from "../database/connection-pool";
import {
    getRoleInformationByRoleId,
    getUserInformationByUserId,
    getUserInformationByUsernamePassword,
    insertRoleRelationshipInformation,
    insertUserInformation,
} from "../database/repositories/auth.repository";

/**
 * Post Refresh Token Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IPostRefreshTokenSucess> | IAppError<string>> } - Promise resolving to service result
 */
export const postRefreshTokenService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IPostRefreshTokenSucess>> => {
    try {
        // Step 1: Get refreshToken in request body.
        const { refreshToken } = request.body as IRequestBodyPostRefreshToken;
        if (!refreshToken) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_REFRESH_TOKEN_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.REQUEST_BODY_PARAMS_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
            });
        }

        // Step 2: Verify and decode the refreshToken.
        const currentUser = await verifyRefreshToken(request, refreshToken);

        // Step 3: Get the userInformation.
        const users = await getUserInformationByUserId(currentUser.userId);

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        // Step 4: Generate a new accessToken (refer sheet postSignIn)
        const user = users[0];
        const accessToken = await generateAccessToken(request, nextFunction, user);
        return ResponseSuccess<IPostRefreshTokenSucess>({ statusCode: 200, data: { user: { userId: user.userId }, accessToken, refreshToken } });
    } catch (error) {
        throw error;
    }
};

/**
 * Post Sign In Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IPostSignInSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postSignInService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IPostSignInSuccess>> => {
    try {
        // get value in request body
        const { username, password } = request.body as IRequestBodyPostSignIn;
        const messages = [];

        // Step 1: Get and validate the request body.
        if (!username) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_MESSAGE("username"));
        }

        if (!password) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_MESSAGE("password"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_IN_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 2: Get the userInformation in database.
        const users = await getUserInformationByUsernamePassword(username, password);

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        // Step 3: Generate the accessToken and refreshToken.
        const user = users[0];
        const accessToken = await generateAccessToken(request, nextFunction, user);
        const refreshToken = await generateRefreshToken(request, nextFunction, user);

        return ResponseSuccess<IPostSignInSuccess>({ statusCode: 200, data: { user: { userId: user.userId }, accessToken, refreshToken } });
    } catch (error) {
        throw error;
    }
};

/**
 * Post Sign Up Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<IAppSuccess<IPostSignUpSuccess> | IAppError<string>> } - Promise resolving to service result
 */
export const postSignUpService = async (request: Request, nextFunction: NextFunction): Promise<IResponseSuccess<IPostSignUpSuccess>> => {
    try {
        // Step 2: Validate query parameters.
        const { firstName, lastName, age, username, password, email, phoneNumber, address, roleIds } = request.body as IRequestBodyPostSignUp;
        let messages = [];

        // Step 2-1: Check the required query parameters.
        if (firstName === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("firstName"));
        }
        if (lastName === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("lastName"));
        }
        if (age === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("age"));
        }
        if (username === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("username"));
        }
        if (password === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("password"));
        }
        if (email === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("email"));
        }
        if (phoneNumber === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("phoneNumber"));
        }
        if (address === undefined) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("address"));
        }
        if (roleIds === undefined || !Array.isArray(roleIds) || roleIds.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_MESSAGE("roleIds"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // -----> Step 2-2: Check the data of the query parameters.
        // firstName
        if (typeof firstName !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("firstName", "dataType"));
        }
        if (typeof firstName === "string" && firstName.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("firstName", "minLength"));
        }
        if (typeof firstName === "string" && firstName.length > 12) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("firstName", "maxLength"));
        }
        // lastName
        if (typeof lastName !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("lastName", "dataType"));
        }
        if (typeof lastName === "string" && lastName.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("lastName", "minLength"));
        }
        if (typeof lastName === "string" && lastName.length > 36) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("lastName", "maxLength"));
        }
        // age
        if (typeof age !== "number") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("age", "dataType"));
        }
        if (typeof age === "number" && age < 15) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("age", "minValue"));
        }
        if (typeof age === "number" && age > 120) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("age", "maxValue"));
        }
        // username
        if (typeof username !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("username", "dataType"));
        }
        if (typeof username === "string" && username.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("username", "minLength"));
        }
        if (typeof username === "string" && username.length > 36) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("username", "maxLength"));
        }
        // password
        if (typeof password !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("password", "dataType"));
        }
        if (typeof password === "string" && password.length < 8) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("password", "minLength"));
        }
        if (typeof password === "string" && password.length > 64) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("password", "maxLength"));
        }
        // phoneNumber
        if (isVietnamesePhoneNumber(phoneNumber) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("phoneNumber", "dataType"));
        }
        // email
        if (isValidEmail(email) === false) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("email", "dataType"));
        }
        if (typeof email === "string" && email.length > 64) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("email", "maxLength"));
        }
        // address
        if (typeof address !== "string") {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("address", "dataType"));
        }
        if (typeof address === "string" && address.length === 0) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("address", "minLength"));
        }
        if (typeof address === "string" && address.length > 64) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("address", "maxLength"));
        }
        // roleIds
        if (Array.isArray(roleIds) && roleIds.length > 0 && roleIds.some((roleId) => typeof roleId !== "string")) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("roleIds", "dataType"));
        }

        let isRoleError = false;
        if (Array.isArray(roleIds) && roleIds.length > 0 && roleIds.every((roleId) => typeof roleId === "string")) {
            const promiseRoles = roleIds.map(async (roleId) => {
                const roles = await getRoleInformationByRoleId(roleId);
                console.log("roles:", roles);
                if (roles.length !== 1) {
                    isRoleError = true;
                }
            });
            await Promise.all(promiseRoles);
        }

        if (isRoleError) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("roleIds", "exist in database"));
        }

        if (new Set(roleIds).size !== roleIds.length) {
            messages.push(ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_MESSAGE("roleIds", "duplicate"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERROR_LIST.REQUEST_BODY_PARAMS_SIGN_UP_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 3: Check Role(refer Common sheet)
        const users = await getUserInformationByUserId(request.currentUser.userId);
        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAUTHENTICATED_USER_ERROR.ERROR_MESSAGE()],
            });
        }
        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_CODE,
                errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ERROR.ERROR_MESSAGE()],
            });
        }
        // Step 4: Insert Data
        const newUserId = uuidv4();
        const timestamp = Date.now();
        const createdDate = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");
        const updatedDate = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // create transaction
        const transaction = await createTransactionConnection();
        try {
            await insertUserInformation(transaction, {
                newUserId,
                firstName,
                lastName,
                age,
                username,
                password,
                email,
                phoneNumber,
                address,
                userId: request.currentUser.userId,
                createdDate,
                updatedDate,
                timestamp,
            });

            const rolePromises = roleIds.map(async (roleId) => {
                await insertRoleRelationshipInformation(transaction, {
                    roleId,
                    newUserId,
                    userId: request.currentUser.userId,
                    createdDate,
                    updatedDate,
                    timestamp,
                });
            });

            await Promise.all(rolePromises);

            // commit transaction
            await commitTransaction(transaction);

            // release transaction
            await releaseTransaction(transaction);

            return ResponseSuccess<IPostSignUpSuccess>({ statusCode: 201, data: { user: { userId: newUserId }, message: "User registration successful" } });
        } catch (error) {
            await rollbackTransaction(transaction);
            await releaseTransaction(transaction);
            throw error;
        }
    } catch (error) {
        throw error;
    }
};
