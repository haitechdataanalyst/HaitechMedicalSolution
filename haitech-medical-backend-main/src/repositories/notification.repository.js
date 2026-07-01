import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { notifications } from '../schema/index.js';

export const create = async (data) => {
	const [row] = await db.insert(notifications).values(data).returning();
	return row;
};

export const createBulk = async (rows) => {
	if (!rows.length) return [];
	return db.insert(notifications).values(rows).returning();
};

export const findManyByUser = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
	const offset = (page - 1) * limit;
	const where = and(
		eq(notifications.userId, userId),
		eq(notifications.active, true),
		unreadOnly ? eq(notifications.read, false) : undefined
	);

	const rows = await db.select().from(notifications)
		.where(where)
		.orderBy(desc(notifications.createdAt))
		.limit(limit)
		.offset(offset);

	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(notifications).where(where);

	return { rows, total: count };
};

export const countUnread = async (userId) => {
	const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(notifications)
		.where(and(eq(notifications.userId, userId), eq(notifications.read, false), eq(notifications.active, true)));
	return count;
};

export const markRead = async (id, userId) => {
	const [row] = await db.update(notifications)
		.set({ read: true })
		.where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
		.returning();
	return row;
};

export const markAllRead = async (userId) => {
	await db.update(notifications)
		.set({ read: true })
		.where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
};

export const softDelete = async (id, userId) => {
	await db.update(notifications)
		.set({ active: false })
		.where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
};
