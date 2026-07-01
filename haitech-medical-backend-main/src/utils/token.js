import { TOKEN_EXPIRY_FORMAT_REGEX } from '../constants/index.js';

/**
 * Converts JWT expiry strings like "15m", "7d", "1h" to seconds.
 * Useful for setting Redis TTLs that match token lifetimes.
 *
 * @param {string|number} expiry - e.g. "15m", "7d", "1h", or seconds as a number
 * @returns {number} seconds
 */
export const parseExpiryToSeconds = (expiry) => {
	if (typeof expiry === 'number') return expiry;
	const match = String(expiry).match(TOKEN_EXPIRY_FORMAT_REGEX);
	if (!match) throw new Error(`Invalid token expiry format: ${expiry}`);
	const [, value, unit] = match;
	const multipliers = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
	return parseInt(value, 10) * multipliers[unit]; // eslint-disable-line security/detect-object-injection
};
