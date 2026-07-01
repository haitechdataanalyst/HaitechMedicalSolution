import { SENSITIVE_FIELDS_REGEX, BCRYPT_HASH_REGEX, JWT_TOKEN_REGEX, SQL_INSERT_PATTERN_REGEX, SQL_COL_PARAM_REGEX, DOUBLE_QUOTE_REGEX } from '../constants/index.js';

const SENSITIVE_VALUE_PATTERNS = [BCRYPT_HASH_REGEX, JWT_TOKEN_REGEX];

const REDACTED = '[REDACTED]';

// Guards against deeply nested payloads causing a call-stack overflow.
// 10 levels is sufficient for any legitimate API payload.
const MAX_SANITIZE_DEPTH = 10;

/**
 * Check whether a field name matches a known sensitive pattern.
 */
export const isSensitiveField = (fieldName) => SENSITIVE_FIELDS_REGEX.test(String(fieldName));

/**
 * Check whether a value looks like a secret (bcrypt hash, JWT, etc.).
 * Only inspects strings of 20+ characters to avoid false positives on short values.
 */
export const isSensitiveValue = (value) => {
	if (typeof value !== 'string' || value.length < 20) return false;
	return SENSITIVE_VALUE_PATTERNS.some((pattern) => pattern.test(value));
};

/**
 * Deep-clone an object and replace values of sensitive fields with '[REDACTED]'.
 * Also detects values that look like secrets (bcrypt hashes, JWTs) regardless of field name.
 *
 * Safe for logging — the original object is never mutated.
 *
 * Protections:
 *  - Depth limit (MAX_SANITIZE_DEPTH): prevents stack overflow from deeply nested payloads.
 *  - Circular reference detection: _seen tracks the current ancestor chain (DFS path).
 *    Objects are removed from _seen after their subtree is fully processed so that the
 *    same object legitimately appearing in sibling branches is not falsely flagged.
 */
export const sanitize = (input, _seen = new WeakSet(), _depth = 0) => {
	if (input === null || input === undefined) return input;
	if (typeof input !== 'object') return input;
	if (_depth > MAX_SANITIZE_DEPTH) return '[MaxDepth]';
	if (_seen.has(input)) return '[Circular]';

	_seen.add(input);

	let result;

	if (Array.isArray(input)) {
		result = input.map((item) => sanitize(item, _seen, _depth + 1));
	} else {
		result = {};
		for (const [key, value] of Object.entries(input)) {
			if (isSensitiveField(key)) {
				result[key] = REDACTED; // eslint-disable-line security/detect-object-injection
			} else if (typeof value === 'string' && isSensitiveValue(value)) {
				result[key] = REDACTED; // eslint-disable-line security/detect-object-injection
			} else if (typeof value === 'object' && value !== null) {
				result[key] = sanitize(value, _seen, _depth + 1); // eslint-disable-line security/detect-object-injection
			} else {
				result[key] = value; // eslint-disable-line security/detect-object-injection
			}
		}
	}

	// Remove from the ancestor-path set so the same object reference appearing
	// in a sibling branch is processed normally rather than flagged as circular.
	_seen.delete(input);

	return result;
};

/**
 * Mask sensitive parameters in a SQL query's parameter array.
 *
 * Maps $N placeholders to column names for INSERT and UPDATE/WHERE patterns,
 * then redacts values whose column matches a sensitive field name.
 * Falls back to value-based detection for unmapped parameters.
 */
export const sanitizeQueryParams = (query, params) => {
	if (!params || !params.length) return params;

	const columnMap = buildColumnParamMap(query);

	return params.map((param, index) => {
		const columnName = columnMap.get(index + 1);

		if (columnName && isSensitiveField(columnName)) {
			return REDACTED;
		}

		if (typeof param === 'string' && isSensitiveValue(param)) {
			return REDACTED;
		}

		return param;
	});
};

/**
 * Extracts column-to-parameter-position mapping from SQL queries.
 * Supports INSERT INTO ... (cols) VALUES ($1, $2) and col = $N patterns (UPDATE SET / WHERE).
 */
const buildColumnParamMap = (query) => {
	const map = new Map();

	// INSERT pattern: INSERT INTO table (col1, col2) VALUES ($1, $2)
	const insertMatch = query.match(SQL_INSERT_PATTERN_REGEX);
	if (insertMatch) {
		const columns = insertMatch[1].split(',').map((c) => c.trim().replace(DOUBLE_QUOTE_REGEX, ''));
		const placeholders = insertMatch[2].split(',').map((p) => p.trim());

		columns.forEach((column, i) => {
			const placeholder = placeholders[i]; // eslint-disable-line security/detect-object-injection
			if (placeholder) {
				const paramNum = parseInt(placeholder.replace('$', ''), 10);
				if (!isNaN(paramNum)) {
					map.set(paramNum, column);
				}
			}
		});
		return map;
	}

	// Generic col = $N pattern — covers UPDATE SET and WHERE clauses
	const colMatches = query.matchAll(SQL_COL_PARAM_REGEX);
	for (const match of colMatches) {
		map.set(parseInt(match[2], 10), match[1]);
	}

	return map;
};
