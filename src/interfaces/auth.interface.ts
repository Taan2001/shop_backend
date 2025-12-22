export interface IRequestBodyPostSignUp {
    firstName: string;
    lastName: string;
    age: number;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    roleIds: string[];
}

export interface IPostSignUpSuccess {
    user: {
        userId: string;
    };
    message: string;
}

export interface IRequestBodyPostRefreshToken {
    refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPostRefreshTokenSucess extends IPostSignInSuccess {}

export interface IRequestBodyPostSignIn {
    username: string;
    password: string;
}

export interface IPostSignInSuccess {
    user: {
        userId: string;
    };
    accessToken: string;
    refreshToken: string;
}
