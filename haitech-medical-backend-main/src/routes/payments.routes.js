import express, { Router } from 'express';
import { createPaymentOrder, verifyPayment, handleWebhook } from '../controllers/index.js';
import { validate, auth, jsonBody, overallLimiter, paymentLimiter, webhookLimiter } from '../middlewares/index.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../validations/payments.validation.js';

const paymentsRouter = Router();

// Webhook uses raw body for signature verification — no auth middleware, dedicated rate limit
paymentsRouter.post('/webhooks/razorpay', webhookLimiter, express.raw({ type: 'application/json' }), handleWebhook);

paymentsRouter.use(overallLimiter, paymentLimiter, auth());

paymentsRouter.post('/orders/:orderId', validate(createPaymentOrderSchema), createPaymentOrder);
paymentsRouter.post('/verify', jsonBody('10kb'), validate(verifyPaymentSchema), verifyPayment);

export default paymentsRouter;
