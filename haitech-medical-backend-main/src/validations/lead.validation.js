import Joi from 'joi';

const cartItemSchema = Joi.object().keys({
	productName: Joi.string().trim().min(1).max(255).required(),
	sku: Joi.string().trim().max(100).allow('', null).optional(),
	quantity: Joi.number().integer().min(1).max(999).required(),
	unitPrice: Joi.number().integer().min(0).optional(),
	customization: Joi.string().max(2000).allow('', null).optional(),
});

export const createLeadSchema = {
	body: Joi.object().keys({
		source: Joi.string().valid('contact_form', 'product_quote', 'cart_quote').required(),
		name: Joi.string().trim().min(2).max(100).required(),
		email: Joi.string().trim().email().max(255).required(),
		phone: Joi.string().trim().min(6).max(20).required(),
		state: Joi.string().trim().max(100).allow('', null).optional(),
		postcode: Joi.string().trim().max(15).allow('', null).optional(),
		// Required for contact_form/product_quote, but cart_quote (quote.ts)
		// never collects a country field at all — nullable to match.
		country: Joi.string().trim().length(2).uppercase().allow(null).optional(),
		subject: Joi.string().trim().min(3).max(200).required(),
		// Required for contact_form/product_quote; cart_quote's message is
		// optional (the cart items themselves carry the request) — nullable
		// to match the DB column.
		message: Joi.string().trim().max(5000).allow('', null).optional(),
		productId: Joi.number().integer().positive().allow(null).optional(),
		productName: Joi.string().trim().max(200).allow('', null).optional(),
		productSku: Joi.string().trim().max(100).allow('', null).optional(),
		selectedVariant: Joi.string().trim().max(200).allow('', null).optional(),
		// ipAddress is deliberately NOT accepted here — it's derived server-side
		// from req.ip (see lead.controller.js) so it can't be spoofed via the
		// request body to defeat rate limiting.
		userAgent: Joi.string().max(500).allow('', null).optional(),
		cartItems: Joi.array().items(cartItemSchema).max(100).optional(),
	}),
};

export const markEmailSentSchema = {
	params: Joi.object().keys({
		id: Joi.string().uuid().required(),
	}),
};
