// Phase 3: lightweight-DI unit tests for order.service.js's business logic.
// No DB, no app boot — fake repositories are injected via createOrderService(),
// so these exercise real branching logic (state machine, price resolution)
// without needing a live Postgres connection.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { assertValidTransition, createOrderService } from '../src/services/order.service.js';

describe('assertValidTransition (pure state machine, no DI needed)', () => {
	test('allows a legal transition', () => {
		assert.doesNotThrow(() => assertValidTransition('pending', 'confirmed'));
	});

	test('rejects an illegal transition', () => {
		assert.throws(() => assertValidTransition('pending', 'delivered'), /Cannot transition order/);
	});

	test('rejects transitions out of a terminal state', () => {
		assert.throws(() => assertValidTransition('cancelled', 'pending'), /Cannot transition order/);
	});

	test('rejects an unknown current status', () => {
		assert.throws(() => assertValidTransition('bogus', 'pending'), /Unknown current order status/);
	});

	test('a rejected return can revert the order back to delivered', () => {
		assert.doesNotThrow(() => assertValidTransition('return_requested', 'delivered'));
	});
});

describe('createOrderService (fake repo injection)', () => {
	test('adminUpdateOrderStatus writes status + history atomically on a legal transition', async () => {
		const writes = [];
		const fakeOrderRepo = {
			findById: async () => ({ id: 'o1', status: 'pending' }),
			updateStatus: async (orderId, adminId, status) => {
				writes.push(['status', orderId, adminId, status]);
				return { id: orderId, status };
			},
			recordStatusHistory: async (entry) => {
				writes.push(['history', entry]);
			},
		};
		const service = createOrderService({
			orderRepository: fakeOrderRepo,
			runTransaction: (cb) => cb(undefined),
		});

		const result = await service.adminUpdateOrderStatus('admin1', 'o1', 'confirmed', 'looks good');

		assert.equal(result.status, 'confirmed');
		assert.equal(writes.length, 2);
		assert.deepEqual(writes[0], ['status', 'o1', 'admin1', 'confirmed']);
		assert.equal(writes[1][1].fromStatus, 'pending');
		assert.equal(writes[1][1].toStatus, 'confirmed');
		assert.equal(writes[1][1].reason, 'looks good');
	});

	test('adminUpdateOrderStatus rejects an illegal transition before writing anything', async () => {
		let wrote = false;
		const service = createOrderService({
			orderRepository: {
				findById: async () => ({ id: 'o1', status: 'cancelled' }),
				updateStatus: async () => {
					wrote = true;
				},
				recordStatusHistory: async () => {
					wrote = true;
				},
			},
			runTransaction: (cb) => cb(undefined),
		});

		await assert.rejects(
			() => service.adminUpdateOrderStatus('admin1', 'o1', 'confirmed'),
			/Cannot transition order/,
		);
		assert.equal(wrote, false);
	});

	test('adminUpdateOrderStatus 404s on a missing order', async () => {
		const service = createOrderService({
			orderRepository: { findById: async () => null },
		});
		await assert.rejects(() => service.adminUpdateOrderStatus('admin1', 'missing', 'confirmed'), /Order not found/);
	});

	test('cancelOrder only allows pending/confirmed orders to be cancelled', async () => {
		const service = createOrderService({
			orderRepository: {
				findByIdAndUser: async () => ({ id: 'o1', status: 'shipped' }),
				updateStatus: async () => {
					throw new Error('should not be called');
				},
			},
		});
		await assert.rejects(() => service.cancelOrder('u1', 'o1'), /Only pending or confirmed orders/);
	});

	test('cancelOrder succeeds for a pending order', async () => {
		const service = createOrderService({
			orderRepository: {
				findByIdAndUser: async () => ({ id: 'o1', status: 'pending' }),
				updateStatus: async (orderId, userId, status) => ({ id: orderId, userId, status }),
			},
		});
		const result = await service.cancelOrder('u1', 'o1');
		assert.equal(result.status, 'cancelled');
	});

	test('createOrder resolves prices from the DB, never from the client', async () => {
		const service = createOrderService({
			addressRepository: { findById: async () => ({ id: 'a1', userId: 'u1' }) },
			productRepository: {
				findByIds: async () => [{ id: 1, name: 'Widget', sku: 'W-1', basePrice: 5000, active: true }],
			},
			orderRepository: {
				create: async (userId, payload) => ({ id: 'new-order', userId, ...payload }),
			},
			emailService: { sendOrderConfirmationEmail: async () => {} },
			runTransaction: (cb) => cb(undefined),
		});

		// Client sends a crafted (wrong) unitPrice — must be ignored entirely.
		const order = await service.createOrder('u1', {
			items: [{ productId: 1, quantity: 2, unitPrice: 1 }],
			shippingAddressId: 'a1',
		});

		assert.equal(order.items[0].unitPrice, 5000);
		assert.equal(order.items[0].totalPrice, 10000);
		assert.equal(order.total, 10000);
	});

	test('createOrder rejects an inactive product', async () => {
		const service = createOrderService({
			addressRepository: { findById: async () => null },
			productRepository: {
				findByIds: async () => [{ id: 1, name: 'Widget', basePrice: 5000, active: false }],
			},
			runTransaction: (cb) => cb(undefined),
		});
		await assert.rejects(
			() => service.createOrder('u1', { items: [{ productId: 1, quantity: 1 }] }),
			/is not available/,
		);
	});

	test('createOrder rejects a non-integer quantity before touching any repo', async () => {
		const service = createOrderService({
			productRepository: {
				findByIds: async () => {
					throw new Error('should not be reached');
				},
			},
		});
		await assert.rejects(
			() => service.createOrder('u1', { items: [{ productId: 1, quantity: 1.5 }] }),
			/invalid quantity/,
		);
	});
});
