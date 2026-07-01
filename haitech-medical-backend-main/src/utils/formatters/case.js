import { CAMEL_TO_SNAKE_REGEX, SNAKE_TO_CAMEL_REGEX } from '../../constants/index.js';

// Convert camelCase to snake_case
export const toSnakeCase = (str) => {
	return str.replace(CAMEL_TO_SNAKE_REGEX, (letter) => `_${letter.toLowerCase()}`);
};

// Convert snake_case to camelCase
export const toCamelCase = (str) => {
	return str.replace(SNAKE_TO_CAMEL_REGEX, (_, letter) => letter.toUpperCase());
};

// Convert object keys from camelCase to snake_case
export const keysToSnakeCase = (obj) => {
	if (obj === null || typeof obj !== 'object' || obj instanceof Date) return obj;
	if (Array.isArray(obj)) return obj.map(keysToSnakeCase);

	return Object.keys(obj).reduce((acc, key) => {
		const snakeKey = toSnakeCase(key);
		// eslint-disable-next-line security/detect-object-injection
		const value = obj[key];
		// eslint-disable-next-line security/detect-object-injection
		acc[snakeKey] = typeof value === 'object' && value !== null ? keysToSnakeCase(value) : value;
		return acc;
	}, {});
};

// Convert object keys from snake_case to camelCase
export const keysToCamelCase = (obj) => {
	if (obj === null || typeof obj !== 'object' || obj instanceof Date) return obj;
	if (Array.isArray(obj)) return obj.map(keysToCamelCase);

	return Object.keys(obj).reduce((acc, key) => {
		const camelKey = toCamelCase(key);
		// eslint-disable-next-line security/detect-object-injection
		const value = obj[key];
		// eslint-disable-next-line security/detect-object-injection
		acc[camelKey] = typeof value === 'object' && value !== null ? keysToCamelCase(value) : value;
		return acc;
	}, {});
};
