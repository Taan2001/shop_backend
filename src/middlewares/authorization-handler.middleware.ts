// libs
import { Request, Response, NextFunction } from "express";

// database
import { getUserRoleInformationByUserId } from "../database/repositories/user.repository";

// utils
import { ResponseError } from "../utils/common";

// const
import { ERROR_LIST } from "../constants/error.constant";
import { RoleKey, ROLES } from "../constants/common.constant";

/**
 * Authorization Handler
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 */
const authorizationHandlerMiddleware = (alowedRoles: RoleKey[]) => {
    return async (request: Request, response: Response, nextFunction: NextFunction) => {
        try {
            // Step 1: Get the role information in database
            const rolesOfCurrentUser = await getUserRoleInformationByUserId(request.currentUser.userId);
            const roleIdsOfCurrentUser = rolesOfCurrentUser.map((role) => role.roleId);
            request.currentUser.roleIds = roleIdsOfCurrentUser;

            // Step 2: Check role
            const roleMatched = new Set<string>(alowedRoles.map((roleName) => ROLES[roleName]));

            if (alowedRoles.length <= 0 || !roleIdsOfCurrentUser.some((role) => roleMatched.has(role))) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_CODE,
                    errorMessages: [ERROR_LIST.UNAVAILABLE_USER_ROLE_ERROR.ERROR_MESSAGE()],
                    errorParams: ["roleIds"],
                    errorDetails: [
                        {
                            functionName: "authorizationHandlerMiddleware",
                            params: roleIdsOfCurrentUser,
                            errorMessage: "The user does not have sufficient rights to access.",
                        },
                    ],
                });
            }

            nextFunction();
        } catch (error) {
            nextFunction(error);
        }
    };
};

export default authorizationHandlerMiddleware;
