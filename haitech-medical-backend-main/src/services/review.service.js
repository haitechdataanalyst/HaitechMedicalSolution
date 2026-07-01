import { reviewRepository } from '../repositories/index.js';
import { notFoundError, conflictError, badRequestError, forbiddenError } from '../utils/index.js';

export const createReview = async (userId, { productId, orderId, rating, title, body }) => {
	const existing = await reviewRepository.findByUserAndProduct(userId, productId);
	if (existing) throw conflictError('You have already reviewed this product');

	if (rating < 1 || rating > 5) throw badRequestError('Rating must be between 1 and 5');

	const review = await reviewRepository.create({
		userId,
		productId,
		orderId: orderId || null,
		rating,
		title: title || null,
		body: body || null,
		approved: false,
	});

	return review;
};

export const getProductReviews = async (productId, { page = 1, limit = 10 } = {}) => {
	const { rows, total } = await reviewRepository.findManyByProduct(productId, { page, limit, approved: true });
	const stats = await reviewRepository.getProductStats(productId);

	return {
		reviews: rows,
		stats,
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

export const getPendingReviews = async ({ page = 1, limit = 20 } = {}) => {
	const { rows, total } = await reviewRepository.findManyPending({ page, limit });
	return {
		reviews: rows,
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

export const approveReview = async (id, approved) => {
	const review = await reviewRepository.findById(id);
	if (!review) throw notFoundError('Review not found');
	return reviewRepository.approve(id, approved);
};

export const deleteReview = async (userId, id, isAdmin = false) => {
	const review = await reviewRepository.findById(id);
	if (!review) throw notFoundError('Review not found');
	if (!isAdmin && review.userId !== userId) throw forbiddenError('Not your review');
	return reviewRepository.softDelete(id);
};

const reviewService = { createReview, getProductReviews, getPendingReviews, approveReview, deleteReview };
export default reviewService;
