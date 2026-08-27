// Phase 3: lightweight-DI unit tests for payment.service.js's refund guards
// and admin transaction listing. createPaymentOrder/verifyPayment/webhook
// handling are deliberately NOT unit tested here — their entire value is
// SELECT-FOR-UPDATE row locking under real concurrency (a documented
// repository-bypass exception for payment code), which only a real Postgres
// integration test can meaningfully exercise.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createPaymentService } from '../src/services/payment.service.js';

describe('createPaymentService (fake repo injection)', () => {
	test('initiateRefund 404s on a missing order', async () => {
		const service = createPaymentService({ orderRepository: { findById: async () => null } });
		await assert.rejects(() => service.initiateRefund('missing'), /Order not found/);
	});

	test('initiateRefund refuses to refund an unpaid order', async () => {
		const service = createPaymentService({
			orderRepository: { findById: async () => ({ id: 'o1', paymentStatus: 'unpaid', total: 1000 }) },
		});
		await assert.rejects(() => service.initiateRefund('o1'), /has not been paid/);
	});

	test('initiateRefund refuses when there is no Razorpay payment id on record', async () => {
		const service = createPaymentService({
			orderRepository: { findById: async () => ({ id: 'o1', paymentStatus: 'paid', total: 1000, razorpayPaymentId: null }) },
		});
		await assert.rejects(() => service.initiateRefund('o1'), /No Razorpay payment ID/);
	});

	test('initiateRefund rejects a refund amount larger than the order total', async () => {
		const service = createPaymentService({
			orderRepository: {
				findById: async () => ({ id: 'o1', paymentStatus: 'paid', total: 1000, razorpayPaymentId: 'pay_1' }),
			},
		});
		await assert.rejects(() => service.initiateRefund('o1', 5000), /exceeds order total/);
	});

	test('initiateRefund rejects a non-positive refund amount', async () => {
		const service = createPaymentService({
			orderRepository: {
				findById: async () => ({ id: 'o1', paymentStatus: 'paid', total: 1000, razorpayPaymentId: 'pay_1' }),
			},
		});
		await assert.rejects(() => service.initiateRefund('o1', 0), /must be a positive number/);
	});

	test('adminListTransactions paginates via the injected repository', async () => {
		const service = createPaymentService({
			paymentTransactionRepository: {
				findMany: async ({ limit, offset }) => {
					assert.equal(limit, 20);
					assert.equal(offset, 20);
					return { rows: [{ id: 't1' }], total: 45 };
				},
			},
		});
		const result = await service.adminListTransactions({ page: 2, limit: 20 });
		assert.equal(result.transactions.length, 1);
		assert.equal(result.meta.totalPages, 3);
	});
});
