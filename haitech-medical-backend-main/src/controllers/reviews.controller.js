import { httpStatus } from '../constants/index.js';
import { reviewService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const createReview = catchAsync(async (req, res) => {
	const review = await reviewService.createReview(req.user.id, req.body);
	return res.respond(httpStatus.CREATED, { review }, 'Review submitted — pending approval');
});

export const getProductReviews = catchAsync(async (req, res) => {
	const { productId } = req.params;
	const { page = 1, limit = 10 } = req.query;
	const result = await reviewService.getProductReviews(productId, { page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, result);
});

export const getPendingReviews = catchAsync(async (req, res) => {
	const { page = 1, limit = 20 } = req.query;
	const result = await reviewService.getPendingReviews({ page: Number(page), limit: Number(limit) });
	return res.respond(httpStatus.OK, result);
});

export const approveReview = catchAsync(async (req, res) => {
	const review = await reviewService.approveReview(req.params.id, req.body.approved !== false);
	return res.respond(httpStatus.OK, { review }, 'Review updated');
});

export const deleteReview = catchAsync(async (req, res) => {
	const isAdmin = req.user?.roles?.includes('admin') || req.user?.role === 'admin';
	await reviewService.deleteReview(req.user.id, req.params.id, isAdmin);
	return res.respond(httpStatus.NO_CONTENT, null, 'Review deleted');
});
