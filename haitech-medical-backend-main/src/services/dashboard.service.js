import { dashboardRepository } from '../repositories/index.js';

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

export const createDashboardService = ({ dashboardRepository: repo = dashboardRepository } = {}) => {
	const getOrderStats = async (period = 'month') => {
		const since = startOf(period);
		const [totals, statusBreakdown] = await Promise.all([
			repo.orderTotals(since),
			repo.orderStatusCounts(since),
		]);

		return {
			period,
			since: since.toISOString(),
			totalOrders: totals.count,
			totalRevenue: Number(totals.revenue),
			avgOrderValue: Math.round(Number(totals.avgOrderValue)),
			byStatus: Object.fromEntries(statusBreakdown.map((r) => [r.status, r.count])),
		};
	};

	const getUserStats = async (period = 'month') => {
		const totals = await repo.userTotals(startOf(period));

		return {
			period,
			totalUsers: totals.total,
			newUsers: totals.newUsers,
		};
	};

	const getTopProducts = async ({ limit = 10, period = 'month' } = {}) => {
		const rows = await repo.topProducts(startOf(period), limit);
		return rows.map((r) => ({ ...r, totalRevenue: Number(r.totalRevenue) }));
	};

	const getRevenueByDay = async ({ days = 30 } = {}) => {
		const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
		const rows = await repo.revenueByDay(since);
		return rows.map((r) => ({ ...r, revenue: Number(r.revenue) }));
	};

	const getSummary = async () => {
		const [orderStats, userStats, topProducts] = await Promise.all([
			getOrderStats('month'),
			getUserStats('month'),
			getTopProducts({ limit: 5 }),
		]);

		return { orders: orderStats, users: userStats, topProducts };
	};

	return { getOrderStats, getUserStats, getTopProducts, getRevenueByDay, getSummary };
};

const defaultService = createDashboardService();
export const { getOrderStats, getUserStats, getTopProducts, getRevenueByDay, getSummary } = defaultService;

const dashboardService = { ...defaultService, createDashboardService };
export default dashboardService;
