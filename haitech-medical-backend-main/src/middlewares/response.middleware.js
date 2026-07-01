import { httpStatus } from '../constants/index.js';

export const responseFormatter = (req, res, next) => {
	res.respond = (statusCode = httpStatus.OK, data, message, meta) => {
		const parsedStatusCode = Number(statusCode);
		const hasValidStatusCode = Number.isInteger(parsedStatusCode) && parsedStatusCode >= 100 && parsedStatusCode <= 599;
		const finalStatusCode = hasValidStatusCode ? parsedStatusCode : httpStatus.INTERNAL_SERVER_ERROR;
		const isSuccess = finalStatusCode < 400;
		const finalMessage = hasValidStatusCode ? message : 'Invalid response status code';
		const finalData = hasValidStatusCode ? data : null;

		const response = {
			timestamp: new Date().toISOString(),
			statusCode: finalStatusCode,
			status: finalStatusCode,
			success: isSuccess,
			message: finalMessage ?? (isSuccess ? 'Success' : 'Error'),
			...(isSuccess ? { data: finalData ?? null } : { error: finalData ?? null }),
			...(meta && { meta }),
		};

		res.status(finalStatusCode).json(response);
	};

	next();
};
