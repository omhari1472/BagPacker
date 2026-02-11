import { injectable } from 'tsyringe';
import type {
	IGoogleOAuthService,
	IGoogleUserInfo,
	IGoogleTokenResponse,
} from './google-oauth.service.interface';
import type { Env } from '@infrastructure/types';

/**
 * Google OAuth Service
 * Handles Google OAuth authentication flow
 */
@injectable()
export class GoogleOAuthService implements IGoogleOAuthService {
	private clientId: string;
	private clientSecret: string;
	private readonly authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
	private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
	private readonly userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
	private readonly scope = 'openid email profile';

	constructor(env: Env) {
		this.clientId = env.GOOGLE_CLIENT_ID;
		this.clientSecret = env.GOOGLE_CLIENT_SECRET;

		if (!this.clientId || !this.clientSecret) {
			throw new Error('Google OAuth credentials are not configured');
		}
	}

	/**
	 * Generate Google OAuth authorization URL
	 * @param redirectUri - Redirect URI after authentication
	 * @param state - Optional state parameter for CSRF protection
	 * @returns Google OAuth authorization URL
	 */
	getGoogleAuthUrl(redirectUri: string, state?: string): string {
		if (!redirectUri) {
			throw new Error('Redirect URI is required');
		}

		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: redirectUri,
			response_type: 'code',
			scope: this.scope,
			access_type: 'offline',
			prompt: 'consent',
		});

		if (state) {
			params.append('state', state);
		}

		return `${this.authUrl}?${params.toString()}`;
	}

	/**
	 * Verify Google OAuth token and exchange authorization code for access token
	 * @param code - Authorization code from Google
	 * @param redirectUri - Redirect URI used in the authorization request
	 * @returns Google token response with access token
	 */
	async verifyGoogleToken(code: string, redirectUri: string): Promise<IGoogleTokenResponse> {
		if (!code) {
			throw new Error('Authorization code is required');
		}

		if (!redirectUri) {
			throw new Error('Redirect URI is required');
		}

		try {
			const params = new URLSearchParams({
				code,
				client_id: this.clientId,
				client_secret: this.clientSecret,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code',
			});

			const response = await fetch(this.tokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: params.toString(),
			});

			if (!response.ok) {
				const errorData = await response.json() as any;
				throw new Error(
					`Google token verification failed: ${errorData.error_description || response.statusText}`
				);
			}

			const tokenData = (await response.json()) as IGoogleTokenResponse;
			return tokenData;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to verify Google token: ${error.message}`);
			}
			throw new Error('Failed to verify Google token: Unknown error');
		}
	}

	/**
	 * Get user information from Google using access token
	 * @param accessToken - Google access token
	 * @returns Google user information
	 */
	async getUserInfo(accessToken: string): Promise<IGoogleUserInfo> {
		if (!accessToken) {
			throw new Error('Access token is required');
		}

		try {
			const response = await fetch(this.userInfoUrl, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json() as any;
				throw new Error(
					`Failed to fetch user info: ${errorData.error?.message || response.statusText}`
				);
			}

			const userInfo = (await response.json()) as IGoogleUserInfo;

			// Validate required fields
			if (!userInfo.email || !userInfo.verified_email) {
				throw new Error('Email not verified or not available from Google');
			}

			return userInfo;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to get user info from Google: ${error.message}`);
			}
			throw new Error('Failed to get user info from Google: Unknown error');
		}
	}
}
