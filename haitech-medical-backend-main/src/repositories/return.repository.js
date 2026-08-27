import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { return_requests, orders, users } from '../schema/index.js';

// ── Write operations ──────────────────────────────────────────────────────────

// `conn` defaults to the shared pool but accepts a transaction context so
// return.service.js can create the request and update the order's status
// atomically in the same transaction.
export const create = async ({ orderId, userId, reason, description }, conn = db) => {
	const [row] = await conn
		.insert(return_requests)
		.values({ orderId, userId, reason, description: description ?? null, status: 'pending' })
		.returning();
	return row;
};

export const update = async (id, updates, conn = db) => {
	const [row] = await conn.update(return_requests).set(updates).where(eq(return_requests.id, id)).returning();
	return row || null;
};

// ── Read operations ───────────────────────────────────────────────────────────

export const findById = async (id, conn = db) => {
	const [row] = await conn.select().from(return_requests).where(eq(return_requests.id, id)).limit(1);
	return row || null;
};

export const findPendingByOrderAndUser = async (orderId, userId, conn = db) => {
	const [row] = await conn
		.select({ id: return_requests.id, status: return_requests.status })
		.from(return_requests)
		.where(
			and(
				eq(return_requests.orderId, orderId),
				eq(return_requests.userId, userId),
				eq(return_requests.status, 'pending')
			)
		)
		.limit(1);
	return row || null;
};

export const findLatestByOrderAndUser = async (orderId, userId) => {
	const [row] = await db
		.select()
		.from(return_requests)
		.where(and(eq(return_requests.orderId, orderId), eq(return_requests.userId, userId)))
		.orderBy(desc(return_requests.createdAt))
		.limit(1);
	return row || null;
};

export const findManyByUser = async (userId, { limit = 10, offset = 0 } = {}) => {
	const where = eq(return_requests.userId, userId);

	const [rows, [countRow]] = await Promise.all([
		db.select().from(return_requests).where(where).orderBy(desc(return_requests.createdAt)).limit(limit).offset(offset),
		db.select({ count: sql`count(*)::int` }).from(return_requests).where(where),
	]);

	return { rows, total: countRow?.count ?? 0 };
};

// Admin listing — joins order + customer summary fields, same shape the old
// returns.controller.js built inline.
export const findManyAdmin = async ({ status, limit = 20, offset = 0 } = {}) => {
	const where = status ? eq(return_requests.status, status) : undefined;

	const columns = {
		id: return_requests.id,
		orderId: return_requests.orderId,
		userId: return_requests.userId,
		reason: return_requests.reason,
		description: return_requests.description,
		status: return_requests.status,
		adminNotes: return_requests.adminNotes,
		refundAmount: return_requests.refundAmount,
		processedBy: return_requests.processedBy,
		processedAt: return_requests.processedAt,
		createdAt: return_requests.createdAt,
		updatedAt: return_requests.updatedAt,
		orderStatus: orders.status,
		orderTotal: orders.total,
		userFirstName: users.firstName,
		userLastName: users.lastName,
		userEmail: users.email,
	};

	const baseFrom = () =>
		db
			.select(columns)
			.from(return_requests)
			.leftJoin(orders, eq(return_requests.orderId, orders.id))
			.leftJoin(users, eq(return_requests.userId, users.id));

	const [rows, [countRow]] = await Promise.all([
		(where ? baseFrom().where(where) : baseFrom()).orderBy(desc(return_requests.createdAt)).limit(limit).offset(offset),
		where
			? db.select({ count: sql`count(*)::int` }).from(return_requests).where(where)
			: db.select({ count: sql`count(*)::int` }).from(return_requests),
	]);

	return { rows, total: countRow?.count ?? 0 };
};
