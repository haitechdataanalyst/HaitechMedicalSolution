import logger from '../../config/logger.js';
import { sanitizeQueryParams } from '../sanitizer.js';

export const queryLogger = (query, params) => {
	const maskedParams = sanitizeQueryParams(query, params);
	let formattedQuery = query;
	if (maskedParams && maskedParams.length) {
		const reversedParams = [...maskedParams].reverse();
		for (const [offset, param] of reversedParams.entries()) {
			const placeholderIndex = maskedParams.length - offset;
			const placeholder = `$${placeholderIndex}`;
			const value = typeof param === 'string' ? `'${param}'` : String(param);
			formattedQuery = formattedQuery.split(placeholder).join(value);
		}
	}
	logger.debug(`Executed Query: ${formattedQuery}`);
};

/**
 * Drizzle-compatible logger that plugs into Drizzle's `logger` config option.
 * Routes all ORM-generated SQL through the existing logging pipeline.
 */
export class DrizzleLogger {
	logQuery(query, params) {
		queryLogger(query, params ?? []);
	}
}
