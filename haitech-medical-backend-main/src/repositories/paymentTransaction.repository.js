import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { paymentTransactions, orders, users } from '../schema/index.js';

// Admin payment-transaction listing: payment_transactions LEFT JOIN orders/users.
// Previously this ran as a raw db.execute() SQL string in admin.controller.js
// with a try/catch fallback to querying `orders` directly for when the
// payment_transactions table didn't exist. That table is now a declared
// Drizzle schema table (Phase 1) and has existed in the DB since migration
// 0002_production_hardening.sql, so the fallback path is dead and dropped —
// same reasoning as inventory.repository.js's findManyWithProducts.
export const findMany = async ({ orderId, userId, limit = 20, offset = 0 } = {}) => {
	const conditions = [];
	if (orderId) conditions.push(eq(paymentTransactions.orderId, orderId));
	if (userId) conditions.push(eq(orders.userId, userId));
	const where = conditions.length ? and(...conditions) : undefined;

	const columns = {
		id: paymentTransactions.id,
		orderId: paymentTransactions.orderId,
		razorpayOrderId: paymentTransactions.razorpayOrderId,
		razorpayPaymentId: paymentTransactions.razorpayPaymentId,
		eventType: paymentTransactions.eventType,
		amount: paymentTransactions.amount,
		currency: paymentTransactions.currency,
		status: paymentTransactions.status,
		metadata: paymentTransactions.metadata,
		processedAt: paymentTransactions.processedAt,
		createdAt: paymentTransactions.createdAt,
		orderStatus: orders.status,
		orderTotal: orders.total,
		userEmail: users.email,
		userFirstName: users.firstName,
		userLastName: users.lastName,
	};

	const [rows, [countRow]] = await Promise.all([
		db
			.select(columns)
			.from(paymentTransactions)
			.leftJoin(orders, eq(orders.id, paymentTransactions.orderId))
			.leftJoin(users, eq(users.id, orders.userId))
			.where(where)
			.orderBy(desc(paymentTransactions.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql`count(*)::int` })
			.from(paymentTransactions)
			.leftJoin(orders, eq(orders.id, paymentTransactions.orderId))
			.where(where),
	]);

	return { rows, total: countRow?.count ?? 0 };
};
