/**
 * Extracts a Bearer token from the Authorization header.
 *
 * @param {string|undefined} authHeader - req.headers.authorization
 * @returns {string|null} the token string, or null if missing/malformed
 */
export const extractToken = (authHeader) => {
	if (!authHeader) return null;
	const [scheme, token] = authHeader.split(' ');
	if (scheme !== 'Bearer' || !token) return null;
	return token;
};
