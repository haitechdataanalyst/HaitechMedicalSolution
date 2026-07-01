import crypto from 'node:crypto';
import { runWithRequestContext, getRequestContext, setRequestContext } from '../utils/index.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const resolveRequestId = (req) => {
	const incoming = req.headers['x-request-id'];
	if (incoming && UUID_REGEX.test(incoming)) {
		return incoming;
	}
	return crypto.randomUUID();
};

export const requestId = (req, res, next) => {
	const id = resolveRequestId(req);

	req.id = id;
	res.setHeader('X-Request-ID', id);
	res.setHeader('X-Correlation-ID', id);

	const existingContext = getRequestContext();

	if (Object.keys(existingContext).length > 0) {
		setRequestContext({ requestId: id });
		return next();
	}

	runWithRequestContext(
		{
			requestId: id,
			method: req.method,
			path: req.originalUrl || req.url,
		},
		() => next()
	);
};
