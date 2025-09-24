export interface ISignInSuccess {
    user: {
        username: string;
    };
    accessToken: string;
    refreshToken: string;
}
