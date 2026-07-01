export const httpStatus = {
	// 2xx Success
	OK: 200, // Successful GET, general success
	CREATED: 201, // Resource created (POST)
	NO_CONTENT: 204, // Successful, no response body (DELETE, PUT with no return)

	// 4xx Client Errors
	BAD_REQUEST: 400, // Validation errors, malformed request
	UNAUTHORIZED: 401, // Missing/invalid authentication
	FORBIDDEN: 403, // Authenticated but no permission
	NOT_FOUND: 404, // Resource not found
	CONFLICT: 409, // Duplicate, already exists (e.g., user/email conflict)
	UNPROCESSABLE_ENTITY: 422, // Validation failed, semantic errors

	// 5xx Server Errors
	INTERNAL_SERVER_ERROR: 500, // Unexpected server crash
	SERVICE_UNAVAILABLE: 503, // DB/Redis/External service unavailable
};
