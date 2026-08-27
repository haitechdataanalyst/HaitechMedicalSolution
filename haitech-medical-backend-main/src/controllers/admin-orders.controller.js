// FILE: haitech-medical-backend-main/src/controllers/admin-orders.controller.js
//
// Split out of the former admin.controller.js God file. Thin HTTP layer only
// — reuses order.service.js / order.repository.js (the same layer the
// customer-facing orders domain uses) instead of duplicating query logic.
import { httpStatus } from '../constants/index.js';
import { orderService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminGetAllOrders = catchAsync(async (req, res) => {
	const { page = 1, limit = 20, status, userId, dateFrom, dateTo } = req.query;
	const result = await orderService.adminGetOrders({
		page: Number(page),
		limit: Number(limit),
		status: status || undefined,
		userId: userId || undefined,
		dateFrom: dateFrom || undefined,
		dateTo: dateTo || undefined,
	});
	return res.respond(httpStatus.OK, { orders: result.orders }, undefined, result.meta);
});

export const adminGetOrderDetail = catchAsync(async (req, res) => {
	const order = await orderService.adminGetOrderDetail(req.params.id);
	return res.respond(httpStatus.OK, { order });
});

// Same underlying implementation as orders.controller.js's
// adminUpdateOrderStatus (PUT /orders/admin/:id/status) — both routes call
// orderService.adminUpdateOrderStatus so the transition validation and the
// order_status_history write happen in exactly one place.
export const adminUpdateOrder = catchAsync(async (req, res) => {
	const { status, reason } = req.body;
	const order = await orderService.adminUpdateOrderStatus(req.user.id, req.params.id, status, reason);
	return res.respond(httpStatus.OK, { order }, 'Order status updated');
});
