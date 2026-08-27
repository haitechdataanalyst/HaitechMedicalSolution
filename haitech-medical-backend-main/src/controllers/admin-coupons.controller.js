// FILE: haitech-medical-backend-main/src/controllers/admin-coupons.controller.js
// Split out of the former admin.controller.js God file. Thin HTTP layer only.
import { httpStatus } from '../constants/index.js';
import { couponService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const adminListCoupons = catchAsync(async (req, res) => {
	const { page = 1, limit = 20 } = req.query;
	const result = await couponService.adminListCoupons({ page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, { coupons: result.coupons }, undefined, result.meta);
});

export const adminCreateCoupon = catchAsync(async (req, res) => {
	const coupon = await couponService.adminCreateCoupon(req.body);
	return res.respond(httpStatus.CREATED, { coupon }, 'Coupon created');
});

export const adminUpdateCoupon = catchAsync(async (req, res) => {
	const coupon = await couponService.adminUpdateCoupon(req.params.id, req.body);
	return res.respond(httpStatus.OK, { coupon }, 'Coupon updated');
});

export const adminDeleteCoupon = catchAsync(async (req, res) => {
	await couponService.adminDeleteCoupon(req.params.id);
	return res.respond(httpStatus.OK, null, 'Coupon deactivated');
});
