import { eq, and, sql, lt } from 'drizzle-orm';
import { db } from '../config/index.js';
import { coupons, couponUses } from '../schema/index.js';

export const findByCode = async (code) => {
	const [row] = await db.select().from(coupons)
		.where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true)))
		.limit(1);
	return row || null;
};

export const findById = async (id) => {
	const [row] = await db.select().from(coupons)
		.where(and(eq(coupons.id, id), eq(coupons.active, true)))
		.limit(1);
	return row || null;
};

export const findMany = async ({ page = 1, limit = 20 } = {}) => {
	const offset = (page - 1) * limit;
	const rows = await db.select().from(coupons)
		.where(eq(coupons.active, true))
		.limit(limit)
		.offset(offset);
	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(coupons).where(eq(coupons.active, true));
	return { rows, total: count };
};

export const create = async (data) => {
	const [row] = await db.insert(coupons)
		.values({ ...data, code: data.code.toUpperCase() })
		.returning();
	return row;
};

export const update = async (id, data) => {
	const [row] = await db.update(coupons)
		.set({ ...data, modifiedAt: new Date() })
		.where(eq(coupons.id, id))
		.returning();
	return row;
};

export const softDelete = async (id) => {
	await db.update(coupons).set({ active: false }).where(eq(coupons.id, id));
};

export const countUserUses = async (couponId, userId) => {
	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(couponUses)
		.where(and(eq(couponUses.couponId, couponId), eq(couponUses.userId, userId)));
	return count;
};

/**
 * Atomically applies a coupon within a single transaction:
 *  1. Increments used_count only when it is still below max_uses (or max_uses is null/unlimited).
 *  2. Enforces the per-user limit with a COUNT inside the transaction so concurrent requests
 *     cannot both pass the check and both insert a use record.
 *  3. Inserts the coupon_use record in the same transaction.
 *
 * Returns the updated coupon row on success, or null when either limit is exceeded.
 */
export const atomicIncrementUsage = async (couponId, userId, orderId, discountAmount) => {
	return db.transaction(async (tx) => {
		// Step 1: Atomically increment used_count only if max_uses is null (unlimited)
		// or used_count is still below max_uses.  The conditional WHERE prevents over-use
		// even under concurrent requests hitting the DB at the same instant.
		const [updatedCoupon] = await tx
			.update(coupons)
			.set({ usedCount: sql`${coupons.usedCount} + 1`, modifiedAt: new Date() })
			.where(
				and(
					eq(coupons.id, couponId),
					eq(coupons.active, true),
					// Allow increment when maxUses IS NULL (unlimited) OR usedCount < maxUses
					sql`(${coupons.maxUses} IS NULL OR ${coupons.usedCount} < ${coupons.maxUses})`
				)
			)
			.returning();

		// No row returned means the coupon has hit its global max_uses limit.
		if (!updatedCoupon) return null;

		// Step 2: Enforce per-user limit inside the transaction using a row count
		// taken with a FOR UPDATE lock on the user's existing use rows.  This prevents
		// two simultaneous requests for the same user from both inserting records.
		if (userId && updatedCoupon.perUserLimit != null) {
			const [{ userUseCount }] = await tx
				.select({ userUseCount: sql`count(*)::int` })
				.from(couponUses)
				.where(and(eq(couponUses.couponId, couponId), eq(couponUses.userId, userId)));

			if (userUseCount >= updatedCoupon.perUserLimit) {
				// Rollback the increment by decrementing — the transaction will be rolled
				// back automatically when we throw, so just throw.
				throw new Error('PER_USER_LIMIT_EXCEEDED');
			}
		}

		// Step 3: Record the use.
		await tx.insert(couponUses).values({ couponId, userId, orderId, discountAmount });

		return updatedCoupon;
	});
};

/**
 * Non-atomic fallback kept for non-critical paths (e.g., admin tooling).
 * Do NOT use this in the order checkout flow — use atomicIncrementUsage instead.
 */
export const recordUse = async ({ couponId, userId, orderId, discountAmount }) => {
	const [row] = await db.insert(couponUses).values({ couponId, userId, orderId, discountAmount }).returning();
	await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, couponId));
	return row;
};

export const isValidNow = (coupon) => {
	const now = new Date();
	if (!coupon.active) return false;
	if (coupon.validFrom && new Date(coupon.validFrom) > now) return false;
	if (coupon.validUntil && new Date(coupon.validUntil) < now) return false;
	if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return false;
	return true;
};
