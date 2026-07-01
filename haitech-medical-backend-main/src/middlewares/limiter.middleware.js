import { createSafeRateLimiter } from '../utils/index.js';

// Each createSafeRateLimiter call returns [primaryRedisLimiter, inMemorySafetyNetLimiter].
// Both must be applied — spread them into express router.use() or apply sequentially.
//
// If Redis is healthy:  primaryRedisLimiter counts and enforces; safetyNetLimiter
//                       has a 2× ceiling and never fires under normal load.
// If Redis is down:     primaryRedisLimiter allows requests (store errors are skipped);
//                       safetyNetLimiter enforces a per-process ceiling of 2× max,
//                       preventing unbounded DoS traffic from reaching the application.

// ---------------------------------------------------------------------------
// Auth limiter — 20 failed attempts per 15 min per IP
// Counts only failed requests (skipSuccessfulRequests: true).
// ---------------------------------------------------------------------------
export const [authLimiterPrimary, authLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'auth',
	windowMs: 15 * 60 * 1000,
	max: 20,
	skipSuccessfulRequests: true,
	message: 'Too many requests, please try again later',
});

// Convenience export: apply both in one go with router.use(authLimiter)
export const authLimiter = [authLimiterPrimary, authLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Register limiter — 10 attempts per 15 min per IP
// Counts ALL requests regardless of response status.
// ---------------------------------------------------------------------------
export const [registerLimiterPrimary, registerLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'register',
	windowMs: 15 * 60 * 1000,
	max: 10,
	skipSuccessfulRequests: false,
	message: 'Too many registration attempts, please try again later',
});

export const registerLimiter = [registerLimiterPrimary, registerLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Overall (global) limiter — 100 requests per 15 min per IP
// Counts ALL requests. Serves as a coarse DoS shield for the entire API.
// ---------------------------------------------------------------------------
export const [overallLimiterPrimary, overallLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'global',
	windowMs: 15 * 60 * 1000,
	max: 100,
	skipSuccessfulRequests: false,
	message: 'Too many requests, please try again later',
});

export const overallLimiter = [overallLimiterPrimary, overallLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Strict auth limiter — 5 attempts per 15 min per IP
// Intended for the login endpoint specifically. Tighter than authLimiter.
// Counts only failed requests (skipSuccessfulRequests: true).
// ---------------------------------------------------------------------------
export const [strictAuthLimiterPrimary, strictAuthLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'strict-auth',
	windowMs: 15 * 60 * 1000,
	max: 5,
	skipSuccessfulRequests: true,
	message: 'Too many login attempts, please try again later',
});

export const strictAuthLimiter = [strictAuthLimiterPrimary, strictAuthLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Payment limiter — 20 requests per 1 min per userId (falls back to IP)
// Keyed by authenticated user ID so that a single account cannot spam payment
// endpoints even from multiple IPs. Falls back to IP for unauthenticated callers.
// ---------------------------------------------------------------------------
export const [paymentLimiterPrimary, paymentLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'payment',
	windowMs: 60_000,
	max: 20,
	skipSuccessfulRequests: false,
	message: 'Too many payment requests, please try again later',
	keyGenerator: (req) => req.user?.id || req.ip,
});

export const paymentLimiter = [paymentLimiterPrimary, paymentLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Write limiter — 60 state-changing requests per 1 min per userId
// Applied to POST / PUT / PATCH / DELETE routes. Keyed by userId so that a
// single account cannot generate write storms from many concurrent connections.
// Falls back to IP for unauthenticated write endpoints.
// ---------------------------------------------------------------------------
export const [writeLimiterPrimary, writeLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'write',
	windowMs: 60_000,
	max: 60,
	skipSuccessfulRequests: false,
	message: 'Too many requests, please try again later',
	keyGenerator: (req) => req.user?.id || req.ip,
});

export const writeLimiter = [writeLimiterPrimary, writeLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Search limiter — 120 requests per 1 min per IP
// Applied to search and catalog browse endpoints. Higher ceiling because these
// are read-only and used by guest visitors as well as authenticated users.
// ---------------------------------------------------------------------------
export const [searchLimiterPrimary, searchLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'search',
	windowMs: 60_000,
	max: 120,
	skipSuccessfulRequests: false,
	message: 'Too many search requests, please try again later',
});

export const searchLimiter = [searchLimiterPrimary, searchLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Webhook limiter — 200 requests per 1 min per IP
// Webhook sources (payment gateways, shipping providers, etc.) can burst.
// This ceiling is intentionally high to avoid dropping legitimate callbacks
// while still providing a DoS floor.
// ---------------------------------------------------------------------------
export const [webhookLimiterPrimary, webhookLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'webhook',
	windowMs: 60_000,
	max: 200,
	skipSuccessfulRequests: false,
	message: 'Too many webhook requests, please try again later',
});

export const webhookLimiter = [webhookLimiterPrimary, webhookLimiterSafetyNet];

// ---------------------------------------------------------------------------
// Admin limiter — 100 requests per 1 min per userId
// Keyed by userId rather than IP because admin users typically operate from
// shared office IPs. A per-account ceiling prevents a compromised admin
// credential from being used to scrape or hammer the admin API.
// ---------------------------------------------------------------------------
export const [adminLimiterPrimary, adminLimiterSafetyNet] = createSafeRateLimiter({
	prefix: 'admin',
	windowMs: 60_000,
	max: 100,
	skipSuccessfulRequests: false,
	message: 'Too many admin requests, please try again later',
	keyGenerator: (req) => req.user?.id || req.ip,
});

export const adminLimiter = [adminLimiterPrimary, adminLimiterSafetyNet];
