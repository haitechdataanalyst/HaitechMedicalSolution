import { couponRepository } from '../repositories/index.js';
import { notFoundError, badRequestError, conflictError } from '../utils/index.js';

export const validateCoupon = async (code, userId, orderTotal) => {
	const coupon = await couponRepository.findByCode(code);
	if (!coupon) throw notFoundError('Coupon not found');
	if (!couponRepository.isValidNow(coupon)) throw badRequestError('Coupon is expired or no longer valid');

	if (orderTotal < coupon.minOrderAmount) {
		throw badRequestError(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
	}

	// Non-atomic pre-check for per-user limit — provides an early, user-friendly error
	// before we attempt the atomic apply.  The real enforcement happens inside
	// atomicIncrementUsage, so this is safe to be a read-only optimistic check.
	if (userId && coupon.perUserLimit != null) {
		const uses = await couponRepository.countUserUses(coupon.id, userId);
		if (uses >= coupon.perUserLimit) {
			throw badRequestError('You have already used this coupon the maximum number of times');
		}
	}

	const discount = calculateDiscount(coupon, orderTotal);

	return {
		coupon: {
			id: coupon.id,
			code: coupon.code,
			type: coupon.type,
			value: Number(coupon.value),
		},
		discount,
		finalTotal: Math.max(0, orderTotal - discount),
	};
};

const calculateDiscount = (coupon, total) => {
	if (coupon.type === 'percent') {
		return Math.round((total * Number(coupon.value)) / 100);
	}
	if (coupon.type === 'flat') {
		return Math.min(Number(coupon.value), total);
	}
	return 0;
};

/**
 * Validates and atomically applies a coupon to an order.
 *
 * The sequence is:
 *  1. Optimistic pre-checks (date window, min order, per-user count) via validateCoupon.
 *     These are cheap reads that return early with human-friendly error messages.
 *  2. atomicIncrementUsage runs a single DB transaction that:
 *     a. Increments used_count WHERE used_count < max_uses (or max_uses IS NULL).
 *     b. Re-checks the per-user count inside the same transaction.
 *     c. Inserts the coupon_use record.
 *     If any constraint is violated the transaction is rolled back and null is returned.
 *
 * This guarantees that even under heavy concurrent traffic the global max_uses and
 * per-user limits are never exceeded.
 */
export const applyCoupon = async (code, userId, orderId, orderTotal) => {
	const { coupon, discount } = await validateCoupon(code, userId, orderTotal);

	let result;
	try {
		result = await couponRepository.atomicIncrementUsage(coupon.id, userId, orderId, discount);
	} catch (err) {
		// PER_USER_LIMIT_EXCEEDED is thrown inside the transaction before it rolls back.
		if (err.message === 'PER_USER_LIMIT_EXCEEDED') {
			throw badRequestError('You have already used this coupon the maximum number of times');
		}
		throw err;
	}

	// null means the global max_uses was hit between our pre-check and the atomic update.
	if (!result) {
		throw badRequestError('This coupon has reached its maximum usage limit');
	}

	return discount;
};

export const listCoupons = async ({ page = 1, limit = 20 } = {}) => {
	const { rows, total } = await couponRepository.findMany({ page, limit });
	return {
		coupons: rows,
		meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
	};
};

export const createCoupon = async (data) => {
	const existing = await couponRepository.findByCode(data.code);
	if (existing) throw conflictError('Coupon code already exists');
	return couponRepository.create(data);
};

export const updateCoupon = async (id, data) => {
	const coupon = await couponRepository.findById(id);
	if (!coupon) throw notFoundError('Coupon not found');
	return couponRepository.update(id, data);
};

export const deleteCoupon = async (id) => {
	const coupon = await couponRepository.findById(id);
	if (!coupon) throw notFoundError('Coupon not found');
	await couponRepository.softDelete(id);
};

const couponService = { validateCoupon, applyCoupon, listCoupons, createCoupon, updateCoupon, deleteCoupon };
export default couponService;
