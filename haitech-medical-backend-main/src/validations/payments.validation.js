import Joi from 'joi';

// Razorpay ID prefixes and max lengths sourced from Razorpay API docs:
//   order_*   — up to 50 chars
//   pay_*     — up to 50 chars
//   signatures — HMAC-SHA256 hex = 64 chars
// We use a generous upper bound (200) to future-proof, but still block
// unbounded strings that could be used for payload inflation / log poisoning.
const MAX_RAZORPAY_ID_LEN = 200;
const MAX_RAZORPAY_SIG_LEN = 512;

export const createPaymentOrderSchema = {
	params: Joi.object().keys({
		orderId: Joi.string().uuid().required(),
	}),
};

export const verifyPaymentSchema = {
	body: Joi.object().keys({
		// Our internal order UUID — verified server-side against the authenticated user.
		orderId: Joi.string().uuid().required(),
		// Razorpay-generated IDs sent back by the frontend after a successful payment.
		razorpayOrderId: Joi.string().trim().min(1).max(MAX_RAZORPAY_ID_LEN).required(),
		razorpayPaymentId: Joi.string().trim().min(1).max(MAX_RAZORPAY_ID_LEN).required(),
		// HMAC-SHA256 hex signature — must be non-empty and bounded.
		razorpaySignature: Joi.string().trim().min(1).max(MAX_RAZORPAY_SIG_LEN).required(),
	}),
};
