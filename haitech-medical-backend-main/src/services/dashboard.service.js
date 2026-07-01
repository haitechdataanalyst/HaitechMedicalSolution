import { sql, eq, and, gte, desc } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders, orderItems, users } from '../schema/index.js';

const startOf = (period) => {
	const now = new Date();
	if (period === 'today') {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}
	if (period === 'week') {
		const d = new Date(now);
		d.setDate(d.getDate() - 7);
		return d;
	}
	if (period === 'month') {
		return new Date(now.getFullYear(), now.getMonth(), 1);
	}
	if (period === 'year') {
		return new Date(now.getFullYear(), 0, 1);
	}
	return new Date(0);
};

export const getOrderStats = async (period = 'month') => {
	const since = startOf(period);

	const [totals] = await db.select({
		count: sql`count(*)::int`,
		revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
		avgOrderValue: sql`coalesce(avg(${orders.total}), 0)::numeric`,
	}).from(orders).where(and(eq(orders.active, true), gte(orders.createdAt, since)));

	const statusBreakdown = await db.select({
		status: orders.status,
		count: sql`count(*)::int`,
	}).from(orders)
		.where(and(eq(orders.active, true), gte(orders.createdAt, since)))
		.groupBy(orders.status);

	return {
		period,
		since: since.toISOString(),
		totalOrders: totals.count,
		totalRevenue: Number(totals.revenue),
		avgOrderValue: Math.round(Number(totals.avgOrderValue)),
		byStatus: Object.fromEntries(statusBreakdown.map((r) => [r.status, r.count])),
	};
};

export const getUserStats = async (period = 'month') => {
	const since = startOf(period);

	const [totals] = await db.select({
		total: sql`count(*)::int`,
		newUsers: sql`count(case when ${users.createdAt} >= ${since} then 1 end)::int`,
	}).from(users).where(eq(users.active, true));

	return {
		period,
		totalUsers: totals.total,
		newUsers: totals.newUsers,
	};
};

export const getTopProducts = async ({ limit = 10, period = 'month' } = {}) => {
	const since = startOf(period);

	const rows = await db.select({
		productId: orderItems.productId,
		productName: orderItems.productName,
		productBrand: orderItems.productBrand,
		totalQty: sql`sum(${orderItems.quantity})::int`,
		totalRevenue: sql`sum(${orderItems.totalPrice})::bigint`,
		orderCount: sql`count(distinct ${orderItems.orderId})::int`,
	})
		.from(orderItems)
		.innerJoin(orders, eq(orderItems.orderId, orders.id))
		.where(and(eq(orders.active, true), gte(orders.createdAt, since)))
		.groupBy(orderItems.productId, orderItems.productName, orderItems.productBrand)
		.orderBy(desc(sql`sum(${orderItems.totalPrice})`))
		.limit(limit);

	return rows.map((r) => ({ ...r, totalRevenue: Number(r.totalRevenue) }));
};

export const getRevenueByDay = async ({ days = 30 } = {}) => {
	const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

	const rows = await db.select({
		date: sql`date(${orders.createdAt})`,
		revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
		orderCount: sql`count(*)::int`,
	})
		.from(orders)
		.where(and(eq(orders.active, true), gte(orders.createdAt, since)))
		.groupBy(sql`date(${orders.createdAt})`)
		.orderBy(sql`date(${orders.createdAt})`);

	return rows.map((r) => ({ ...r, revenue: Number(r.revenue) }));
};

export const getSummary = async () => {
	const [orderStats, userStats, topProducts] = await Promise.all([
		getOrderStats('month'),
		getUserStats('month'),
		getTopProducts({ limit: 5 }),
	]);

	return { orders: orderStats, users: userStats, topProducts };
};

const dashboardService = { getOrderStats, getUserStats, getTopProducts, getRevenueByDay, getSummary };
export default dashboardService;
