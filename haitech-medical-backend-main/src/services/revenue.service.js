import { revenueRepository } from '../repositories/index.js';

const toNum = (v) => (v === null || v === undefined ? 0 : Number(v));

export const adminGetRevenue = async () => {
	const now = new Date();
	const dailyStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const monthlyStart = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
	const yearlyStart = new Date(now.getFullYear() - 4, 0, 1);

	const [dailyRows, monthlyRows, yearlyRows, summary] = await Promise.all([
		revenueRepository.getDaily(dailyStart),
		revenueRepository.getMonthly(monthlyStart),
		revenueRepository.getYearly(yearlyStart),
		revenueRepository.getSummary(),
	]);

	return {
		summary: {
			totalRevenue: toNum(summary?.totalRevenue),
			totalOrders: toNum(summary?.totalOrders),
			avgOrderValue: Math.round(toNum(summary?.avgOrderValue)),
		},
		daily: dailyRows.map((r) => ({ date: r.date, revenue: toNum(r.revenue), orderCount: toNum(r.orderCount) })),
		monthly: monthlyRows.map((r) => ({ month: r.month, revenue: toNum(r.revenue), orderCount: toNum(r.orderCount) })),
		yearly: yearlyRows.map((r) => ({ year: toNum(r.year), revenue: toNum(r.revenue), orderCount: toNum(r.orderCount) })),
	};
};

const revenueService = { adminGetRevenue };
export default revenueService;
