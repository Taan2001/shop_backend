export interface ISignInSuccess {
    user: {
        userId: string;
    };
    accessToken: string;
    refreshToken: string;
}
