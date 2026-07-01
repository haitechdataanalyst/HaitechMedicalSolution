// ── Generic character sets ────────────────────────────────────────────────────
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const ALPHANUMERIC_SPACE_REGEX = /^[a-zA-Z0-9 ]+$/;
export const ALPHABETIC_REGEX = /^[a-zA-Z]+$/;
export const ALPHABETIC_SPACE_REGEX = /^[a-zA-Z\s]+$/;
export const NUMERIC_REGEX = /^[0-9]+$/;
export const NON_DIGIT_REGEX = /\D/g;

// ── India (IN) locale ─────────────────────────────────────────────────────────
// Mobile: 10 digits, first digit must be 6–9 (valid Indian mobile prefixes)
export const IN_MOBILE_NUMBER_REGEX = /^[6-9]\d{9}$/;
// PIN code: 6 digits, first digit 1–9 (India postal index — 0XXXXX is invalid)
export const IN_PIN_CODE_REGEX = /^[1-9]\d{5}$/;
// Strip country-code prefix (+91 / 91) and separators before normalising
export const IN_PHONE_PREFIX_REGEX = /^(?:\+91|91)[\s-]*/;

// ── Email / URL / identifiers ─────────────────────────────────────────────────
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Intentionally conservative: validates scheme + host + optional path without nested quantifiers
// to avoid ReDoS. Does not cover every valid RFC 3986 URL edge-case by design.
export const URL_REGEX = /^https?:\/\/[\w-]+(\.[\w-]+)+(:\d{1,5})?(\/[\w\-.~:@!$&'()*+,;=%?#]*)?$/;
export const HEXADECIMAL_REGEX = /^[0-9a-fA-F]+$/;
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Idempotency-Key: alphanumeric + hyphens/underscores, max 128 chars
export const IDEMPOTENCY_KEY_REGEX = /^[\w-]{1,128}$/;
// API version string e.g. v1, v2
export const API_VERSION_REGEX = /^v\d+$/;

// ── Password ──────────────────────────────────────────────────────────────────
// Accepted special characters — kept in ONE place so regex.js and
// custom.validation.js always stay in sync.
export const PASSWORD_SPECIAL_CHARS_REGEX = /[@$!%*?&#^()_+\-=]/;
// Full password policy: 8+ chars, at least one lower, upper, digit, and
// one of the special chars defined in PASSWORD_SPECIAL_CHARS_REGEX above.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/;

// ── Case conversion (used by formatters/case.js) ──────────────────────────────
export const CAMEL_TO_SNAKE_REGEX = /[A-Z]/g;
export const SNAKE_TO_CAMEL_REGEX = /_([a-z])/g;

// ── Misc formatting helpers ───────────────────────────────────────────────────
// Matches literal double-quote characters (used to strip Joi field-name quotes)
export const DOUBLE_QUOTE_REGEX = /"/g;
// Token expiry shorthand: "15m", "7d", "1h", "30s", "2w"
export const TOKEN_EXPIRY_FORMAT_REGEX = /^(\d+)([smhdw])$/;

// ── Sanitizer / logging ───────────────────────────────────────────────────────
export const SENSITIVE_FIELDS_REGEX =
	/password|passwd|token|secret|authorization|api_?key|credit.?card|card.?number|cvv|cvc|card_?cvv|ssn|pin.?code|otp|account.?number|routing.?number|iban|bic|sort.?code|ifsc/i;
export const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d+\$/;
export const JWT_TOKEN_REGEX = /^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\./;

// ── SQL pattern helpers (used by query-logger sanitizer) ──────────────────────
// Matches: INSERT INTO table (col1, col2) VALUES ($1, $2)
export const SQL_INSERT_PATTERN_REGEX = /INSERT\s+INTO\s+\S+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i;
// Matches col = $N assignments in UPDATE/WHERE clauses
// Note: 'g' flag is intentional — used exclusively with String.matchAll() which
// clones the regex internally, so sharing as a module-level constant is safe.
export const SQL_COL_PARAM_REGEX = /(\w+)\s*=\s*\$(\d+)/gi;
