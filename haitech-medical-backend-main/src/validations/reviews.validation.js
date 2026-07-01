import Joi from 'joi';

// Product IDs are catalogue string keys, not necessarily UUIDs.
// Bound length to prevent payload inflation.
const MAX_PRODUCT_ID_LEN = 100;

export const createReviewSchema = {
	body: Joi.object().keys({
		productId: Joi.string().trim().min(1).max(MAX_PRODUCT_ID_LEN).required(),
		orderId: Joi.string().uuid().allow(null, '').optional(),
		rating: Joi.number().integer().min(1).max(5).required(),
		title: Joi.string().trim().min(1).max(200).allow('', null).optional(),
		body: Joi.string().trim().min(1).max(2000).allow('', null).optional(),
	}),
};

export const reviewIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};

export const productReviewsSchema = {
	params: Joi.object().keys({
		productId: Joi.string().trim().min(1).max(MAX_PRODUCT_ID_LEN).required(),
	}),
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		// Cap at 100 to prevent full-table scans; consistent with order/admin schemas.
		limit: Joi.number().integer().min(1).max(100).default(10),
	}),
};

export const approveReviewSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object().keys({
		approved: Joi.boolean().required(),
	}),
};
