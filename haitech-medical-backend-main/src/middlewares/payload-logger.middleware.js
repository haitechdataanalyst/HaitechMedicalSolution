import { httpStatus } from '../constants/index.js';
import { env, logger } from '../config/index.js';
import { sanitize } from '../utils/index.js';

// Symbol prevents double-patching if middleware is inadvertently mounted twice.
// A string key could collide with third-party libraries; a Symbol is truly private.
const _PAYLOAD_LOGGED = Symbol('payloadLogged');

/**
 * Logs request and response payloads for debugging.
 *
 * - Request body: logged at debug level with sensitive fields masked
 * - Response body: logged at debug level for error responses (4xx/5xx) only
 * - Controlled by ENABLE_PAYLOAD_LOGGING env var (default: false)
 *
 * Place this middleware AFTER body parsers and AFTER responseFormatter.
 *
 * Safety guarantees:
 *   - Logging errors never interrupt the request/response cycle (try/catch isolation)
 *   - res.json is only patched once regardless of how many times this middleware runs
 *   - originalJson() is always called even when the logging path throws
 */
export const payloadLogger = (req, res, next) => {
	if (!env.ENABLE_PAYLOAD_LOGGING) return next();

	// Log sanitized request body when present.
	// Restrict to plain objects — skips strings, Buffers, arrays, and other
	// types that body-parsers may produce for non-JSON/non-form content-types.
	if (typeof req.body === 'object' && req.body !== null && !Array.isArray(req.body) && Object.keys(req.body).length > 0) {
		try {
			logger.debug('Request payload', { body: sanitize(req.body) });
		} catch {
			// Logging must never break request handling — silently swallow.
		}
	}

	// Guard against double-patching (e.g. middleware registered twice in app.js).
	// Without this, every JSON response would recurse infinitely.
	// eslint-disable-next-line security/detect-object-injection
	if (!res[_PAYLOAD_LOGGED]) {
		// eslint-disable-next-line security/detect-object-injection
		res[_PAYLOAD_LOGGED] = true;

		const originalJson = res.json.bind(res);

		// Intercept res.json to capture error response bodies.
		// The try/catch is intentionally inside the wrapper so that a logging
		// failure never prevents the response from being sent to the client.
		res.json = (body) => {
			if (res.statusCode >= httpStatus.BAD_REQUEST) {
				try {
					logger.debug('Error response payload', {
						statusCode: res.statusCode,
						body: typeof body === 'object' && body !== null ? sanitize(body) : body,
					});
				} catch {
					// Logging must never block the response — silently swallow.
				}
			}
			return originalJson(body);
		};
	}

	next();
};
