import { logger } from '../config/index.js';
import { getRequestContext } from './request-context.js';

const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_RETRY_DELAY_MS = 250;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

const sleep = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const isRetryableError = (error, retryableStatuses) => {
	if (error?.name === 'AbortError') {
		return true;
	}

	return typeof error?.statusCode === 'number' && retryableStatuses.has(error.statusCode);
};

const parseResponse = async (response) => {
	if (response.status === 204 || response.status === 205) {
		return null;
	}

	const contentType = response.headers.get('content-type');
	if (contentType?.includes('application/json')) {
		return response.json();
	}

	return response.text();
};

export const fetchData = async (url, method = 'POST', payload = null, options = {}) => {
	const {
		headers: providedHeaders = {},
		timeoutMs = DEFAULT_TIMEOUT_MS,
		retries = 0,
		retryDelayMs = DEFAULT_RETRY_DELAY_MS,
		retryOnStatuses = [...RETRYABLE_STATUS_CODES],
		...fetchOverrides
	} = options;

	const { requestId } = getRequestContext();
	const requestMethod = String(method || 'POST').toUpperCase();
	const maxAttempts = Number.isInteger(retries) && retries > 0 ? retries + 1 : 1;
	const retryableStatuses = new Set(Array.isArray(retryOnStatuses) ? retryOnStatuses : [...RETRYABLE_STATUS_CODES]);
	const shouldAttachBody = payload !== null && payload !== undefined && !['GET', 'HEAD'].includes(requestMethod);

	const headers = {
		...(shouldAttachBody ? { 'Content-Type': 'application/json' } : {}),
		...(requestId ? { 'X-Request-Id': requestId } : {}),
		...providedHeaders,
	};

	let lastError;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const controller = new AbortController();
		const timeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const finalOptions = {
				method: requestMethod,
				headers,
				signal: controller.signal,
				...fetchOverrides,
			};

			if (shouldAttachBody) {
				finalOptions.body = typeof payload === 'string' ? payload : JSON.stringify(payload);
			}

			const response = await fetch(url, finalOptions);

			logger.info(`Fetch ${requestMethod} request to ${url} responded with status ${response.status}`);

			if (!response.ok) {
				const errorText = await response.text();
				const error = new Error(`HTTP error ${response.status}: ${errorText || response.statusText}`);
				error.statusCode = response.status;
				throw error;
			}

			return await parseResponse(response);
		} catch (error) {
			lastError = error;
			logger.error(`Fetch error for URL "${url}"`, {
				error: error.message,
				url,
				method: requestMethod,
				attempt,
				maxAttempts,
			});

			if (attempt < maxAttempts && isRetryableError(error, retryableStatuses)) {
				const delayMs = Math.max(0, Number(retryDelayMs) || 0) * attempt;
				if (delayMs > 0) {
					await sleep(delayMs);
				}
				continue;
			}

			throw error;
		} finally {
			clearTimeout(timeoutId);
		}
	}

	throw lastError;
};
