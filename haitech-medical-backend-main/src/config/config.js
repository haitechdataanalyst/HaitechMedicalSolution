import { validateEnv } from '../validations/index.js';

const value = validateEnv(process.env);

const config = {
	ENV: value.NODE_ENV,
	PORT: value.PORT,
	API_VERSION: value.API_VERSION,
	ENABLE_PAYLOAD_LOGGING: value.ENABLE_PAYLOAD_LOGGING,
	ORIGINS: value.ALLOWED_ORIGINS ? value.ALLOWED_ORIGINS.split(',') : [],
	API_KEYS: value.API_KEYS
		? value.API_KEYS.split(',')
				.map((key) => key.trim())
				.filter(Boolean)
		: [],
	JWT: {
		SECRET: value.JWT_SECRET,
		ACCESS_EXPIRY_TIME: value.JWT_ACCESS_EXPIRY_TIME,
		REFRESH_EXPIRY_TIME: value.JWT_REFRESH_EXPIRY_TIME,
		RESET_PASSWORD_EXPIRY: value.JWT_RESET_PASSWORD_EXPIRY,
		EMAIL_VERIFICATION_EXPIRY: value.JWT_EMAIL_VERIFICATION_EXPIRY,
	},
	REDIS: {
		HOST: value.REDIS_HOST,
		PORT: value.REDIS_PORT,
		PASS: value.REDIS_PASS,
		TLS: value.REDIS_TLS_ENABLED,
		CIRCUIT_BREAKER: {
			FAILURE_THRESHOLD: value.REDIS_CIRCUIT_BREAKER_FAILURE_THRESHOLD,
			COOLDOWN_MS: value.REDIS_CIRCUIT_BREAKER_COOLDOWN_MS,
			TIMEOUT_MS: value.REDIS_CIRCUIT_BREAKER_TIMEOUT_MS,
		},
	},
	POSTGRES: {
		HOST: value.POSTGRES_HOST,
		PORT: value.POSTGRES_PORT,
		USER: value.POSTGRES_USER,
		PASS: value.POSTGRES_PASS,
		DB: value.POSTGRES_DB,
		SSL: value.POSTGRES_SSL,
	},
	FRONTEND_URL: value.FRONTEND_URL || 'http://localhost:3000',
	RAZORPAY: {
		KEY_ID: value.RAZORPAY_KEY_ID || null,
		KEY_SECRET: value.RAZORPAY_KEY_SECRET || null,
		WEBHOOK_SECRET: value.RAZORPAY_WEBHOOK_SECRET || null,
	},
	GOOGLE: {
		CLIENT_ID: value.GOOGLE_CLIENT_ID || null,
	},
	SUPABASE: {
		URL: value.SUPABASE_URL || null,
		ANON_KEY: value.SUPABASE_ANON_KEY || null,
	},
	SMTP: {
		HOST: value.SMTP_HOST || null,
		PORT: Number(value.SMTP_PORT) || 587,
		SECURE: value.SMTP_SECURE === 'true',
		USER: value.SMTP_USER || null,
		PASS: value.SMTP_PASS || null,
		FROM: value.EMAIL_FROM || '"Haitech Medical" <no-reply@haitechmedical.com.au>',
	},
	ZOHO: {
		CLIENT_ID: value.ZOHO_CLIENT_ID || null,
		CLIENT_SECRET: value.ZOHO_CLIENT_SECRET || null,
		REFRESH_TOKEN: value.ZOHO_REFRESH_TOKEN || null,
		ORG_ID: value.ZOHO_ORG_ID || null,
		API_BASE: value.ZOHO_API_BASE || 'https://www.zohoapis.com/inventory/v1',
		ACCOUNTS_URL: value.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com',
	},
	DTDC: {
		PX_API_KEY: value.DTDC_PX_API_KEY || null,
		CUSTOMER_CODE: value.DTDC_CUSTOMER_CODE || null,
		// Staging: https://demodashboardapi.shipsy.in | Production: https://pxapi.dtdc.in
		PX_BASE_URL: value.DTDC_PX_BASE_URL || 'https://demodashboardapi.shipsy.in',
		// Label & Cancel staging uses a different subdomain
		LABEL_BASE_URL: value.DTDC_LABEL_BASE_URL || 'https://alphademodashboardapi.shipsy.io',
		// Tracking: Staging: https://dtdcstagingapi.dtdc.com | Prod: https://blktracksvc.dtdc.com
		TRACKING_USERNAME: value.DTDC_TRACKING_USERNAME || null,
		TRACKING_PASSWORD: value.DTDC_TRACKING_PASSWORD || null,
		TRACKING_BASE_URL: value.DTDC_TRACKING_BASE_URL || 'https://dtdcstagingapi.dtdc.com',
		// Pincode: https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall
		PINCODE_BEARER: value.DTDC_PINCODE_BEARER || null,
		PINCODE_URL: value.DTDC_PINCODE_URL || 'https://smarttrack-ctbsplus.dtdc.com/ratecalapi/PincodeApiCall',
		// Shipper origin details
		ORIGIN_PINCODE: value.DTDC_ORIGIN_PINCODE || '110001',
		ORIGIN_NAME: value.DTDC_ORIGIN_NAME || 'Haitech Medical',
		ORIGIN_PHONE: value.DTDC_ORIGIN_PHONE || '9999999999',
		ORIGIN_ADDRESS: value.DTDC_ORIGIN_ADDRESS || 'Haitech Medical Warehouse',
		ORIGIN_CITY: value.DTDC_ORIGIN_CITY || 'Delhi',
		ORIGIN_STATE: value.DTDC_ORIGIN_STATE || 'Delhi',
		SERVICE_TYPE: value.DTDC_SERVICE_TYPE || 'B2C SMART EXPRESS',
	},
};

export default config;
