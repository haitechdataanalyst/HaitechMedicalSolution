import { env } from '../config/index.js';
import { environments, tokens } from '../constants/index.js';

const isProduction = env.ENV === environments.PROD;

/**
 * Sets a refresh token as an httpOnly secure cookie on the response.
 *
 * httpOnly: true  → JavaScript cannot access this cookie (prevents XSS theft)
 * secure: true    → Cookie only sent over HTTPS (prevents man-in-the-middle)
 * sameSite: 'strict' → Cookie not sent on cross-site requests (prevents CSRF)
 * path: '/auth'   → Cookie only sent to auth routes (minimizes exposure)
 */
export const setRefreshTokenCookie = (res, token, maxAgeDays = env.JWT.REFRESH_EXPIRY_TIME) => {
	res.cookie(tokens.REFRESH, token, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'strict' : 'lax',
		path: `/api/${env.API_VERSION}/auth`,
		maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
	});
};

/**
 * Clears the refresh token cookie (used on logout).
 */
export const clearRefreshTokenCookie = (res) => {
	res.clearCookie(tokens.REFRESH, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'strict' : 'lax',
		path: `/api/${env.API_VERSION}/auth`,
	});
};

/**
 * Extracts the refresh token from the cookie.
 */
export const getRefreshTokenFromCookie = (req) => {
	return req.cookies?.[tokens.REFRESH] || null;
};
