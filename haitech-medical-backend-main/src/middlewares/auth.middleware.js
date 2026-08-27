import { supabaseAuthService } from '../services/index.js';
import { logger } from '../config/index.js';
import {
	unauthorizedError, forbiddenError, setRequestContext, extractToken,
	isApiError, getRedisData, setRedisData, incrementRedisKey, expireRedisKey,
} from '../utils/index.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const BRUTE_FORCE_MAX_ATTEMPTS = 5;
const BRUTE_FORCE_WINDOW_SECONDS = 15 * 60; // 15 minutes
const BRUTE_FORCE_PREFIX = 'auth:fail:';

// ── Helpers ───────────────────────────────────────────────────────────────────

// Track a failed authentication attempt for the given IP.
// After BRUTE_FORCE_MAX_ATTEMPTS failures the IP is locked for BRUTE_FORCE_WINDOW_SECONDS.
const recordAuthFailure = async (ip) => {
	try {
		const key = `${BRUTE_FORCE_PREFIX}${ip}`;
		const count = await incrementRedisKey(key, 1);
		// Set / refresh the TTL on the first increment so the window always
		// starts from the first failure, not from a later one.
		if (count === 1) {
			await expireRedisKey(key, BRUTE_FORCE_WINDOW_SECONDS);
		}
	} catch {
		// Non-critical — never block the response due to a Redis error here.
	}
};

// Clear the failure counter once a login succeeds from this IP.
const clearAuthFailures = async (ip) => {
	try {
		const key = `${BRUTE_FORCE_PREFIX}${ip}`;
		await setRedisData(key, 0, BRUTE_FORCE_WINDOW_SECONDS);
	} catch {
		// Non-critical.
	}
};

// Returns true if the IP is currently locked out.
const isLockedOut = async (ip) => {
	try {
		const count = await getRedisData(`${BRUTE_FORCE_PREFIX}${ip}`);
		return Number(count) >= BRUTE_FORCE_MAX_ATTEMPTS;
	} catch {
		// On Redis failure, do not block requests (fail-open).
		return false;
	}
};

// ── Core authenticate helper (shared by auth and optionalAuth) ────────────────
// Phase 4: identity comes from a Supabase-verified session, not a
// self-issued JWT. verifySupabaseToken checks the token against Supabase's
// own Auth server; resolveLocalUser resolves/JIT-provisions the local
// `users` row that this app's business tables (orders, cart, etc.) FK to.
const authenticate = async (req) => {
	const accessToken = extractToken(req.headers.authorization);
	if (!accessToken) return null;

	const supabaseUser = await supabaseAuthService.verifySupabaseToken(accessToken);
	const user = await supabaseAuthService.resolveLocalUser(supabaseUser);
	if (!user) return null;

	const resolvedRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

	return { id: user.id, role: resolvedRoles[0] || null, roles: resolvedRoles };
};

// ── Exports ───────────────────────────────────────────────────────────────────

/**
 * auth(...requiredRoles) — authenticate + optionally enforce roles.
 *
 * Usage:
 *   auth()              → any authenticated user
 *   auth('admin')       → admin only
 *   auth('admin','dealer') → admin OR dealer
 */
export const auth =
	(...requiredRoles) =>
	async (req, res, next) => {
		const ip = req.ip || req.socket?.remoteAddress || 'unknown';

		try {
			// Brute-force lockout check
			if (await isLockedOut(ip)) {
				return next(
					Object.assign(unauthorizedError('Too many failed attempts. Try again in 15 minutes.'), {
						statusCode: 429,
					})
				);
			}

			const accessToken = extractToken(req.headers.authorization);
			if (!accessToken) return next(unauthorizedError('Authentication required'));

			const supabaseUser = await supabaseAuthService.verifySupabaseToken(accessToken);
			const user = await supabaseAuthService.resolveLocalUser(supabaseUser);
			if (!user) {
				await recordAuthFailure(ip);
				return next(unauthorizedError('User not found'));
			}

			const resolvedRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

			if (!req.user) {
				req.user = { id: user.id, role: resolvedRoles[0] || null, roles: resolvedRoles };
			}

			setRequestContext({ userId: req.user.id });
			await clearAuthFailures(ip);

			if (requiredRoles.length && !requiredRoles.some((r) => resolvedRoles.includes(r))) {
				return next(forbiddenError('Insufficient permissions'));
			}

			next();
		} catch (error) {
			if (isApiError(error)) {
				await recordAuthFailure(ip);
				return next(error);
			}
			logger.error(`Auth middleware unexpected error: ${error.message}`);
			return next(unauthorizedError('Invalid token'));
		}
	};

/**
 * requireRoles(...roles) — cleaner named alternative to auth(...roles).
 * Identical behaviour; prefer this in new routes for readability.
 */
export const requireRoles = (...roles) => auth(...roles);

/** requireAdmin — shorthand for auth('admin'). */
export const requireAdmin = auth('admin');

/** requireDealer — shorthand for auth('dealer', 'admin'). */
export const requireDealer = auth('dealer', 'admin');

/**
 * optionalAuth — attach req.user if a valid token is present, but never fail.
 * Use on public endpoints that render richer responses for authenticated users.
 */
export const optionalAuth = async (req, res, next) => {
	try {
		const user = await authenticate(req);
		if (user) {
			// req is not concurrently mutated elsewhere in this codebase's
			// single-pass middleware chain — safe despite the awaited call above.
			// eslint-disable-next-line require-atomic-updates
			req.user = user;
			setRequestContext({ userId: user.id });
		}
	} catch {
		// Invalid token on a public endpoint → just ignore it.
	}
	next();
};

/**
 * requireOwnership(paramField) — verify req.user.id matches req.params[paramField].
 * Admins bypass the check automatically.
 *
 * Usage:
 *   router.delete('/addresses/:addressId', auth(), requireOwnership('addressId'), handler);
 */
export const requireOwnership = (paramField) => (req, res, next) => {
	if (!req.user) return next(unauthorizedError('Authentication required'));
	const isAdmin = req.user.roles?.includes('admin');
	if (isAdmin) return next();
	if (req.user.id !== req.params[paramField]) {
		return next(forbiddenError('Access denied: resource belongs to another user'));
	}
	next();
};
