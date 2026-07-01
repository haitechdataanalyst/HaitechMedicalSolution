import Joi from 'joi';

// Maximum flat discount value in paise: ₹1,00,000 = 10 million paise.
// Percentage discounts are capped at 100 by Joi's max(100) below.
const MAX_FLAT_VALUE_PAISE = 10_000_000;

// Maximum total order amount validated against a coupon (in paise).
// Prevents accidental integer overflow on extremely large cart totals.
const MAX_ORDER_TOTAL_PAISE = 100_000_000;

export const validateCouponSchema = {
	body: Joi.object().keys({
		code: Joi.string().trim().uppercase().min(1).max(50).required(),
		// Order total in paise; must be a non-negative integer.
		orderTotal: Joi.number().integer().min(0).max(MAX_ORDER_TOTAL_PAISE).required(),
	}),
};

export const createCouponSchema = {
	body: Joi.object()
		.keys({
			code: Joi.string().trim().uppercase().min(1).max(50).required(),
			// 'percent' discounts are bounded 0–100.
			// 'flat' discounts are monetary amounts in paise — can exceed 100.
			type: Joi.string().valid('percent', 'flat').default('percent'),
			value: Joi.number()
				.min(1)
				.when('type', {
					is: 'percent',
					then: Joi.number().max(100).messages({
						'number.max': '"value" must be at most 100 for percentage coupons',
					}),
					otherwise: Joi.number().max(MAX_FLAT_VALUE_PAISE).messages({
						'number.max': `"value" must be at most ${MAX_FLAT_VALUE_PAISE} paise for flat coupons`,
					}),
				})
				.required(),
			// Minimum order amount in paise before coupon applies.
			minOrderAmount: Joi.number().integer().min(0).max(MAX_ORDER_TOTAL_PAISE).default(0),
			maxUses: Joi.number().integer().min(1).allow(null).optional(),
			perUserLimit: Joi.number().integer().min(1).max(100).default(1),
			validFrom: Joi.date().iso().optional(),
			// validUntil must be after validFrom when both are supplied.
			validUntil: Joi.date()
				.iso()
				.when('validFrom', {
					is: Joi.date().required(),
					then: Joi.date().greater(Joi.ref('validFrom')).messages({
						'date.greater': '"validUntil" must be after "validFrom"',
					}),
				})
				.optional(),
		}),
};

export const updateCouponSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object()
		.keys({
			code: Joi.string().trim().uppercase().min(1).max(50),
			type: Joi.string().valid('percent', 'flat'),
			value: Joi.number().min(1),
			minOrderAmount: Joi.number().integer().min(0).max(MAX_ORDER_TOTAL_PAISE),
			maxUses: Joi.number().integer().min(1).allow(null),
			perUserLimit: Joi.number().integer().min(1).max(100),
			validFrom: Joi.date().iso(),
			validUntil: Joi.date().iso(),
		})
		.min(1),
};

export const couponIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};
