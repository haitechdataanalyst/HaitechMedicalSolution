import crypto from 'node:crypto';
import { env } from '../config/index.js';
import { environments } from '../constants/index.js';

const isProduction = env.ENV === environments.PROD;

/**
 * Generates a signed CSRF token using HMAC-SHA256.
 * The token is formatted as `{random}.{signature}`.
 */
export const generateCsrfToken = () => {
	const token = crypto.randomBytes(32).toString('hex');
	const signature = crypto.createHmac('sha256', env.JWT.SECRET).update(token).digest('hex');
	return `${token}.${signature}`;
};

/**
 * Verifies a signed CSRF token's HMAC signature using timing-safe comparison.
 *
 * @param {string} signedToken - the `{random}.{signature}` token
 * @returns {boolean}
 */
export const verifyCsrfToken = (signedToken) => {
	if (!signedToken || typeof signedToken !== 'string') return false;

	const dotIndex = signedToken.indexOf('.');
	if (dotIndex === -1) return false;

	const token = signedToken.slice(0, dotIndex);
	const signature = signedToken.slice(dotIndex + 1);
	if (!token || !signature) return false;

	const expected = crypto.createHmac('sha256', env.JWT.SECRET).update(token).digest('hex');
	if (signature.length !== expected.length) return false;

	try {
		return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
	} catch {
		return false;
	}
};

/**
 * Sets the CSRF cookie on the response.
 *
 * @param {import('express').Response} res
 * @param {string} token
 */
export const setCsrfCookie = (res, token) => {
	res.cookie('_csrf', token, {
		httpOnly: false, // Frontend JS must read this to send as X-CSRF-Token header
		secure: isProduction,
		sameSite: isProduction ? 'strict' : 'lax',
		path: '/',
	});
};
