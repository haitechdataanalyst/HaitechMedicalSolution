import { sql, eq, and, gte, desc } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders, orderItems, users } from '../schema/index.js';

// Dashboard analytics queries. Revenue here counts ALL active orders (no payment_status filter) — deliberately
// different from revenue.repository.js, which counts paid orders only. Not reconciled; see ARCHITECTURE-DECISIONS.md.
const ACTIVE_SINCE = (since) => and(eq(orders.active, true), gte(orders.createdAt, since));

export const orderTotals = async (since) => {
	const [totals] = await db.select({
		count: sql`count(*)::int`,
		revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
		avgOrderValue: sql`coalesce(avg(${orders.total}), 0)::numeric`,
	}).from(orders).where(ACTIVE_SINCE(since));
	return totals;
};

export const orderStatusCounts = (since) =>
	db.select({
		status: orders.status,
		count: sql`count(*)::int`,
	}).from(orders)
		.where(ACTIVE_SINCE(since))
		.groupBy(orders.status);

export const userTotals = async (since) => {
	const [totals] = await db.select({
		total: sql`count(*)::int`,
		newUsers: sql`count(case when ${users.createdAt} >= ${since} then 1 end)::int`,
	}).from(users).where(eq(users.active, true));
	return totals;
};

export const topProducts = (since, limit) =>
	db.select({
		productId: orderItems.productId,
		productName: orderItems.productName,
		productBrand: orderItems.productBrand,
		totalQty: sql`sum(${orderItems.quantity})::int`,
		totalRevenue: sql`sum(${orderItems.totalPrice})::bigint`,
		orderCount: sql`count(distinct ${orderItems.orderId})::int`,
	})
		.from(orderItems)
		.innerJoin(orders, eq(orderItems.orderId, orders.id))
		.where(ACTIVE_SINCE(since))
		.groupBy(orderItems.productId, orderItems.productName, orderItems.productBrand)
		.orderBy(desc(sql`sum(${orderItems.totalPrice})`))
		.limit(limit);

export const revenueByDay = (since) =>
	db.select({
		date: sql`date(${orders.createdAt})`,
		revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
		orderCount: sql`count(*)::int`,
	})
		.from(orders)
		.where(ACTIVE_SINCE(since))
		.groupBy(sql`date(${orders.createdAt})`)
		.orderBy(sql`date(${orders.createdAt})`);
