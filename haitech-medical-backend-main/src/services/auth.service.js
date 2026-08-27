import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { env, logger } from '../config/index.js';
import { authProviders, roleCodes, tokens } from '../constants/index.js';
import { userRepository } from '../repositories/index.js';
import * as tokenService from './token.service.js';
import * as emailService from './email.service.js';
import { buildUserPayload } from './user.service.js';
import {
	conflictError, unauthorizedError, badRequestError, notFoundError,
	setRedisData, getRedisData, deleteRedisData,
} from '../utils/index.js';

// In-memory fallback for password-reset & email-verify tokens when Redis is down
const memTokens = new Map();
const memTokenSet = (key, val, ttlSec) => {
	memTokens.set(key, { val, exp: Date.now() + ttlSec * 1000 });
};
const memTokenGet = (key) => {
	const e = memTokens.get(key);
	if (!e) return null;
	if (Date.now() > e.exp) { memTokens.delete(key); return null; }
	return e.val;
};
const memTokenDel = (key) => memTokens.delete(key);

// ── Periodic cleanup: evict expired entries every 5 minutes ──────────────────
// Password-reset and email-verify tokens have a TTL of ~30 min. Without cleanup
// the Map grows unbounded when Redis is unavailable — a memory leak in production.
const MEM_TOKENS_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const _memTokensCleanupTimer = setInterval(() => {
	const now = Date.now();
	let evicted = 0;
	for (const [key, entry] of memTokens) {
		if (now > entry.exp) {
			memTokens.delete(key);
			evicted++;
		}
	}
	if (evicted > 0) {
		logger.debug(`[auth] memTokens cleanup: evicted ${evicted} expired entries (${memTokens.size} remaining)`);
	}
}, MEM_TOKENS_CLEANUP_INTERVAL_MS);

// Allow the Node.js process to exit normally without the timer holding the event loop.
if (_memTokensCleanupTimer.unref) _memTokensCleanupTimer.unref();

const safeSet = async (key, data, ttl) => {
	const ok = await setRedisData(key, data, ttl);
	if (!ok) { logger.warn(`[auth] Redis unavailable — storing "${key}" in memory`); memTokenSet(key, data, ttl); }
};
const safeGet = async (key) => (await getRedisData(key)) ?? memTokenGet(key);
const safeDel = async (key) => { await deleteRedisData(key); memTokenDel(key); };

const PW_RESET_PREFIX = 'pw_reset:';
const EMAIL_VERIFY_PREFIX = 'email_verify:';

const normalizeEmail = (email) => email.trim().toLowerCase();

const normalizeUsername = (username) => username.trim().toLowerCase();

const toExpiry = (value, defaultUnit) => {
	if (typeof value === 'number') {
		return `${value}${defaultUnit}`;
	}

	return value;
};

const issueAuthTokens = async (userId) => {
	const accessExpiry = toExpiry(env.JWT.ACCESS_EXPIRY_TIME, 'm');
	const refreshExpiry = toExpiry(env.JWT.REFRESH_EXPIRY_TIME, 'd');

	const accessToken = tokenService.generateToken(userId, accessExpiry, tokens.ACCESS);
	const refreshToken = tokenService.generateToken(userId, refreshExpiry, tokens.REFRESH);

	await tokenService.storeRefreshToken(userId, refreshToken, refreshExpiry);

	return { accessToken, refreshToken };
};

const ensureActiveUser = (user) => {
	if (!user || !user.active || user.userDetailsActive === false || user.blacklisted) {
		throw unauthorizedError('Account is not allowed to sign in');
	}

	return user;
};

const resolveUniqueGoogleUsername = async ({ preferredUsername, firstName, lastName }) => {
	const preferred = preferredUsername?.trim() ? normalizeUsername(preferredUsername) : null;

	if (preferred) {
		const existing = await userRepository.findByUsername(preferred);
		if (!existing) {
			return preferred;
		}

		throw conflictError('Username already taken');
	}

	const baseFirstName = firstName?.trim().toLowerCase() || 'google';
	const baseLastName = lastName?.trim().toLowerCase() || 'user';
	const seed = `${baseFirstName}${baseLastName}`.slice(0, 38) || 'googleuser';

	let suffix = 0;
	while (suffix < 100) {
		const candidate = suffix === 0 ? seed : `${seed}${suffix}`;
		const existing = await userRepository.findByUsername(candidate);
		if (!existing) {
			return candidate;
		}

		suffix += 1;
	}

	return `google${Date.now()}`;
};

export const register = async ({ firstName, lastName, username, email, phone, password }) => {
	const normalizedEmail = normalizeEmail(email);
	const normalizedUsername = normalizeUsername(username);
	const existingUserByEmail = await userRepository.findByEmail(normalizedEmail);

	if (existingUserByEmail) {
		throw conflictError('Email already registered');
	}

	const existingUserByUsername = await userRepository.findByUsername(normalizedUsername);

	if (existingUserByUsername) {
		throw conflictError('Username already taken');
	}

	const passwordHash = await bcryptjs.hash(password, 10);
	const user = await userRepository.create({
		email: normalizedEmail,
		username: normalizedUsername,
		firstName: firstName.trim(),
		lastName: lastName.trim(),
		phone: phone?.trim() || null,
		passwordHash,
		authProvider: authProviders.LOCAL,
		defaultRoleCode: roleCodes.USER,
		emailVerified: false,
		phoneVerified: false,
	});

	// Send email verification
	const verifyToken = crypto.randomBytes(32).toString('hex');
	const verifyTtl = (env.JWT.EMAIL_VERIFICATION_EXPIRY || 30) * 60;
	await safeSet(`${EMAIL_VERIFY_PREFIX}${verifyToken}`, { userId: user.id }, verifyTtl);
	await emailService.sendVerificationEmail(user.email, verifyToken);

	const authTokens = await issueAuthTokens(user.id);

	return { user: buildUserPayload(user), ...authTokens };
};

export const login = async ({ email, password }) => {
	const normalizedEmail = normalizeEmail(email);
	const user = ensureActiveUser(await userRepository.findByEmail(normalizedEmail));

	if (!user.passwordHash) {
		throw unauthorizedError('Invalid email or password');
	}

	const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		throw unauthorizedError('Invalid email or password');
	}

	const authTokens = await issueAuthTokens(user.id);

	return { user: buildUserPayload(user), ...authTokens };
};

export const googleSignIn = async ({ googleSub, email, firstName, lastName, username, phone }) => {
	let user = await userRepository.findByGoogleSub(googleSub);

	if (!user) {
		const normalizedEmail = normalizeEmail(email);
		const existingByEmail = await userRepository.findByEmail(normalizedEmail);

		if (existingByEmail) {
			if (existingByEmail.googleSub && existingByEmail.googleSub !== googleSub) {
				throw conflictError('Google account already linked to another user');
			}

			await userRepository.updateDetailsByUserId(existingByEmail.id, {
				googleSub,
				authProvider: existingByEmail.passwordHash ? authProviders.HYBRID : authProviders.GOOGLE,
				emailVerified: true,
			});

			user = await userRepository.findById(existingByEmail.id);
		} else {
			const generatedUsername = await resolveUniqueGoogleUsername({
				preferredUsername: username,
				firstName,
				lastName,
			});

			user = await userRepository.create({
				email: normalizedEmail,
				username: generatedUsername,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				phone: phone?.trim() || null,
				passwordHash: null,
				googleSub,
				authProvider: authProviders.GOOGLE,
				defaultRoleCode: roleCodes.USER,
				emailVerified: true,
				phoneVerified: false,
			});
		}
	}

	ensureActiveUser(user);

	const authTokens = await issueAuthTokens(user.id);

	return { user: buildUserPayload(user), ...authTokens };
};

export const logout = async (refreshToken) => {
	if (!refreshToken) return;
	await tokenService.revokeRefreshToken(refreshToken);
};

export const refreshTokens = async (refreshToken) => {
	if (!refreshToken) {
		throw unauthorizedError('Refresh token required');
	}

	const decoded = await tokenService.verifyToken(refreshToken, tokens.REFRESH);

	// Rotate: revoke old, issue new pair
	await tokenService.revokeRefreshToken(refreshToken);
	const authTokens = await issueAuthTokens(decoded.sub);

	return authTokens;
};

export const forgotPassword = async ({ email }) => {
	const normalizedEmail = normalizeEmail(email);
	const user = await userRepository.findByEmail(normalizedEmail);

	// Always return success — never reveal whether an email is registered
	if (!user || !user.active) return;

	const resetToken = crypto.randomBytes(32).toString('hex');
	const ttl = (env.JWT.RESET_PASSWORD_EXPIRY || 30) * 60;

	await safeSet(`${PW_RESET_PREFIX}${resetToken}`, { userId: user.id }, ttl);
	await emailService.sendPasswordResetEmail(user.email, resetToken);
};

export const resetPassword = async ({ token, password }) => {
	const data = await safeGet(`${PW_RESET_PREFIX}${token}`);

	if (!data?.userId) {
		throw badRequestError('Invalid or expired reset token');
	}

	const user = await userRepository.findById(data.userId);
	if (!user || !user.active) {
		throw notFoundError('User not found');
	}

	const passwordHash = await bcryptjs.hash(password, 10);

	await userRepository.updateDetailsByUserId(data.userId, {
		passwordHash,
		oldPasswordHash: user.passwordHash,
	});

	await safeDel(`${PW_RESET_PREFIX}${token}`);
	await tokenService.revokeAllUserTokens(data.userId);
};

export const verifyEmail = async ({ token }) => {
	const data = await safeGet(`${EMAIL_VERIFY_PREFIX}${token}`);

	if (!data?.userId) {
		throw badRequestError('Invalid or expired verification token');
	}

	await userRepository.updateDetailsByUserId(data.userId, { emailVerified: true });
	await safeDel(`${EMAIL_VERIFY_PREFIX}${token}`);
};

export const resendVerificationEmail = async (userId) => {
	const user = await userRepository.findById(userId);

	if (!user || !user.active) {
		throw notFoundError('User not found');
	}

	if (user.emailVerified) {
		throw conflictError('Email is already verified');
	}

	const verifyToken = crypto.randomBytes(32).toString('hex');
	const ttl = (env.JWT.EMAIL_VERIFICATION_EXPIRY || 30) * 60;

	await safeSet(`${EMAIL_VERIFY_PREFIX}${verifyToken}`, { userId }, ttl);
	await emailService.sendVerificationEmail(user.email, verifyToken);
};

const authService = {
	register,
	login,
	googleSignIn,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
	resendVerificationEmail,
};

export default authService;
