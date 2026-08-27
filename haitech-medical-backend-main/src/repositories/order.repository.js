import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders, orderItems, orderStatusHistory } from '../schema/index.js';

// ── Internal helpers ──────────────────────────────────────────────────────────

// Fetches order items using either the supplied transaction context or the
// default db pool. Always pass the same `conn` that was used to fetch the
// parent order so the read is consistent within a transaction.
const attachItems = async (order, conn = db) => {
	if (!order) return null;
	const items = await conn.select().from(orderItems).where(eq(orderItems.orderId, order.id));
	return { ...order, items };
};

// ── Write operations ──────────────────────────────────────────────────────────

// Fix: `create` now accepts an optional `tx` (transaction context).
// When called from order.service.js inside a `withRetryableTransaction` block
// the caller passes its `tx`, so the header insert and items insert are part of
// the same atomic operation. When called standalone (e.g. scripts / tests) it
// opens its own internal transaction, preserving the original safety guarantee.
export const create = async (userId, { items, subtotal, tax, shippingFee, total, currency, shippingAddressId, notes }, tx) => {
	const run = async (conn) => {
		const [order] = await conn
			.insert(orders)
			.values({
				userId,
				status: 'pending',
				paymentStatus: 'unpaid',
				subtotal,
				tax: tax || 0,
				shippingFee: shippingFee || 0,
				total,
				currency: currency || 'INR',
				shippingAddressId: shippingAddressId || null,
				notes: notes || null,
				createdBy: userId,
				modifiedBy: userId,
			})
			.returning();

		const itemRows = items.map((item) => ({
			orderId: order.id,
			productId: item.productId,
			productName: item.productName,
			productBrand: item.productBrand || null,
			productSku: item.productSku || null,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			totalPrice: item.totalPrice,
		}));

		const insertedItems = await conn.insert(orderItems).values(itemRows).returning();

		return { ...order, items: insertedItems };
	};

	// If the caller already opened a transaction, join it; otherwise open a new one.
	if (tx) return run(tx);
	return db.transaction(run);
};

// ── Read operations ───────────────────────────────────────────────────────────

export const findByIdAndUser = async (id, userId) => {
	const [order] = await db
		.select()
		.from(orders)
		.where(and(eq(orders.id, id), eq(orders.userId, userId), eq(orders.active, true)))
		.limit(1);
	return attachItems(order);
};

export const findById = async (id) => {
	const [order] = await db
		.select()
		.from(orders)
		.where(and(eq(orders.id, id), eq(orders.active, true)))
		.limit(1);
	return attachItems(order);
};

export const findManyByUser = async (userId, { limit = 10, offset = 0 } = {}) => {
	const rows = await db
		.select()
		.from(orders)
		.where(and(eq(orders.userId, userId), eq(orders.active, true)))
		.orderBy(desc(orders.createdAt))
		.limit(limit)
		.offset(offset);

	const [countResult] = await db
		.select({ count: sql`count(*)::int` })
		.from(orders)
		.where(and(eq(orders.userId, userId), eq(orders.active, true)));

	return { rows, total: countResult?.count ?? 0 };
};

// userId/dateFrom/dateTo were previously duplicated as a second, ad-hoc query
// directly inside admin.controller.js because this function didn't support
// them — extended here instead of maintaining two admin order-listing
// implementations. See [[feedback_architecture_policy]] Phase 2.
export const findMany = async ({ limit = 20, offset = 0, status, userId, dateFrom, dateTo } = {}) => {
	const conditions = [eq(orders.active, true)];
	if (status) conditions.push(eq(orders.status, status));
	if (userId) conditions.push(eq(orders.userId, userId));
	if (dateFrom) conditions.push(gte(orders.createdAt, new Date(dateFrom)));
	if (dateTo) conditions.push(lte(orders.createdAt, new Date(dateTo)));
	const where = and(...conditions);

	const rows = await db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);

	const [countResult] = await db.select({ count: sql`count(*)::int` }).from(orders).where(where);

	return { rows, total: countResult?.count ?? 0 };
};

// ── Status / payment updates ──────────────────────────────────────────────────

// `conn` defaults to the shared pool but accepts a transaction context so
// callers (e.g. return.service.js) can update an order's status atomically
// alongside other writes in the same transaction.
export const updateStatus = async (id, modifiedBy, status, conn = db) => {
	const [order] = await conn
		.update(orders)
		.set({ status, modifiedAt: new Date(), modifiedBy })
		.where(and(eq(orders.id, id), eq(orders.active, true)))
		.returning();
	return order || null;
};

// Type-safe replacement for the raw `db.execute(sql\`INSERT INTO
// order_status_history ...\`)` that used to live inline in admin.controller.js
// wrapped in a try/catch-swallow "table may not exist yet" guard — the table
// is now a declared Drizzle schema (Phase 1), so a real failure here should
// surface like any other write, not be silently discarded.
export const recordStatusHistory = async ({ orderId, fromStatus, toStatus, changedBy, reason }, conn = db) => {
	const [row] = await conn
		.insert(orderStatusHistory)
		.values({ orderId, fromStatus: fromStatus ?? null, toStatus, changedBy: changedBy ?? null, reason: reason ?? null })
		.returning();
	return row;
};

export const findByRazorpayOrderId = async (razorpayOrderId) => {
	const [order] = await db
		.select()
		.from(orders)
		.where(and(eq(orders.razorpayOrderId, razorpayOrderId), eq(orders.active, true)))
		.limit(1);
	return order || null;
};

// Low-level payment field updater used by the payment service directly.
// For race-safe updates the payment service now issues its own
// SELECT FOR UPDATE + UPDATE inside a transaction; this function is kept for
// backwards-compatible usage (e.g. admin tools, scripts).
export const updatePayment = async (id, { razorpayOrderId, razorpayPaymentId, paymentStatus }) => {
	const updates = { paymentStatus, modifiedAt: new Date() };
	if (razorpayOrderId) updates.razorpayOrderId = razorpayOrderId;
	if (razorpayPaymentId) updates.razorpayPaymentId = razorpayPaymentId;
	if (paymentStatus === 'paid') updates.status = 'confirmed';

	const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
	return order || null;
};
