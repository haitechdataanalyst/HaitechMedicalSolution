import { unauthorizedError, setRedisData, getRedisData, deleteRedisData, parseExpiryToSeconds } from '../utils/index.js';
import { env, logger, redis } from '../config/index.js';
import { tokens } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const RT_PREFIX = 'rt:';
const USER_INVALIDATED_AT_PREFIX = 'user_invalidated_at:';

const toExpiry = (value, defaultUnit) => {
	if (typeof value === 'number') return `${value}${defaultUnit}`;
	return value;
};

// ── In-memory fallback store (used when Redis is unavailable) ─────────────────
// Keys: same as Redis keys. Values: { data, expiresAt (ms epoch) }
// This allows the auth system to work in development without Redis.
// NOT suitable for multi-process production deployments.
const memStore = new Map();

const memSet = (key, data, ttlSeconds) => {
	const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : Infinity;
	memStore.set(key, { data, expiresAt });
	return true;
};

const memGet = (key) => {
	const entry = memStore.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) { memStore.delete(key); return null; }
	return entry.data;
};

const memDel = (key) => {
	const existed = memStore.has(key);
	memStore.delete(key);
	return existed;
};

// ── Periodic cleanup: evict expired entries every 5 minutes ──────────────────
// Without this the Map grows unbounded whenever Redis is unavailable because
// jwt tokens (especially refresh tokens with multi-day TTLs) accumulate and
// are never evicted until the process restarts — a memory leak in production.
const MEM_STORE_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const _memStoreCleanupTimer = setInterval(() => {
	const now = Date.now();
	let evicted = 0;
	for (const [key, entry] of memStore) {
		if (now > entry.expiresAt) {
			memStore.delete(key);
			evicted++;
		}
	}
	if (evicted > 0) {
		logger.debug(`[token] memStore cleanup: evicted ${evicted} expired entries (${memStore.size} remaining)`);
	}
}, MEM_STORE_CLEANUP_INTERVAL_MS);

// Allow the Node.js process to exit normally — the timer must not keep the
// event loop alive when everything else has shut down.
if (_memStoreCleanupTimer.unref) _memStoreCleanupTimer.unref();

// ── Storage helpers with Redis → memory fallback ──────────────────────────────

const safeSet = async (key, data, ttl) => {
	if (redis.isRedisConnected()) {
		const ok = await setRedisData(key, data, ttl);
		if (ok) return true;
	}
	logger.warn(`[token] Redis unavailable — storing "${key}" in memory (dev fallback)`);
	return memSet(key, data, ttl ?? 0);
};

const safeGet = async (key) => {
	if (redis.isRedisConnected()) {
		return getRedisData(key);
	}
	return memGet(key);
};

const safeDel = async (key) => {
	if (redis.isRedisConnected()) {
		return deleteRedisData(key);
	}
	return memDel(key);
};

// ── Public API ────────────────────────────────────────────────────────────────

export const generateToken = (userId, expiresIn, type, secret = env.JWT.SECRET) => {
	const jti = uuidv4();
	// Explicitly set algorithm to HS256 to prevent "alg: none" attacks and
	// accidental RS256/ES256 mismatch if a symmetric secret is used.
	return jwt.sign({ sub: userId, type, jti }, secret, { expiresIn, algorithm: 'HS256' });
};

export const storeRefreshToken = async (userId, token, expiresIn) => {
	const decoded = jwt.decode(token);
	if (!decoded?.jti) return false;
	const ttl = parseExpiryToSeconds(expiresIn);
	return safeSet(`${RT_PREFIX}${decoded.jti}`, { userId }, ttl);
};

export const revokeRefreshToken = async (token) => {
	const decoded = jwt.decode(token);
	if (!decoded?.jti) return false;
	return safeDel(`${RT_PREFIX}${decoded.jti}`);
};

export const revokeAllUserTokens = async (userId) => {
	const ttl = parseExpiryToSeconds(toExpiry(env.JWT.REFRESH_EXPIRY_TIME, 'd'));
	return safeSet(`${USER_INVALIDATED_AT_PREFIX}${userId}`, { invalidatedAt: Date.now() }, ttl);
};

export const verifyToken = async (token, type, secret = env.JWT.SECRET) => {
	let decoded;
	try {
		// algorithms whitelist prevents the "alg: none" attack and any
		// asymmetric-algorithm confusion attack when a symmetric secret is used.
		decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
	} catch (err) {
		// Distinguish expired tokens from structurally invalid tokens so that
		// the auth middleware can surface a specific "token expired" message to
		// the client, allowing it to trigger a silent refresh rather than a
		// full logout on every expiry.
		if (err.name === 'TokenExpiredError') {
			throw unauthorizedError('Token expired, please get a new token');
		}
		// JsonWebTokenError (bad signature, malformed), NotBeforeError, etc.
		throw unauthorizedError('Invalid token');
	}

	if (decoded.type !== type) {
		throw unauthorizedError('Invalid token type');
	}

	// Check user-level invalidation (password change / security reset)
	const invalidation = await safeGet(`${USER_INVALIDATED_AT_PREFIX}${decoded.sub}`);
	if (invalidation && decoded.iat * 1000 < invalidation.invalidatedAt) {
		throw unauthorizedError('Token has been revoked');
	}

	// Refresh tokens must exist in the allowlist
	if (type === tokens.REFRESH) {
		if (!decoded.jti) throw unauthorizedError('Token has been revoked');
		const stored = await safeGet(`${RT_PREFIX}${decoded.jti}`);
		if (!stored) throw unauthorizedError('Token has been revoked');
	}

	return decoded;
};
