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
    REQUEST_BODY_PARAMS_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00009",
        ERROR_MESSAGE: () => "Missing refreshToken in request body",
    },
    VERIFY_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00010",
        ERROR_MESSAGE: () => "Unauthorized Refresh Token!",
    },
    REQUEST_BODY_PARAMS_SIGN_IN_ERROR: {
        ERROR_CODE: "E00011",
        ERROR_MESSAGE: (name: string) => `The ${name} is empty`,
    },
    QUERY_GET_USER_INFOR_BY_USERNAME_PASSWORD_ERROR: {
        ERROR_CODE: "E00012",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_QUERY_PARAMS_GET_USERS_ERROR: {
        ERROR_CODE: "E00013",
        ERROR_MESSAGE: (param: string) => `The ${param} parameter is required.`,
    },
    INVALID_QUERY_PARAMS_GET_USERS_ERROR: {
        ERROR_CODE: "E00014",
        ERROR_MESSAGE: (param: string) => `The parameter value ${param} is invalid.`,
    },
    // common
    QUERY_GET_USER_ROLE_INFOR_BY_USER_ID_ERROR: {
        ERROR_CODE: "E00015",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    // common
    UNAVAILABLE_USER_ROLE_ERROR: {
        ERROR_CODE: "E00016",
        ERROR_MESSAGE: () => "The user is not allowed to access resource.",
    },
    QUERY_COUNT_GET_USERS_ERROR: {
        ERROR_CODE: "E00017",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    // common
    PAGINATION_ERROR: {
        ERROR_CODE: "E00018",
        ERROR_MESSAGE: () => "The page to get data does not exist.",
    },
    QUERY_GET_USERS_ERROR: {
        ERROR_CODE: "E00019",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    // common
    NO_DATA_ERROR: {
        ERROR_CODE: "E00020",
        ERROR_MESSAGE: () => "No Data.",
    },
    REQUEST_PATH_PARAMS_GET_USER_DETAIL_ERROR: {
        ERROR_CODE: "E00021",
        ERROR_MESSAGE: (param: string) => `The ${param} does not exist.`,
    },
    QUERY_GET_USER_DETAIL_ERROR: {
        ERROR_CODE: "E00022",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_BODY_PARAMS_SIGN_UP_REQUIRED_ERROR: {
        ERROR_CODE: "E00023",
        ERROR_MESSAGE: (fieldName: string) => `The ${fieldName} field is required.`,
    },
    QUERY_GET_ROLE_INFOR_BY_ROLE_ID_ERROR: {
        ERROR_CODE: "E00024",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_BODY_PARAMS_SIGN_UP_ERROR: {
        ERROR_CODE: "E00025",
        ERROR_MESSAGE: (fieldName: string, error: "dataType" | "minLength" | "maxLength" | "minValue" | "maxValue" | "exist in database" | "duplicate") =>
            `The data in ${fieldName} is having an error about ${error}.`,
    },
    QUERY_INSERT_USER_INFOR_ERROR: {
        ERROR_CODE: "E00026",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    QUERY_INSERT_ROLE_RELATIONSHIP_INFOR_ERROR: {
        ERROR_CODE: "E00027",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_PATH_PARAMS_POST_USER_DETAIL_ERROR: {
        ERROR_CODE: "E00028",
        ERROR_MESSAGE: (param: string) => `The ${param} does not exist.`,
    },
    REQUEST_BODY_PARAMS_POST_USER_DETAIL_REQUIRED_ERROR: {
        ERROR_CODE: "E00029",
        ERROR_MESSAGE: (fieldName: string) => `The ${fieldName} field is required.`,
    },
    REQUEST_BODY_PARAMS_POST_USER_DETAIL_ERROR: {
        ERROR_CODE: "E00030",
        ERROR_MESSAGE: (
            fieldName: string,
            error: "dataType" | "minLength" | "maxLength" | "minValue" | "maxValue" | "exist in database" | "duplicate" | "admin role default"
        ) => `The data in ${fieldName} is having an error about ${error}.`,
    },
    QUERY_UPDATE_USER_INFOR_ERROR: {
        ERROR_CODE: "E00031",
        ERROR_MESSAGE: () => "Error during database update.",
    },
    QUERY_DELETE_ROLES_FOR_USER_ERROR: {
        ERROR_CODE: "E00032",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    QUERY_INSERT_NEW_ROLES_FOR_USER_ERROR: {
        ERROR_CODE: "E00033",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_QUERY_PARAMS_GET_SHOPS_ERROR: {
        ERROR_CODE: "E00034",
        ERROR_MESSAGE: (param: string) => `The ${param} parameter is required.`,
    },
    INVALID_QUERY_PARAMS_GET_SHOPS_ERROR: {
        ERROR_CODE: "E00035",
        ERROR_MESSAGE: (param: string) => `The parameter value ${param} is invalid.`,
    },
    QUERY_COUNT_GET_SHOPS_ERROR: {
        ERROR_CODE: "E00036",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    QUERY_GET_SHOPS_ERROR: {
        ERROR_CODE: "E00037",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    REQUEST_PATH_PARAMS_GET_SHOP_DETAIL_ERROR: {
        ERROR_CODE: "E00038",
        ERROR_MESSAGE: (param: string) => `The ${param} does not exist.`,
    },
    QUERY_GET_SHOP_DETAIL_ERROR: {
        ERROR_CODE: "E00039",
        ERROR_MESSAGE: () => "Error during database query.",
    },
    QUERY_GET_SHOP_DETAIL_INFORMATION_NOT_FOUND_ERROR: {
        ERROR_CODE: "E00040",
        ERROR_MESSAGE: () => "The shop information could not be found.",
    },
    REQUEST_PATH_PARAMS_POST_SHOP_DETAIL_ERROR: {
        ERROR_CODE: "E00041",
        ERROR_MESSAGE: (param: string) => `The ${param} does not exist.`,
    },
    REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_REQUIRED_ERROR: {
        ERROR_CODE: "E00042",
        ERROR_MESSAGE: (fieldName: string) => `The ${fieldName} field is required`,
    },
    REQUEST_BODY_PARAMS_POST_SHOP_DETAIL_ERROR: {
        ERROR_CODE: "E00043",
        ERROR_MESSAGE: (
            fieldName: string,
            error: "dataType" | "minLength" | "maxLength" | "minValue" | "maxValue" | "exist in database" | "duplicate" | "admin role default" | "invalid value"
        ) => `The data in ${fieldName} is having an error about ${error}.`,
    },
    QUERY_UPDATE_SHOP_INFOR_ERROR: {
        ERROR_CODE: "E00044",
        ERROR_MESSAGE: () => "Error during database update.",
    },
    REQUEST_PATH_PARAMS_DELETE_SHOP_ERROR: {
        ERROR_CODE: "E00045",
        ERROR_MESSAGE: (param: string) => `The ${param} does not exist.`,
    },
    QUERY_UPDATE_SHOP_DELETE_FLG_ERROR: {
        ERROR_CODE: "E00046",
        ERROR_MESSAGE: () => "Error during database update.",
    },
    QUERY_DELETE_SHOP_BY_ID_ERROR: {
        ERROR_CODE: "E00047",
        ERROR_MESSAGE: () => "Error during database deleteion.",
    },
};
