export interface IRequestBodyRefreshToken {
    refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRefreshTokenSucess extends ISignInSuccess {}

export interface IRequestBodySignIn {
    username: string;
    password: string;
}

export interface ISignInSuccess {
    user: {
        userId: string;
    };
    accessToken: string;
    refreshToken: string;
}
