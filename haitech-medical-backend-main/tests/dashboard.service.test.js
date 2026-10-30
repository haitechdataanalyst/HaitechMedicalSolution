// Unit tests for dashboard.service.js — fake repository, no DB. Pins the number shaping that moved out of the queries.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createDashboardService } from '../src/services/dashboard.service.js';

describe('createDashboardService (fake repo injection)', () => {
	test('getOrderStats converts bigint/numeric strings and groups by status', async () => {
		const service = createDashboardService({
			dashboardRepository: {
				orderTotals: async () => ({ count: 3, revenue: '1500', avgOrderValue: '500.4' }),
				orderStatusCounts: async () => [{ status: 'paid', count: 2 }, { status: 'pending', count: 1 }],
			},
		});
		const stats = await service.getOrderStats('month');
		assert.equal(stats.totalOrders, 3);
		assert.equal(stats.totalRevenue, 1500);
		assert.equal(stats.avgOrderValue, 500);
		assert.deepEqual(stats.byStatus, { paid: 2, pending: 1 });
	});

	test('getTopProducts passes the limit through and numbers the revenue', async () => {
		let seenLimit;
		const service = createDashboardService({
			dashboardRepository: {
				topProducts: async (_since, limit) => {
					seenLimit = limit;
					return [{ productId: 1, totalRevenue: '900' }];
				},
			},
		});
		const rows = await service.getTopProducts({ limit: 5 });
		assert.equal(seenLimit, 5);
		assert.equal(rows[0].totalRevenue, 900);
	});

	test('getRevenueByDay numbers the revenue column', async () => {
		const service = createDashboardService({
			dashboardRepository: { revenueByDay: async () => [{ date: '2026-10-01', revenue: '250', orderCount: 1 }] },
		});
		assert.equal((await service.getRevenueByDay({ days: 7 }))[0].revenue, 250);
	});
});
