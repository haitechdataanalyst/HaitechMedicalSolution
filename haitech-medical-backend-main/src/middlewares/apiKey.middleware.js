import crypto from 'node:crypto';
import { env, logger } from '../config/index.js';
import { routesWithApiKey } from '../constants/index.js';
import { forbiddenError, serviceUnavailableError, unauthorizedError } from '../utils/index.js';

const normalizePath = (path = '') => {
	const withoutQuery = String(path).split('?')[0];
	const normalized = `/${withoutQuery.replace(/^\/+/, '').replace(/\/+$/, '')}`;
	return normalized === '/.' ? '/' : normalized;
};

const toSegments = (path) => normalizePath(path).split('/').filter(Boolean);

const pathMatches = (requestPath, routePath) => {
	const requestSegments = toSegments(requestPath);
	const routeSegments = toSegments(routePath);

	if (requestSegments.length !== routeSegments.length) {
		return false;
	}

	const requestIterator = requestSegments.values();

	for (const routeSegment of routeSegments) {
		const requestSegment = requestIterator.next().value;

		if (routeSegment.startsWith(':')) {
			if (!requestSegment) {
				return false;
			}
			continue;
		}

		if (routeSegment !== requestSegment) {
			return false;
		}
	}

	return true;
};

const routeMatchers = routesWithApiKey
	.filter((route) => route && typeof route.method === 'string' && typeof route.path === 'string')
	.map((route) => ({
		method: route.method.toUpperCase(),
		path: normalizePath(route.path),
	}));

const isProtectedRoute = (req) => {
	if (!routeMatchers.length) {
		return false;
	}

	const method = req.method?.toUpperCase();
	const routePath = normalizePath(req.originalUrl || `${req.baseUrl || ''}${req.path || ''}`);

	return routeMatchers.some((route) => route.method === method && pathMatches(routePath, route.path));
};

const isValidApiKey = (providedKey) => {
	if (!providedKey || !env.API_KEYS.length) {
		return false;
	}

	const providedBuffer = Buffer.from(providedKey);

	return env.API_KEYS.some((candidate) => {
		const candidateBuffer = Buffer.from(candidate);

		if (candidateBuffer.length !== providedBuffer.length) {
			return false;
		}

		return crypto.timingSafeEqual(candidateBuffer, providedBuffer);
	});
};

export const apiKeyAuth = (req, _res, next) => {
	if (!isProtectedRoute(req)) {
		return next();
	}

	if (!env.API_KEYS.length) {
		logger.error('API key middleware enabled for protected routes but API_KEYS is empty');
		return next(serviceUnavailableError('API key authentication is unavailable'));
	}

	const providedKey = req.get('X-Api-Key');
	if (!providedKey) {
		return next(unauthorizedError('API key required'));
	}

	if (!isValidApiKey(providedKey)) {
		return next(forbiddenError('Invalid API key'));
	}

	return next();
};
