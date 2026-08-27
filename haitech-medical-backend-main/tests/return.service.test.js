// Phase 3: lightweight-DI unit tests for return.service.js — the single
// authoritative return workflow reconciled in Phase 2. Fake repos, no DB.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createReturnService, ORDER_STATUS_FOR_RETURN_DECISION } from '../src/services/return.service.js';

describe('createReturnService (fake repo injection)', () => {
	test('requestReturn rejects when the order is not in a returnable state', async () => {
		const service = createReturnService({
			orderRepository: { findByIdAndUser: async () => ({ id: 'o1', status: 'pending' }) },
		});
		await assert.rejects(
			() => service.requestReturn('u1', 'o1', { reason: 'defective' }),
			/Cannot transition order/,
		);
	});

	test('requestReturn rejects a duplicate pending request', async () => {
		const service = createReturnService({
			orderRepository: { findByIdAndUser: async () => ({ id: 'o1', status: 'delivered' }) },
			returnRepository: { findPendingByOrderAndUser: async () => ({ id: 'existing-return' }) },
		});
		await assert.rejects(
			() => service.requestReturn('u1', 'o1', { reason: 'defective' }),
			/pending return request already exists/,
		);
	});

	test('requestReturn creates the return and flips the order to return_requested', async () => {
		const calls = [];
		const service = createReturnService({
			orderRepository: {
				findByIdAndUser: async () => ({ id: 'o1', status: 'delivered' }),
				updateStatus: async (orderId, userId, status) => {
					calls.push(['updateStatus', orderId, status]);
					return { id: orderId, status };
				},
			},
			returnRepository: {
				findPendingByOrderAndUser: async () => null,
				create: async (data) => {
					calls.push(['create', data]);
					return { id: 'r1', ...data, status: 'pending' };
				},
			},
			runTransaction: (cb) => cb(undefined),
		});

		const result = await service.requestReturn('u1', 'o1', { reason: 'defective', description: 'cracked' });

		assert.equal(result.returnRequest.id, 'r1');
		assert.equal(result.order.status, 'return_requested');
		assert.deepEqual(calls[0], ['create', { orderId: 'o1', userId: 'u1', reason: 'defective', description: 'cracked' }]);
		assert.deepEqual(calls[1], ['updateStatus', 'o1', 'return_requested']);
	});

	test('processReturn rejects an invalid target status', async () => {
		const service = createReturnService({ returnRepository: { findById: async () => ({ id: 'r1' }) } });
		await assert.rejects(() => service.processReturn('admin1', 'r1', { status: 'bogus' }), /Invalid return status/);
	});

	test('processReturn 404s on a missing return request', async () => {
		const service = createReturnService({ returnRepository: { findById: async () => null } });
		await assert.rejects(
			() => service.processReturn('admin1', 'missing', { status: 'approved' }),
			/Return request not found/,
		);
	});

	for (const [decision, expectedOrderStatus] of Object.entries(ORDER_STATUS_FOR_RETURN_DECISION)) {
		test(`processReturn(${decision}) moves the order to ${expectedOrderStatus}`, async () => {
			let orderStatusWritten = null;
			const service = createReturnService({
				returnRepository: {
					findById: async () => ({ id: 'r1', orderId: 'o1' }),
					update: async (id, updates) => ({ id, ...updates }),
				},
				orderRepository: {
					updateStatus: async (orderId, adminId, status) => {
						orderStatusWritten = status;
						return { id: orderId, status };
					},
				},
				runTransaction: (cb) => cb(undefined),
			});

			const result = await service.processReturn('admin1', 'r1', { status: decision });

			assert.equal(orderStatusWritten, expectedOrderStatus);
			assert.equal(result.order.status, expectedOrderStatus);
		});
	}

	test("processReturn('approved') leaves the order untouched (not a terminal decision)", async () => {
		let orderRepoTouched = false;
		const service = createReturnService({
			returnRepository: {
				findById: async () => ({ id: 'r1', orderId: 'o1' }),
				update: async (id, updates) => ({ id, ...updates }),
			},
			orderRepository: {
				updateStatus: async () => {
					orderRepoTouched = true;
				},
			},
			runTransaction: (cb) => cb(undefined),
		});

		const result = await service.processReturn('admin1', 'r1', { status: 'approved' });

		assert.equal(orderRepoTouched, false);
		assert.equal(result.order, null);
	});
});
