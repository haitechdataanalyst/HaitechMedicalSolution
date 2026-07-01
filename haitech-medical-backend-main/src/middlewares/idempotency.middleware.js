import { getRedisData, setRedisData, badRequestError } from '../utils/index.js';
import { httpStatus } from '../constants/index.js';
import { logger, redis } from '../config/index.js';

// How long (seconds) a completed response is cached under its idempotency key.
// 24 hours — matches common industry defaults (Stripe, PayPal, etc.).
const IDEMPOTENCY_TTL = 86400;

// How long (seconds) the in-flight processing lock is held before expiring.
// 30 seconds is generous for any single request; prevents deadlocks if the
// server crashes mid-request.
const LOCK_TTL = 30;

// UUID v4 only — tighter than the previous [\w-]{1,128} which allowed
// arbitrary strings that could be guessed or enumerated.
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_KEY_LENGTH = 255;

/**
 * Build a user-scoped Redis key to prevent cross-user replay attacks.
 *
 *  Authenticated : idm:{userId}:{idempotency-key}
 *  Anonymous     : idm:anon:{ip}:{idempotency-key}
 *
 * The lock variant prefixes the scoped key with "idm:lock:".
 */
function buildScopedKey(req, rawKey) {
	if (req.user && req.user.id) {
		return `idm:${req.user.id}:${rawKey}`;
	}

	// Fall back to the client IP for unauthenticated (public) endpoints.
	// req.ip honours the X-Forwarded-For trust established by app.set('trust proxy').
	const ip = (req.ip || req.socket?.remoteAddress || 'unknown').replace(/:/g, '_');
	return `idm:anon:${ip}:${rawKey}`;
}

/**
 * Attempt to acquire a SET NX lock in Redis using the raw client.
 *
 * setRedisData does not expose the NX option, so we access the client
 * directly here.  The circuit-breaker wrapper is used to stay consistent
 * with the rest of the codebase.
 *
 * Returns true  if the lock was acquired (key did not exist).
 * Returns false if the key already existed (another request holds the lock).
 * Throws        on Redis connection / circuit-breaker errors.
 */
async function acquireLock(lockKey) {
	return redis.executeWithRedisCircuitBreaker(
		`setnx:${lockKey}`,
		async () => {
			const client = redis.getRedisClient();
			// SET key value NX EX ttl  — returns "OK" on success, null on contention.
			const result = await client.set(lockKey, '1', { NX: true, EX: LOCK_TTL });
			return result === 'OK';
		},
		null // fallback — null signals "Redis unavailable", handled by caller
	);
}

/**
 * Atomically replace the in-flight lock with the final cached result.
 *
 * Uses a Redis MULTI/EXEC pipeline so both operations succeed or fail
 * together, leaving no window where the lock is gone but the result
 * is not yet stored.
 *
 * Returns true on success, false on pipeline failure.
 * Never throws — errors are logged and swallowed so the caller can still
 * send the response.
 */
async function commitResult(lockKey, resultKey, payload) {
	try {
		return await redis.executeWithRedisCircuitBreaker(
			`commit:${resultKey}`,
			async () => {
				const client = redis.getRedisClient();
				const pipeline = client.multi();
				pipeline.del(lockKey);
				pipeline.setEx(resultKey, IDEMPOTENCY_TTL, JSON.stringify(payload));
				await pipeline.exec();
				return true;
			},
			false
		);
	} catch (err) {
		logger.error({ err, resultKey }, 'Idempotency commit pipeline failed');
		return false;
	}
}

/**
 * Release (delete) the in-flight lock without storing a result.
 * Called when the handler returned a non-2xx response so the client
 * can fix the payload and retry with the same key.
 */
async function releaseLock(lockKey) {
	try {
		await redis.executeWithRedisCircuitBreaker(
			`del:${lockKey}`,
			async () => {
				const client = redis.getRedisClient();
				return client.del(lockKey);
			},
			0
		);
	} catch (err) {
		// Non-critical — the lock will self-expire after LOCK_TTL seconds.
		logger.warn({ err, lockKey }, 'Idempotency lock release failed; will expire automatically');
	}
}

/**
 * Idempotency middleware for POST and PUT requests.
 *
 * When a client sends an `Idempotency-Key` header the middleware:
 *  1. Validates the key is a UUID v4 (≤ 255 chars).
 *  2. Builds a user-scoped Redis key to prevent cross-user replay attacks.
 *  3. Checks for a completed cached response — if found, replays it (no DB hit).
 *  4. Checks for an in-flight lock — if found, returns 409 REQUEST_IN_PROGRESS.
 *  5. Sets a processing lock (SET NX, 30 s TTL) and lets the request through.
 *  6. After handler:
 *       2xx  → atomically swaps lock for the cached result (pipeline DEL + SETEX).
 *       non-2xx → deletes the lock so the client may retry with the same key.
 *
 * Redis failures are fail-open: the request is allowed through without caching
 * so that a Redis outage cannot block payment or order operations.
 *
 * Usage (add BEFORE your controller on state-changing routes):
 *   router.post('/orders', idempotency, validate(schema), createOrder);
 *
 * Client responsibility:
 *   - Generate a UUID v4 per logical operation (not per HTTP call).
 *   - Re-send the same key on retries; use a new key for a different operation.
 *   - The `Idempotency-Key` header must be whitelisted in your CORS config.
 */
export const idempotency = async (req, res, next) => {
	// Only POST / PUT carry state-changing side effects worth protecting.
	if (!['POST', 'PUT'].includes(req.method)) return next();

	const rawKey = req.headers['idempotency-key'];

	// Key is optional — missing header means caller opted out of the guarantee.
	if (!rawKey) return next();

	// Enforce length before running the regex to avoid ReDoS on huge strings.
	if (typeof rawKey !== 'string' || rawKey.length > MAX_KEY_LENGTH || !UUID_V4_REGEX.test(rawKey)) {
		return next(
			badRequestError(
				'Invalid Idempotency-Key: must be a UUID v4 (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)'
			)
		);
	}

	const scopedKey = buildScopedKey(req, rawKey);
	const lockKey = `idm:lock:${scopedKey}`;

	// ── Step 1: Check for a completed cached response (fail-open on Redis error) ──
	let cached = null;
	try {
		cached = await getRedisData(scopedKey, { throwOnError: true });
	} catch (err) {
		// Redis unavailable — log and fall through to process the request normally.
		logger.error({ err, idempotencyKey: rawKey }, 'Idempotency cache read failed — failing open');
		return next();
	}

	if (cached) {
		logger.debug({ idempotencyKey: rawKey }, 'Idempotency cache hit — replaying response');
		res.setHeader('X-Idempotency-Replayed', 'true');
		return res.respond(cached.statusCode, cached.data, cached.message);
	}

	// ── Step 2: Check / acquire the in-flight processing lock ────────────────────
	let lockAcquired = false;
	try {
		const result = await acquireLock(lockKey);

		if (result === null) {
			// Circuit-breaker returned the fallback (null) — Redis is unavailable.
			// Fail open: skip idempotency guarantees rather than blocking the request.
			logger.warn({ idempotencyKey: rawKey }, 'Idempotency lock check unavailable — failing open');
			return next();
		}

		if (result === false) {
			// Lock exists — another request with the same key is currently in flight.
			logger.info({ idempotencyKey: rawKey }, 'Idempotency key in flight — returning 409');
			return res.status(httpStatus.CONFLICT).json({
				success: false,
				error: {
					code: 'REQUEST_IN_PROGRESS',
					message:
						'A request with this Idempotency-Key is already being processed. Wait and retry.',
				},
			});
		}

		// Lock was acquired successfully.
		lockAcquired = true;
	} catch (err) {
		// Unexpected error — fail open.
		logger.error({ err, idempotencyKey: rawKey }, 'Idempotency lock acquisition failed — failing open');
		return next();
	}

	// ── Step 3: Intercept the response so we can cache / release on completion ───
	const originalRespond = res.respond.bind(res);

	res.respond = async (statusCode, data, message) => {
		if (statusCode >= 200 && statusCode < 300) {
			// Atomically replace the lock with the full result.
			const committed = await commitResult(lockKey, scopedKey, { statusCode, data, message });
			if (!committed) {
				// Log the failure but still return the real response to the client.
				// The lock will self-expire; the next retry will re-run the handler
				// rather than getting a cached reply — acceptable under Redis degradation.
				logger.error({ idempotencyKey: rawKey }, 'Idempotency result commit failed — response sent without caching');
			}
		} else {
			// Non-2xx: release the lock so the client may correct and retry.
			if (lockAcquired) {
				await releaseLock(lockKey);
			}
		}

		return originalRespond(statusCode, data, message);
	};

	return next();
};
