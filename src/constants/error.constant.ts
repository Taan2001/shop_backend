export const ERROR_LIST = {
    // common
    ENVIRONMENT_VARIABLE_ERROR: {
        ERROR_CODE: "E00001",
        ERROR_MESSAGE: (v: string) => `The environment ${v} variable does not exist.`,
    },
    GENERATE_ACCESS_TOKEN_ERROR: {
        ERROR_CODE: "E00002",
        ERROR_MESSAGE: () => "An error occurred while generating the access token.",
    },
    GENERATE_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00003",
        ERROR_MESSAGE: () => "An error occurred while generating the refresh token.",
    },
    MISSING_AUTHORIZATION_HEADER: {
        ERROR_CODE: "E00004",
        ERROR_MESSAGE: () => "Missing Authorization header.",
    },
    VERIFY_ACCESS_TOKEN_ERROR: {
        ERROR_CODE: "E00005",
        ERROR_MESSAGE: () => "Unauthorized Access Token!",
    },
    // common
    QUERY_GET_USER_INFOR_BY_ID_ERROR: {
        ERROR_CODE: "E00006",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    // common
    UNAUTHENTICATED_USER_ERROR: {
        ERROR_CODE: "E00007",
        ERROR_MESSAGE: () => "Unable to authenticate user!",
    },
    // common
    UNAVAILABLE_USER_ERROR: {
        ERROR_CODE: "E00008",
        ERROR_MESSAGE: () => "The current user account is unavailable.",
    },
    REQUEST_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00009",
        ERROR_MESSAGE: () => "Missing refreshToken in request body",
    },
    VERIFY_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00010",
        ERROR_MESSAGE: () => "Unauthorized Refresh Token!",
    },
    REQUEST_SIGN_IN_ERROR: {
        ERROR_CODE: "E00011",
        ERROR_MESSAGE: (name: string) => `The ${name} is empty`,
    },
    QUERY_GET_USER_INFOR_BY_USERNAME_PASSWORD_ERROR: {
        ERROR_CODE: "E00012",
        ERROR_MESSAGE: () => "Error during database query.",
    },
};
