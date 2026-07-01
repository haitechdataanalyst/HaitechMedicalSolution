import crypto from 'node:crypto';
import { runWithRequestContext } from '../utils/index.js';

export const requestContextInit = (req, res, next) => {
	const requestId = req.headers['x-request-id'] || crypto.randomUUID();
	req.id = requestId;
	res.setHeader('X-Request-Id', requestId);

	runWithRequestContext(
		{
			requestId,
			method: req.method,
			path: req.originalUrl || req.url,
		},
		() => next()
	);
};
