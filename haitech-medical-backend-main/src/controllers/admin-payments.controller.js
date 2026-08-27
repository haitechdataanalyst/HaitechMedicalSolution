// FILE: haitech-medical-backend-main/src/controllers/admin-payments.controller.js
// Split out of the former admin.controller.js God file. Thin HTTP layer only.
import { httpStatus } from '../constants/index.js';
import { paymentService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminGetPaymentTransactions = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, orderId, userId } = req.query;
	const result = await paymentService.adminListTransactions({
		page: Number(page),
		limit: Number(limit),
		orderId,
		userId,
	});
	return res.respond(httpStatus.OK, { transactions: result.transactions }, undefined, result.meta);
});

export const adminInitiateRefund = catchAsync(async (req, res) => {
	const orderId = req.params.id;
	const { amount } = req.body;
	const refund = await paymentService.initiateRefund(orderId, amount ?? undefined);
	return res.respond(httpStatus.OK, { refund }, 'Refund initiated successfully');
});
