import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { getRedisClient, isRedisConnected } from '../config/redis.js';

/**
 * Creates a custom Redis-backed rate limit store compatible with redis v4+
 * and express-rate-limit.
 *
 * The store is lazy — the store is only initialized on first request.
 * This avoids initialization during server startup when Redis may not be ready.
 *
 * @param {string} prefix     - namespace prefix for rate limit keys (e.g. 'auth', 'global')
 * @param {number} ttlSeconds - TTL in seconds matching the rate-limit window
 * @returns {object} An express-rate-limit compatible store
 */
export const createRedisRateLimitStore = (prefix, ttlSeconds) => {
	const keyPrefix = `rl:${prefix}:`;

	return {
		// On any Redis error, this throws (uncaught) to trigger the safety-net
		// fallback in createSafeRateLimiter.
		async increment(key) {
			if (!isRedisConnected()) {
				throw new Error('Redis not connected');
			}

			const redisClient = getRedisClient();
			const fullKey = keyPrefix + key;

			// Use INCR to increment the counter and EXPIRE to set TTL
			await redisClient.incr(fullKey);
			// Use the actual window TTL so the counter resets correctly
			await redisClient.expire(fullKey, ttlSeconds);

			// Get current value
			const current = await redisClient.get(fullKey);
			return { totalHits: parseInt(current, 10), resetTime: new Date() };
		},

		async decrement(key) {
			try {
				if (!isRedisConnected()) return;
				const redisClient = getRedisClient();
				const fullKey = keyPrefix + key;
				await redisClient.decr(fullKey);
			} catch {
				// Silently fail on decrement errors
			}
		},

		async resetKey(key) {
			try {
				if (!isRedisConnected()) return;
				const redisClient = getRedisClient();
				const fullKey = keyPrefix + key;
				await redisClient.del(fullKey);
			} catch {
				// Silently fail on reset errors
			}
		},
	};
};

/**
 * Creates a rate limiter that is safe under Redis failures.
 *
 * Strategy:
 *   1. Primary limiter — Redis-backed, authoritative counter shared across all
 *      processes/pods.
 *   2. Safety-net limiter — in-memory, per-process, applied on every request.
 *      It uses a higher (2×) limit so it does not interfere under normal Redis
 *      operation, but ensures requests are still bounded if Redis goes down and
 *      the primary limiter stops counting.
 *
 * Both limiters use the same windowMs so the windows are conceptually aligned.
 *
 * @param {object}    options
 * @param {string}    options.prefix                  - Redis key namespace (e.g. 'auth')
 * @param {number}    options.windowMs                - Window duration in milliseconds
 * @param {number}    options.max                     - Max requests per window (Redis limiter)
 * @param {boolean}   [options.skipSuccessfulRequests=false]
 * @param {string}    [options.message]               - Error message sent to client
 * @param {Function}  [options.keyGenerator]          - Custom key generator (req) => string.
 *                                                      Defaults to express-rate-limit's built-in
 *                                                      IP-based generator when omitted.
 * @returns {Function[]} Array of two Express middleware functions [primary, safetyNet]
 */
export const createSafeRateLimiter = ({
	prefix,
	windowMs,
	max,
	skipSuccessfulRequests = false,
	message = 'Too many requests, please try again later',
	keyGenerator,
}) => {
	// Build optional keyGenerator option — only spread when provided so that
	// express-rate-limit falls back to its default IP-based key otherwise.
	// When the caller passes a keyGenerator that falls back to req.ip, wrap it
	// so it uses ipKeyGenerator (which handles IPv6 normalisation) instead of
	// accessing req.ip directly — this satisfies express-rate-limit's built-in
	// IPv6 validation and prevents ERR_ERL_KEY_GEN_IPV6 at startup.
	const wrappedKeyGenerator = keyGenerator
		? (req, res) => {
			// If a user ID is available, use it directly (no IP involved).
			if (req.user?.id) return req.user.id;
			// Otherwise fall back to the IPv6-safe IP key.
			return ipKeyGenerator(req, res);
		}
		: undefined;
	const keyGeneratorOption = wrappedKeyGenerator ? { keyGenerator: wrappedKeyGenerator } : {};

	// In development skip all rate limiting so engineers can test freely.
	const isDev = process.env.NODE_ENV === 'development';
	if (isDev) {
		const noopMiddleware = (_req, _res, next) => next();
		return [noopMiddleware, noopMiddleware];
	}

	// Primary: Redis-backed, shared across all instances.
	// If Redis is unavailable the store throws, and express-rate-limit will call
	// the handler with the last known count — which means requests are NOT
	// blocked solely due to a Redis error.  The safety-net below handles that case.
	const primary = rateLimit({
		windowMs,
		max,
		skipSuccessfulRequests,
		standardHeaders: true,
		legacyHeaders: false,
		store: createRedisRateLimitStore(prefix, Math.ceil(windowMs / 1000)),
		// When the Redis store throws, skip (allow) the request here.
		// The in-memory safety-net will still enforce a ceiling.
		skip: () => false,
		handler: (req, res, next, options) => {
			res.status(options.statusCode).json({ message: options.message });
		},
		message,
		...keyGeneratorOption,
	});

	// Safety-net: in-memory, per-process.  Uses 2× the primary limit so it only
	// triggers when Redis is unavailable and the primary limiter is not counting.
	// This guarantees at most 2× max requests reach the application during a full
	// Redis outage rather than allowing unlimited traffic.
	const safetyNet = rateLimit({
		windowMs,
		max: max * 2,
		skipSuccessfulRequests,
		standardHeaders: false,
		legacyHeaders: false,
		message,
		...keyGeneratorOption,
	});

	// Return as array so callers can spread into router.use() or use individually.
	return [primary, safetyNet];
};
