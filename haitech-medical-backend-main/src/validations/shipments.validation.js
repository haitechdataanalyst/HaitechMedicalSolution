import Joi from 'joi';

// Indian mobile: 10 digits, first digit 6–9 (same rule as joiInMobile in custom.validation.js).
// Defined inline here so shipments.validation.js has no extra import dependency,
// while staying consistent with the canonical regex in constants.
const IN_MOBILE_REGEX = /^[6-9]\d{9}$/;

// DTDC supports up to 30 kg per consignment.
const MAX_WEIGHT_GRAMS = 30_000;

// Maximum declared value in paise: ₹1,00,00,000 = 10 million.
const MAX_DECLARED_VALUE_PAISE = 100_000_000;

export const createShipmentSchema = {
	params: Joi.object().keys({
		orderId: Joi.string().uuid().required(),
	}),
	body: Joi.object().keys({
		recipientName: Joi.string().trim().min(1).max(150).required(),
		// Phone must be a valid 10-digit Indian mobile number.
		recipientPhone: Joi.string()
			.pattern(IN_MOBILE_REGEX)
			.message('recipientPhone must be a valid 10-digit Indian mobile number (starting with 6–9)')
			.required(),
		recipientAddress: Joi.string().trim().min(1).max(500).required(),
		recipientCity: Joi.string().trim().min(1).max(100).required(),
		recipientState: Joi.string().trim().min(1).max(100).required(),
		// 6-digit Indian pincode; first digit 1–9 (0 is not a valid zone prefix).
		recipientPincode: Joi.string().pattern(/^[1-9]\d{5}$/).message('recipientPincode must be a valid 6-digit Indian postal code').required(),
		// Weight in grams: at least 1 g, at most 30 kg.
		weightGrams: Joi.number().integer().min(1).max(MAX_WEIGHT_GRAMS).default(500),
		// Declared value in paise: must be positive when provided.
		declaredValue: Joi.number().integer().min(1).max(MAX_DECLARED_VALUE_PAISE).optional(),
		productDescription: Joi.string().trim().min(1).max(255).optional(),
	}),
};

export const awbParamSchema = {
	params: Joi.object().keys({
		// AWB numbers are typically 10–20 alphanumeric chars; cap at 100 to
		// absorb DTDC format changes while blocking unbounded strings.
		awbNo: Joi.string().trim().min(1).max(100).required(),
	}),
};

export const orderIdParamSchema = {
	params: Joi.object().keys({
		orderId: Joi.string().uuid().required(),
	}),
};

export const pincodeParamSchema = {
	params: Joi.object().keys({
		// 6-digit Indian pincode; first digit 1–9.
		pincode: Joi.string().pattern(/^[1-9]\d{5}$/).message('pincode must be a valid 6-digit Indian postal code').required(),
	}),
};
