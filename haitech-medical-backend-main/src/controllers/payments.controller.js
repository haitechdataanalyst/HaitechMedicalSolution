import { httpStatus } from '../constants/index.js';
import { paymentService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const createPaymentOrder = catchAsync(async (req, res) => {
	const data = await paymentService.createPaymentOrder(req.params.orderId, req.user.id);
	return res.respond(httpStatus.CREATED, data, 'Payment order created');
});

export const verifyPayment = catchAsync(async (req, res) => {
	const order = await paymentService.verifyPayment(req.body, req.user.id);
	return res.respond(httpStatus.OK, { order }, 'Payment verified successfully');
});

export const handleWebhook = catchAsync(async (req, res) => {
	const signature = req.headers['x-razorpay-signature'] ?? '';
	// req.body is a Buffer when using express.raw()
	const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf-8') : JSON.stringify(req.body);
	await paymentService.handleWebhookPayment(rawBody, signature);
	return res.respond(httpStatus.OK, null, 'Webhook received');
});
