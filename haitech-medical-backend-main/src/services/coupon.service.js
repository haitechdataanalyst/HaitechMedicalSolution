import { couponRepository } from '../repositories/index.js';
import { notFoundError, badRequestError, conflictError } from '../utils/index.js';

// Pure — no repo access, so it needs no DI to unit test directly.
export const calculateDiscount = (coupon, total) => {
	if (coupon.type === 'percent') {
		return Math.round((total * Number(coupon.value)) / 100);
	}
	if (coupon.type === 'flat') {
		return Math.min(Number(coupon.value), total);
	}
	return 0;
};

// ── Lightweight DI ────────────────────────────────────────────────────────────
// Same pattern as order.service.js / return.service.js: inject the repository
// so the money-affecting branches (expiry/min-order/per-user-limit checks,
// the max-uses-race → null → error mapping) can be unit tested with a fake
// repo instead of a real DB.
export const createCouponService = ({ couponRepository: couponRepo = couponRepository } = {}) => {
	const validateCoupon = async (code, userId, orderTotal) => {
		const coupon = await couponRepo.findByCode(code);
		if (!coupon) throw notFoundError('Coupon not found');
		if (!couponRepo.isValidNow(coupon)) throw badRequestError('Coupon is expired or no longer valid');

		if (orderTotal < coupon.minOrderAmount) {
			throw badRequestError(`Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`);
		}

		// Non-atomic pre-check for per-user limit — provides an early, user-friendly error
		// before we attempt the atomic apply.  The real enforcement happens inside
		// atomicIncrementUsage, so this is safe to be a read-only optimistic check.
		if (userId && coupon.perUserLimit !== null && coupon.perUserLimit !== undefined) {
			const uses = await couponRepo.countUserUses(coupon.id, userId);
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
	const applyCoupon = async (code, userId, orderId, orderTotal) => {
		const { coupon, discount } = await validateCoupon(code, userId, orderTotal);

		let result;
		try {
			result = await couponRepo.atomicIncrementUsage(coupon.id, userId, orderId, discount);
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

	const listCoupons = async ({ page = 1, limit = 20 } = {}) => {
		const { rows, total } = await couponRepo.findMany({ page, limit });
		return {
			coupons: rows,
			meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
		};
	};

	const createCoupon = async (data) => {
		const existing = await couponRepo.findByCode(data.code);
		if (existing) throw conflictError('Coupon code already exists');
		return couponRepo.create(data);
	};

	const updateCoupon = async (id, data) => {
		const coupon = await couponRepo.findById(id);
		if (!coupon) throw notFoundError('Coupon not found');
		return couponRepo.update(id, data);
	};

	const deleteCoupon = async (id) => {
		const coupon = await couponRepo.findById(id);
		if (!coupon) throw notFoundError('Coupon not found');
		await couponRepo.softDelete(id);
	};

	// ── Admin coupon management ─────────────────────────────────────────────
	// Distinct from the customer-facing listCoupons/createCoupon/etc above: admin
	// views need ALL coupons (including inactive) plus usage stats, and admin
	// create/update accept the raw field set with defaults applied here (this
	// normalization previously lived inline in admin.controller.js).
	const adminListCoupons = async ({ page = 1, limit = 20 } = {}) => {
		const { rows, total } = await couponRepo.findManyWithStats({ page, limit });
		return {
			coupons: rows.map((c) => ({ ...c, value: Number(c.value), totalDiscountGiven: Number(c.totalDiscountGiven) })),
			meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 },
		};
	};

	const adminCreateCoupon = async (body) => {
		const existing = await couponRepo.findByCode(body.code);
		if (existing) throw conflictError('Coupon code already exists');

		return couponRepo.create({
			code: body.code.toUpperCase().trim(),
			type: body.type || 'percent',
			value: body.value,
			minOrderAmount: body.minOrderAmount ?? 0,
			maxUses: body.maxUses ?? null,
			perUserLimit: body.perUserLimit ?? 1,
			validFrom: body.validFrom ? new Date(body.validFrom) : new Date(),
			validUntil: body.validUntil ? new Date(body.validUntil) : null,
			active: true,
		});
	};

	const adminUpdateCoupon = async (id, body) => {
		const existing = await couponRepo.findById(id);
		if (!existing) throw notFoundError('Coupon not found');

		const updates = {};
		if (body.code !== undefined) updates.code = body.code.toUpperCase().trim();
		if (body.type !== undefined) updates.type = body.type;
		if (body.value !== undefined) updates.value = body.value;
		if (body.minOrderAmount !== undefined) updates.minOrderAmount = body.minOrderAmount;
		if (body.maxUses !== undefined) updates.maxUses = body.maxUses;
		if (body.perUserLimit !== undefined) updates.perUserLimit = body.perUserLimit;
		if (body.validFrom !== undefined) updates.validFrom = new Date(body.validFrom);
		if (body.validUntil !== undefined) updates.validUntil = body.validUntil ? new Date(body.validUntil) : null;
		if (body.active !== undefined) updates.active = body.active;

		return couponRepo.update(id, updates);
	};

	const adminDeleteCoupon = async (id) => {
		const existing = await couponRepo.findById(id);
		if (!existing) throw notFoundError('Coupon not found');
		await couponRepo.softDelete(id);
	};

	return {
		validateCoupon,
		applyCoupon,
		listCoupons,
		createCoupon,
		updateCoupon,
		deleteCoupon,
		adminListCoupons,
		adminCreateCoupon,
		adminUpdateCoupon,
		adminDeleteCoupon,
	};
};

const defaultCouponService = createCouponService();

export const {
	validateCoupon,
	applyCoupon,
	listCoupons,
	createCoupon,
	updateCoupon,
	deleteCoupon,
	adminListCoupons,
	adminCreateCoupon,
	adminUpdateCoupon,
	adminDeleteCoupon,
} = defaultCouponService;

const couponService = { ...defaultCouponService, calculateDiscount, createCouponService };
export default couponService;
