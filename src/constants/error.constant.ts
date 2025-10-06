export const ERROR_LIST = {
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
        ERROR_MESSAGE: () => "Unauthorized Access Token",
    },

    VERIFY_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00006",
        ERROR_MESSAGE: () => "Unauthorized Refresh Token",
    },
};
