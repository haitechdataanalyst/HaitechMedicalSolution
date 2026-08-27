import Joi from 'joi';

// Must match every state in order.service.js's VALID_TRANSITIONS — 'returned'
// was previously missing here even though STATUSES_REQUIRING_REASON already
// referenced it, so the admin status-update endpoint could never legally
// move an order into 'return_requested' or 'returned'.
const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned'];

// Statuses that require a reason to be provided by the admin.
const STATUSES_REQUIRING_REASON = ['cancelled', 'returned'];

const RETURN_STATUSES = ['approved', 'rejected', 'completed'];

// Maximum number of distinct line-items allowed in a single order.
// Prevents unbounded array payloads and mirrors typical B2B catalogue limits.
const MAX_ORDER_ITEMS = 50;

// Maximum quantity of a single SKU per line-item.
// Prevents accidental or malicious quantity inflation.
const MAX_ITEM_QUANTITY = 9999;

// Maximum length for free-text product name / brand / SKU fields.
const MAX_SKU_LEN = 100;

export const createOrderSchema = {
	body: Joi.object()
		.keys({
			items: Joi.array()
				.items(
					Joi.object()
						.keys({
							// productId is a catalogue string key (not necessarily a UUID).
							// Bound its length to prevent giant payload injections.
							productId: Joi.string().trim().min(1).max(MAX_SKU_LEN).required(),
							// Quantity must be a positive integer with a reasonable upper cap.
							quantity: Joi.number().integer().min(1).max(MAX_ITEM_QUANTITY).required(),
						})
						.options({ stripUnknown: true })
				)
				.min(1)
				.max(MAX_ORDER_ITEMS)
				.required(),
			shippingAddressId: Joi.string().uuid().allow(null),
			notes: Joi.string().trim().min(1).max(500).allow('', null),
		})
		.options({ stripUnknown: true }),
};

export const orderIdSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};

export const orderListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		// Cap at 100 to prevent full-table fetches; consistent with admin schema.
		limit: Joi.number().integer().min(1).max(100).default(10),
	}),
};

export const adminOrderListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(20),
		status: Joi.string()
			.valid(...ORDER_STATUSES)
			.allow(null, ''),
		// adminGetAllOrders also filters by these — previously unvalidated,
		// so a malformed dateFrom/dateTo silently produced an empty/wrong
		// result set instead of a clear 400.
		userId: Joi.string().uuid().allow(null, ''),
		dateFrom: Joi.date().iso().allow(null, ''),
		dateTo: Joi.date().iso().allow(null, ''),
	}),
};

export const adminUpdateStatusSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object()
		.keys({
			status: Joi.string().valid(...ORDER_STATUSES).required(),
			// reason is required when status is 'cancelled' or 'returned'.
			reason: Joi.string().trim().max(500).allow('', null),
		})
		.when(
			Joi.object({ status: Joi.valid(...STATUSES_REQUIRING_REASON) }).unknown(),
			{
				then: Joi.object({
					reason: Joi.string().trim().min(1).max(500).required(),
				}),
			}
		),
};

export const returnRequestSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
	body: Joi.object().keys({
		reason: Joi.string().trim().min(1).max(100).required(),
		description: Joi.string().trim().max(1000).allow('', null),
	}),
};

export const adminReturnSchema = {
	params: Joi.object().keys({
		returnId: Joi.string().uuid().required(),
	}),
	body: Joi.object().keys({
		status: Joi.string().valid(...RETURN_STATUSES).required(),
		adminNotes: Joi.string().trim().max(1000).allow('', null),
		refundAmount: Joi.number().integer().min(0).allow(null),
	}),
};

export const returnListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(10),
	}),
};

export const adminReturnListSchema = {
	query: Joi.object().keys({
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).max(100).default(20),
		status: Joi.string().valid(...RETURN_STATUSES).allow(null, ''),
	}),
};
