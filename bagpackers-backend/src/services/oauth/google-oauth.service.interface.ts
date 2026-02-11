export interface IGoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture?: string;
	locale?: string;
}

export interface IGoogleTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	refresh_token?: string;
	id_token?: string;
}

export interface IGoogleOAuthService {
	getGoogleAuthUrl(redirectUri: string, state?: string): string;
	verifyGoogleToken(code: string, redirectUri: string): Promise<IGoogleTokenResponse>;
	getUserInfo(accessToken: string): Promise<IGoogleUserInfo>;
}
