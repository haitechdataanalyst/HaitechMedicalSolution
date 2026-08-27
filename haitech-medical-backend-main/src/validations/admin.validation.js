import Joi from 'joi';

const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LEN = 200;
// Order/coupon amounts are stored as integer paise elsewhere in this codebase
// (see coupons.validation.js) — mirrored here for the refund amount bound.
const MAX_AMOUNT_PAISE = 100_000_000;

export const adminUserListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		search: Joi.string().trim().max(MAX_SEARCH_LEN).allow('', null),
	}),
};

export const adminUserIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};

export const adminInventoryListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		search: Joi.string().trim().max(MAX_SEARCH_LEN).allow('', null),
	}),
};

export const adminUpdateInventorySchema = {
	params: Joi.object().keys({
		productId: Joi.number().integer().positive().required(),
	}),
	body: Joi.object()
		.keys({
			quantity: Joi.number().integer().min(0),
			reservedQuantity: Joi.number().integer().min(0),
		})
		.or('quantity', 'reservedQuantity'),
};

export const adminPaymentTransactionsSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(MAX_PAGE_SIZE).default(20),
		orderId: Joi.string().uuid().allow(null, ''),
		userId: Joi.string().uuid().allow(null, ''),
	}),
};

export const adminOrderIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};

export const adminRefundSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object().keys({
		amount: Joi.number().integer().min(1).max(MAX_AMOUNT_PAISE).optional(),
		reason: Joi.string().trim().max(500).allow('', null),
	}),
};
