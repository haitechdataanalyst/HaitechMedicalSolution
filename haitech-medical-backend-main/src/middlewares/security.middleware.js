import express from 'express';
import { httpStatus } from '../constants/index.js';

// Prevents browsers, CDNs, and proxies from caching sensitive/authenticated responses.
// Apply to all auth and private endpoints.
export const noCache = (req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	res.set('Pragma', 'no-cache');
	res.set('Expires', '0');
	next();
};

// Returns a JSON body-parser middleware capped at the given size limit.
// Use tighter limits on auth/form endpoints and larger ones only where needed.
export const jsonBody = (limit = '100kb') => express.json({ limit });

/**
 * Per-route request timeout middleware factory.
 *
 * The global 30-second timeout in app.js is a safety net for ordinary API
 * calls. Some routes legitimately need a different budget (e.g. file uploads,
 * report generation, external API proxies). Apply this BEFORE the handler
 * on those routes to override the effective timeout for that request.
 *
 * Usage:
 *   router.post('/upload', withTimeout(120_000), auth(), upload.single('file'), handler);
 *   router.post('/report', withTimeout(60_000), auth(), generateReport);
 *
 * @param {number} ms - Timeout in milliseconds.
 */
export const withTimeout = (ms) => (req, res, next) => {
	req.setTimeout(ms, () => {
		if (!res.headersSent) {
			res.respond(httpStatus.SERVICE_UNAVAILABLE, null, 'Request timeout');
		}
	});
	next();
};
