import ApiError from './apiError.js';
import { httpStatus } from '../../constants/index.js';

export const createApiError = (statusCode, message, isOperational = true, stack = '') => {
	return new ApiError(statusCode, message, isOperational, stack);
};

export const isApiError = (error) => {
	return error instanceof ApiError;
};

// ── Named error factories ────────────────────────────────────────────────────
// 4xx — client errors (isOperational = true, expected mistakes)
export const badRequestError = (message = 'Bad request') => new ApiError(httpStatus.BAD_REQUEST, message);
export const unauthorizedError = (message = 'Unauthorized') => new ApiError(httpStatus.UNAUTHORIZED, message);
export const forbiddenError = (message = 'Forbidden') => new ApiError(httpStatus.FORBIDDEN, message);
export const notFoundError = (message = 'Not found') => new ApiError(httpStatus.NOT_FOUND, message);
export const conflictError = (message = 'Conflict') => new ApiError(httpStatus.CONFLICT, message);
export const validationError = (message = 'Validation failed') => new ApiError(httpStatus.UNPROCESSABLE_ENTITY, message);

// 5xx — server errors (isOperational = false, unexpected failures)
export const internalError = (message = 'Internal server error') => new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message, false);
export const serviceUnavailableError = (message = 'Service unavailable') => new ApiError(httpStatus.SERVICE_UNAVAILABLE, message, false);
