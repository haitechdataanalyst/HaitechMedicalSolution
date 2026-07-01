import { forbiddenError, generateCsrfToken, verifyCsrfToken, setCsrfCookie } from '../utils/index.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF protection using the Signed Double-Submit Cookie pattern.
 *
 * How it works:
 * 1. On safe requests (GET/HEAD/OPTIONS), a signed CSRF token is set as a cookie
 * 2. Frontend reads the `_csrf` cookie and sends its value as `X-CSRF-Token` header
 * 3. On state-changing requests (POST/PUT/PATCH/DELETE), the middleware validates:
 *    - X-CSRF-Token header matches the _csrf cookie value
 *    - HMAC signature is valid (prevents token forgery via subdomain injection)
 *
 * Apply to routes that use cookie-based authentication (e.g., refresh token, logout).
 * Routes using only Bearer token auth do NOT need CSRF protection.
 *
 * Usage:
 *   router.get('/csrf-token', csrfProtection, handler);       // Sets the cookie
 *   router.post('/refresh-token', csrfProtection, handler);   // Validates the token
 *   router.post('/logout', csrfProtection, auth(), handler);  // Validates the token
 */
export const csrfProtection = (req, res, next) => {
	if (SAFE_METHODS.has(req.method)) {
		if (!req.cookies?._csrf) {
			setCsrfCookie(res, generateCsrfToken());
		}
		return next();
	}

	const cookieToken = req.cookies?._csrf;
	const headerToken = req.get('X-CSRF-Token');

	if (!cookieToken || !headerToken) {
		return next(forbiddenError('CSRF token missing'));
	}

	if (cookieToken !== headerToken) {
		return next(forbiddenError('CSRF token mismatch'));
	}

	if (!verifyCsrfToken(cookieToken)) {
		return next(forbiddenError('Invalid CSRF token signature'));
	}

	next();
};
