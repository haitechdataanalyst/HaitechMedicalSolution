import { httpStatus } from '../constants/index.js';
import { dashboardService } from '../services/index.js';
import { catchAsync } from '../utils/index.js';

export const getDashboardSummary = catchAsync(async (req, res) => {
	const summary = await dashboardService.getSummary();
	return res.respond(httpStatus.OK, summary);
});

export const getOrderStats = catchAsync(async (req, res) => {
	const { period = 'month' } = req.query;
	const stats = await dashboardService.getOrderStats(period);
	return res.respond(httpStatus.OK, stats);
});

export const getUserStats = catchAsync(async (req, res) => {
	const { period = 'month' } = req.query;
	const stats = await dashboardService.getUserStats(period);
	return res.respond(httpStatus.OK, stats);
});

export const getTopProducts = catchAsync(async (req, res) => {
	const { limit = 10, period = 'month' } = req.query;
	const products = await dashboardService.getTopProducts({ limit: Number(limit), period });
	return res.respond(httpStatus.OK, { products });
});

export const getRevenueByDay = catchAsync(async (req, res) => {
	const { days = 30 } = req.query;
	const data = await dashboardService.getRevenueByDay({ days: Number(days) });
	return res.respond(httpStatus.OK, { data });
});
