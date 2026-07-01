import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { reviews } from '../schema/index.js';

export const create = async (data) => {
	const [row] = await db.insert(reviews).values(data).returning();
	return row;
};

export const findById = async (id) => {
	const [row] = await db.select().from(reviews)
		.where(and(eq(reviews.id, id), eq(reviews.active, true)))
		.limit(1);
	return row || null;
};

export const findByUserAndProduct = async (userId, productId) => {
	const [row] = await db.select().from(reviews)
		.where(and(eq(reviews.userId, userId), eq(reviews.productId, productId), eq(reviews.active, true)))
		.limit(1);
	return row || null;
};

export const findManyByProduct = async (productId, { page = 1, limit = 10, approved = true } = {}) => {
	const offset = (page - 1) * limit;
	const where = and(eq(reviews.productId, productId), eq(reviews.active, true), approved ? eq(reviews.approved, true) : undefined);

	const rows = await db.select().from(reviews)
		.where(where)
		.orderBy(desc(reviews.createdAt))
		.limit(limit)
		.offset(offset);

	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(reviews).where(where);

	return { rows, total: count };
};

export const findManyPending = async ({ page = 1, limit = 20 } = {}) => {
	const offset = (page - 1) * limit;
	const where = and(eq(reviews.approved, false), eq(reviews.active, true));

	const rows = await db.select().from(reviews).where(where)
		.orderBy(desc(reviews.createdAt))
		.limit(limit)
		.offset(offset);

	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(reviews).where(where);

	return { rows, total: count };
};

export const getProductStats = async (productId) => {
	const [stats] = await db.select({
		count: sql`count(*)::int`,
		avg: sql`round(avg(${reviews.rating})::numeric, 1)`,
	}).from(reviews)
		.where(and(eq(reviews.productId, productId), eq(reviews.active, true), eq(reviews.approved, true)));
	return stats || { count: 0, avg: null };
};

export const approve = async (id, approved) => {
	const [row] = await db.update(reviews)
		.set({ approved, modifiedAt: new Date() })
		.where(eq(reviews.id, id))
		.returning();
	return row;
};

export const softDelete = async (id) => {
	const [row] = await db.update(reviews)
		.set({ active: false, modifiedAt: new Date() })
		.where(eq(reviews.id, id))
		.returning();
	return row;
};
