import Joi from 'joi';
import { ALPHABETIC_SPACE_REGEX, IN_MOBILE_NUMBER_REGEX, IN_PIN_CODE_REGEX, PASSWORD_SPECIAL_CHARS_REGEX } from '../constants/index.js';

// ── Password ──────────────────────────────────────────────────────────────────
// Granular checks intentionally kept separate so each error message tells the
// user exactly which requirement they are missing — much better UX than a
// single "invalid password" from PASSWORD_REGEX.test().
// The special-char set is imported from constants so it stays in sync with
// PASSWORD_REGEX and PASSWORD_SPECIAL_CHARS_REGEX defined there.
export const password = (value, helpers) => {
	if (value.length < 8) {
		return helpers.message('password must be at least 8 characters');
	}
	if (!/[a-z]/.test(value)) {
		return helpers.message('password must contain at least 1 lowercase letter');
	}
	if (!/[A-Z]/.test(value)) {
		return helpers.message('password must contain at least 1 uppercase letter');
	}
	if (!/\d/.test(value)) {
		return helpers.message('password must contain at least 1 number');
	}
	if (!PASSWORD_SPECIAL_CHARS_REGEX.test(value)) {
		return helpers.message('password must contain at least 1 special character (@$!%*?&#^()_+-=)');
	}
	return value;
};

// ── Generic character validators ──────────────────────────────────────────────
export const characters = (value, helpers) => {
	if (!value.match(ALPHABETIC_SPACE_REGEX)) {
		return helpers.message('Only characters are allowed');
	}
	return value;
};

// ── India (IN) locale validators ──────────────────────────────────────────────
// Validates a 10-digit Indian mobile number (first digit must be 6–9).
export const indianMobileNumber = (value, helpers) => {
	if (!IN_MOBILE_NUMBER_REGEX.test(value)) {
		return helpers.message('Mobile number must be a valid 10-digit Indian mobile number (starting with 6–9)');
	}
	return value;
};

// Validates a 6-digit Indian PIN code (postal index; first digit must be 1–9).
export const indianPinCode = (value, helpers) => {
	if (!IN_PIN_CODE_REGEX.test(value)) {
		return helpers.message('PIN code must be a valid 6-digit Indian postal code');
	}
	return value;
};

// ── Reusable Joi schema fragments (IN locale) ─────────────────────────────────
// Import these in your Joi object definitions instead of repeating the custom
// validator and string constraints each time:
//   body: Joi.object({ mobile: joiInMobile.required(), pin: joiInPinCode.required() })
export const joiInMobile = Joi.string().custom(indianMobileNumber);
export const joiInPinCode = Joi.string().custom(indianPinCode);
