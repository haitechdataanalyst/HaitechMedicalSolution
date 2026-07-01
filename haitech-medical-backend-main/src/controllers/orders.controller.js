import { httpStatus } from '../constants/index.js';
import { orderService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const createOrder = catchAsync(async (req, res) => {
	const order = await orderService.createOrder(req.user.id, req.body);
	return res.respond(httpStatus.CREATED, { order }, 'Order placed successfully');
});

export const getOrders = catchAsync(async (req, res) => {
	const { page, limit } = req.query;
	const result = await orderService.getUserOrders(req.user.id, { page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, { orders: result.orders }, undefined, result.meta);
});

export const getOrder = catchAsync(async (req, res) => {
	const order = await orderService.getOrderDetail(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { order });
});

export const cancelOrder = catchAsync(async (req, res) => {
	const order = await orderService.cancelOrder(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { order }, 'Order cancelled');
});

export const adminGetOrders = catchAsync(async (req, res) => {
	const { page, limit, status } = req.query;
	const result = await orderService.adminGetOrders({ page: Number(page), limit: Number(limit), status });
	return res.respond(httpStatus.OK, { orders: result.orders }, undefined, result.meta);
});

export const adminUpdateOrderStatus = catchAsync(async (req, res) => {
	const order = await orderService.adminUpdateOrderStatus(req.user.id, req.params.id, req.body.status);
	return res.respond(httpStatus.OK, { order }, 'Order status updated');
});

export const requestReturn = catchAsync(async (req, res) => {
	const order = await orderService.requestReturn(req.user.id, req.params.id, req.body);
	return res.respond(httpStatus.OK, { order }, 'Return request submitted');
});

export const getOrderInvoice = catchAsync(async (req, res) => {
	const invoice = await orderService.getOrderInvoice(req.user.id, req.params.id);
	return res.respond(httpStatus.OK, { invoice });
});
