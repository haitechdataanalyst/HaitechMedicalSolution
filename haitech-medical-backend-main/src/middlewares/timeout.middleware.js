import { httpStatus } from '../constants/index.js';

export const requestTimeout = (req, res, next) => {
	req.setTimeout(30000, () => {
		if (!res.headersSent) {
			res.respond(httpStatus.SERVICE_UNAVAILABLE, null, 'Request timeout');
		}
	});

	next();
};
