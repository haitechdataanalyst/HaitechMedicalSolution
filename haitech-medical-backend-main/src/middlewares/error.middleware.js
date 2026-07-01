import { httpStatus, environments } from '../constants/index.js';
import { env, logger } from '../config/index.js';
import { createApiError, isApiError } from '../utils/index.js';

export const errorConverter = (err, req, res, next) => {
	let error = err;

	if (!isApiError(error)) {
		let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

		if (error.name === 'ValidationError') {
			statusCode = httpStatus.BAD_REQUEST;
		}

		if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
			statusCode = httpStatus.UNAUTHORIZED;
		}

		if (error.code) {
			if (error.code === '23505') {
				statusCode = httpStatus.CONFLICT;
			} else if (['23503', '22P02', '23502', '23514', '22001', '22003', '22007', '42601', '42703', '42P01'].includes(error.code)) {
				statusCode = httpStatus.BAD_REQUEST;
			} else if (['ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND'].includes(error.code)) {
				statusCode = httpStatus.SERVICE_UNAVAILABLE;
			}
		}

		const message = error.message || httpStatus[statusCode]; // eslint-disable-line security/detect-object-injection
		error = createApiError(statusCode, message, false, err.stack);
	}

	next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
	let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
	let message = err.message || httpStatus[statusCode]; // eslint-disable-line security/detect-object-injection

	const isProd = env.ENV === environments.PROD;
	const isDev = env.ENV === environments.DEV;

	if (isProd && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = 'Something went wrong';
	}

	if (isDev) {
		res.locals.errorMessage = err.message;
	}

	const response = {
		...(isDev && { stack: err.stack }),
	};

	if (err.isOperational) {
		logger.warn(err.message);
	} else {
		logger.error(err.message, { stack: err.stack });
	}

	return res.respond(statusCode, null, message, response);
};
