import { httpStatus } from '../constants/index.js';

export const gracefulShutdownGuard = (req, res, next) => {
	if (req.app.get('isShuttingDown')) {
		res.set('Connection', 'close');
		return res.respond(httpStatus.SERVICE_UNAVAILABLE, null, 'Server is shutting down');
	}
	next();
};
