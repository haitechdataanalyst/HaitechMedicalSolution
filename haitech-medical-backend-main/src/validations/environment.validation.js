import Joi from 'joi';
import { environments, API_VERSION_REGEX } from '../constants/index.js';

export const envVarSchema = Joi.object().keys({
	NODE_ENV: Joi.string()
		.valid(...Object.values(environments))
		.required(),
	PORT: Joi.number().default(3000).required(),
	API_VERSION: Joi.string().pattern(API_VERSION_REGEX).default('v1').description('API version prefix in the format v1, v2, etc.'),
	ALLOWED_ORIGINS: Joi.string().required().description('Comma separated list of allowed origins for CORS'),
	JWT_SECRET: Joi.string().min(100).required().description('JWT secret key'),
	JWT_ACCESS_EXPIRY_TIME: Joi.number().default(30).description('Minutes after which access token expires'),
	JWT_REFRESH_EXPIRY_TIME: Joi.number().default(30).description('Days after which refresh token expires'),
	JWT_RESET_PASSWORD_EXPIRY: Joi.number().default(30).description('Minutes after which reset password token expires'),
	JWT_EMAIL_VERIFICATION_EXPIRY: Joi.number().default(30).description('Minutes after which email verification token expires'),

	REDIS_HOST: Joi.string().default('localhost').required(),
	REDIS_PORT: Joi.number().port().default(6379).required(),
	REDIS_PASS: Joi.string().allow('').optional(),
	REDIS_TLS_ENABLED: Joi.boolean().default(false),
	REDIS_CIRCUIT_BREAKER_FAILURE_THRESHOLD: Joi.number().integer().min(1).default(5),
	REDIS_CIRCUIT_BREAKER_COOLDOWN_MS: Joi.number().integer().min(1000).default(30000),
	REDIS_CIRCUIT_BREAKER_TIMEOUT_MS: Joi.number().integer().min(100).default(2500),

	ENABLE_PAYLOAD_LOGGING: Joi.boolean().default(false).description('Enable request/response body logging for debugging (disable in production)'),
	API_KEYS: Joi.string().allow('').optional().description('Comma separated API keys for routes protected by API key middleware'),

	POSTGRES_HOST: Joi.string().default('localhost').required(),
	POSTGRES_PORT: Joi.number().port().default(5432).required(),
	POSTGRES_USER: Joi.string().default('postgres').required(),
	POSTGRES_PASS: Joi.string().allow('').optional(),
	POSTGRES_DB: Joi.string().default('postgres').required(),

	FRONTEND_URL: Joi.string().uri().optional().description('Frontend base URL used in email links'),

	RAZORPAY_KEY_ID: Joi.string().allow('').optional().description('Razorpay Key ID for payment processing'),
	RAZORPAY_KEY_SECRET: Joi.string().allow('').optional().description('Razorpay Key Secret for payment processing'),
	// RAZORPAY_WEBHOOK_SECRET is optional at startup but strongly recommended in
	// production: without it the /payments/webhook endpoint cannot verify Razorpay
	// signatures, leaving it open to forged webhook calls. A cross-field check
	// below emits a production warning when the key pair is set but this is absent.
	RAZORPAY_WEBHOOK_SECRET: Joi.string().allow('').optional().description('Razorpay webhook signature secret — required to verify incoming webhook calls'),

	GOOGLE_CLIENT_ID: Joi.string().allow('').optional().description('Google OAuth client ID for ID token verification'),
	GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional().description('Google OAuth client secret'),

	// DTDC shipping integration (all optional — server starts without them)
	DTDC_PX_API_KEY: Joi.string().allow('').optional(),
	DTDC_CUSTOMER_CODE: Joi.string().allow('').optional(),
	DTDC_SERVICE_TYPE: Joi.string().allow('').optional(),
	DTDC_PX_BASE_URL: Joi.string().allow('').optional(),
	DTDC_LABEL_BASE_URL: Joi.string().allow('').optional(),
	DTDC_TRACKING_BASE_URL: Joi.string().allow('').optional(),
	DTDC_TRACKING_USERNAME: Joi.string().allow('').optional(),
	DTDC_TRACKING_PASSWORD: Joi.string().allow('').optional(),
	DTDC_PINCODE_URL: Joi.string().allow('').optional(),
	DTDC_PINCODE_BEARER: Joi.string().allow('').optional(),
	DTDC_ORIGIN_PINCODE: Joi.string().allow('').optional(),
	DTDC_ORIGIN_NAME: Joi.string().allow('').optional(),
	DTDC_ORIGIN_PHONE: Joi.string().allow('').optional(),
	DTDC_ORIGIN_ADDRESS: Joi.string().allow('').optional(),
	DTDC_ORIGIN_CITY: Joi.string().allow('').optional(),
	DTDC_ORIGIN_STATE: Joi.string().allow('').optional(),

	// SMTP (optional — emails are skipped if not configured)
	SMTP_HOST: Joi.string().allow('').optional(),
	SMTP_PORT: Joi.number().default(587).optional(),
	SMTP_SECURE: Joi.string().allow('').optional(),
	SMTP_USER: Joi.string().allow('').optional(),
	SMTP_PASS: Joi.string().allow('').optional(),
	EMAIL_FROM: Joi.string().allow('').optional(),
});

// ── Human-readable startup validation ────────────────────────────────────────
// Maps raw Joi field paths to developer-friendly descriptions and advice.
const fieldHints = {
	NODE_ENV: `must be one of: ${Object.values(environments).join(', ')}`,
	PORT: 'must be a valid port number (1–65535)',
	API_VERSION: 'must match the format v1, v2, etc.',
	ALLOWED_ORIGINS: 'comma-separated list of allowed CORS origins, e.g. https://app.example.com',
	JWT_SECRET: "must be a random string of at least 100 characters — generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
	JWT_ACCESS_EXPIRY_TIME: 'minutes until access tokens expire (e.g. 15)',
	JWT_REFRESH_EXPIRY_TIME: 'days until refresh tokens expire (e.g. 7)',
	JWT_RESET_PASSWORD_EXPIRY: 'minutes until password-reset tokens expire',
	JWT_EMAIL_VERIFICATION_EXPIRY: 'minutes until email-verification tokens expire',
	API_KEYS: 'comma-separated list of API keys for routes protected by X-Api-Key',
	REDIS_HOST: 'hostname of your Redis server, e.g. localhost or redis.internal',
	REDIS_PORT: 'Redis port, default 6379',
	POSTGRES_HOST: 'hostname of your PostgreSQL server',
	POSTGRES_PORT: 'PostgreSQL port, default 5432',
	POSTGRES_USER: 'PostgreSQL user name',
	POSTGRES_DB: 'PostgreSQL database name to connect to',
};

// Optional keys whose absence should warn rather than crash.
const warnOnlyKeys = new Set(['REDIS_PASS', 'POSTGRES_PASS', 'ENABLE_PAYLOAD_LOGGING', 'REDIS_TLS_ENABLED', 'API_KEYS']);

/**
 * Validates process.env against envVarSchema.
 * Throws a clear, multi-line error for missing/invalid required variables.
 * Emits console.warn entries for non-critical omissions.
 * Performs cross-field sanity checks after schema validation passes.
 *
 * @param {NodeJS.ProcessEnv} env - the raw environment object to validate
 * @returns {object} the validated+coerced config values
 */
export const validateEnv = (env) => {
	const { value, error } = envVarSchema.prefs({ errors: { label: 'key' } }).validate(env, { allowUnknown: true, abortEarly: false });

	// Separate hard errors from soft warnings.
	const hardErrors = [];
	const softWarnings = [];

	if (error) {
		for (const detail of error.details) {
			const key = detail.context?.key ?? detail.path.join('.');
			const hint = fieldHints[key] ?? detail.message; // eslint-disable-line security/detect-object-injection
			const line = `  • ${key}: ${hint}`;

			if (warnOnlyKeys.has(key)) {
				softWarnings.push(line);
			} else {
				hardErrors.push(line);
			}
		}
	}

	// Emit actionable warnings for non-critical keys (does not crash).
	if (softWarnings.length) {
		// eslint-disable-next-line no-console
		console.warn('\n⚠️  Environment warnings (non-critical):\n' + softWarnings.join('\n') + '\n');
	}

	// Crash with a clear diagnostic if required keys are wrong.
	if (hardErrors.length) {
		throw new Error(
			'\n\n❌  Invalid environment configuration — fix the following before starting the server:\n\n' +
				hardErrors.join('\n') +
				'\n\nSee .env.example for the full list of required variables.\n'
		);
	}

	// ── Cross-field validations ───────────────────────────────────────────────

	// Access tokens must expire sooner than refresh tokens.
	// A refresh token that expires before the access token defeats the purpose
	// of the refresh-token rotation pattern entirely.
	const accessMinutes = value.JWT_ACCESS_EXPIRY_TIME;
	const refreshDaysAsMinutes = value.JWT_REFRESH_EXPIRY_TIME * 24 * 60;
	if (accessMinutes >= refreshDaysAsMinutes) {
		throw new Error(
			`\n\n❌  JWT_ACCESS_EXPIRY_TIME (${accessMinutes} min) must be less than JWT_REFRESH_EXPIRY_TIME ` +
				`(${value.JWT_REFRESH_EXPIRY_TIME} days = ${refreshDaysAsMinutes} min).\n`
		);
	}

	// Each entry in ALLOWED_ORIGINS must be a valid fully-qualified URL.
	if (value.ALLOWED_ORIGINS) {
		const origins = value.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
		const invalid = origins.filter((o) => {
			try {
				new URL(o);
				return false;
			} catch {
				return true;
			}
		});
		if (invalid.length) {
			throw new Error(
				`\n\n❌  ALLOWED_ORIGINS contains invalid URLs: ${invalid.join(', ')}\n` +
					'    Each origin must be a fully-qualified URL, e.g. https://app.example.com\n'
			);
		}
	}

	// Warn when payload logging is left on in production — it logs request bodies
	// which may contain passwords or PII.
	if (value.NODE_ENV === environments.PROD && value.ENABLE_PAYLOAD_LOGGING) {
		// eslint-disable-next-line no-console
		console.warn(
			'\n⚠️  ENABLE_PAYLOAD_LOGGING is true in production — request bodies (incl. passwords) will be logged. Disable unless actively debugging.\n'
		);
	}

	// Warn in production when Razorpay is configured but the webhook secret is
	// missing. Without RAZORPAY_WEBHOOK_SECRET the /payments/webhook endpoint
	// cannot verify Razorpay HMAC signatures, allowing any caller to forge
	// payment-success events and bypass the payment flow.
	const razorpayKeyId = value.RAZORPAY_KEY_ID;
	const razorpayKeySecret = value.RAZORPAY_KEY_SECRET;
	const razorpayWebhookSecret = value.RAZORPAY_WEBHOOK_SECRET;

	if (razorpayKeyId && razorpayKeySecret && !razorpayWebhookSecret) {
		// eslint-disable-next-line no-console
		console.warn(
			'\n⚠️  RAZORPAY_WEBHOOK_SECRET is not set.\n' +
				'    Razorpay HMAC signature verification for webhook calls will be skipped.\n' +
				'    Set RAZORPAY_WEBHOOK_SECRET to the secret configured in the Razorpay dashboard.\n'
		);
	}

	// Warn in production when DTDC shipping is partially configured — a missing
	// API key or customer code means shipment creation will silently fail at
	// runtime rather than at startup.
	if (value.NODE_ENV === environments.PROD) {
		const dtdcKeyFields = ['DTDC_PX_API_KEY', 'DTDC_CUSTOMER_CODE'];
		const dtdcMissing = dtdcKeyFields.filter((k) => !value[k]); // eslint-disable-line security/detect-object-injection
		if (dtdcMissing.length && dtdcMissing.length < dtdcKeyFields.length) {
			// Some DTDC keys are set but not all — likely a partial configuration.
			// eslint-disable-next-line no-console
			console.warn(`\n⚠️  DTDC shipping is partially configured — missing: ${dtdcMissing.join(', ')}. Shipment creation will fail at runtime.\n`);
		}
	}

	return value;
};
