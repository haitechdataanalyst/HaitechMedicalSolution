import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '../config/index.js';
import { orders } from '../schema/index.js';

// Admin revenue analytics (paid orders only). Previously admin.controller.js
// built the "active = true AND payment_status = 'paid'" condition as a plain
// JS string passed through sql.raw() — not attacker-controlled (no user input
// in the string) so not an injection bug, but it bypassed Drizzle's builder
// for no reason. Replaced with a real `and(eq(...), eq(...))` condition reused
// across all four queries.
//
// NOTE: dashboard.service.js's getOrderStats/getRevenueByDay compute revenue
// over ALL active orders (no payment_status filter) — a different, pre-existing
// definition of "revenue" than this admin endpoint's "paid only" definition.
// Deliberately not reconciled here; see [[feedback_architecture_policy]].
const PAID = and(eq(orders.active, true), eq(orders.paymentStatus, 'paid'));

export const getDaily = (since) =>
	db
		.select({
			date: sql`date(${orders.createdAt})`,
			revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
			orderCount: sql`count(*)::int`,
		})
		.from(orders)
		.where(and(PAID, gte(orders.createdAt, since)))
		.groupBy(sql`date(${orders.createdAt})`)
		.orderBy(sql`date(${orders.createdAt})`);

export const getMonthly = (since) =>
	db
		.select({
			month: sql`to_char(${orders.createdAt}, 'YYYY-MM')`,
			revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
			orderCount: sql`count(*)::int`,
		})
		.from(orders)
		.where(and(PAID, gte(orders.createdAt, since)))
		.groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)
		.orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`);

export const getYearly = (since) =>
	db
		.select({
			year: sql`extract(year from ${orders.createdAt})::int`,
			revenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
			orderCount: sql`count(*)::int`,
		})
		.from(orders)
		.where(and(PAID, gte(orders.createdAt, since)))
		.groupBy(sql`extract(year from ${orders.createdAt})`)
		.orderBy(sql`extract(year from ${orders.createdAt})`);

export const getSummary = async () => {
	const [row] = await db
		.select({
			totalRevenue: sql`coalesce(sum(${orders.total}), 0)::bigint`,
			totalOrders: sql`count(*)::int`,
			avgOrderValue: sql`coalesce(avg(${orders.total}), 0)::numeric`,
		})
		.from(orders)
		.where(PAID);
	return row;
};
