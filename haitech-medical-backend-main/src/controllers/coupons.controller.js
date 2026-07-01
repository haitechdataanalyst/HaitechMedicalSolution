import { httpStatus } from '../constants/index.js';
import { couponService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const validateCoupon = catchAsync(async (req, res) => {
	const { code, orderTotal } = req.body;
	const userId = req.user?.id || null;
	const result = await couponService.validateCoupon(code, userId, Number(orderTotal));
	return res.respond(httpStatus.OK, result, 'Coupon valid');
});

export const listCoupons = catchAsync(async (req, res) => {
	const { page = 1, limit = 20 } = req.query;
	const result = await couponService.listCoupons({ page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, result);
});

export const createCoupon = catchAsync(async (req, res) => {
	const coupon = await couponService.createCoupon(req.body);
	return res.respond(httpStatus.CREATED, { coupon }, 'Coupon created');
});

export const updateCoupon = catchAsync(async (req, res) => {
	const coupon = await couponService.updateCoupon(req.params.id, req.body);
	return res.respond(httpStatus.OK, { coupon }, 'Coupon updated');
});

export const deleteCoupon = catchAsync(async (req, res) => {
	await couponService.deleteCoupon(req.params.id);
	return res.respond(httpStatus.NO_CONTENT, null);
});
