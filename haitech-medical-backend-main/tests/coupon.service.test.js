// Phase 3: lightweight-DI unit tests for coupon.service.js's money-affecting
// business rules. Fake repository, no DB — atomicIncrementUsage's real
// concurrency guarantee is a DB-level concern (already covered by its own
// transactional SQL), what's tested here is applyCoupon's *error mapping*
// around it.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscount, createCouponService } from '../src/services/coupon.service.js';

describe('calculateDiscount (pure, no DI needed)', () => {
	test('percent coupon rounds to the nearest paisa', () => {
		assert.equal(calculateDiscount({ type: 'percent', value: '10' }, 999), 100);
	});

	test('flat coupon never exceeds the order total', () => {
		assert.equal(calculateDiscount({ type: 'flat', value: '500' }, 300), 300);
		assert.equal(calculateDiscount({ type: 'flat', value: '500' }, 900), 500);
	});

	test('unknown coupon type gives no discount', () => {
		assert.equal(calculateDiscount({ type: 'bogus', value: '500' }, 900), 0);
	});
});

describe('createCouponService (fake repo injection)', () => {
	const activeCoupon = {
		id: 'c1',
		code: 'SAVE10',
		type: 'percent',
		value: '10',
		minOrderAmount: 0,
		perUserLimit: null,
	};

	test('validateCoupon rejects a coupon the repo says is not valid now', async () => {
		const service = createCouponService({
			couponRepository: { findByCode: async () => activeCoupon, isValidNow: () => false },
		});
		await assert.rejects(() => service.validateCoupon('SAVE10', 'u1', 1000), /expired or no longer valid/);
	});

	test('validateCoupon enforces minOrderAmount', async () => {
		const service = createCouponService({
			couponRepository: {
				findByCode: async () => ({ ...activeCoupon, minOrderAmount: 5000 }),
				isValidNow: () => true,
			},
		});
		await assert.rejects(() => service.validateCoupon('SAVE10', 'u1', 1000), /Minimum order amount/);
	});

	test('validateCoupon enforces the per-user limit as an early, friendly check', async () => {
		const service = createCouponService({
			couponRepository: {
				findByCode: async () => ({ ...activeCoupon, perUserLimit: 1 }),
				isValidNow: () => true,
				countUserUses: async () => 1,
			},
		});
		await assert.rejects(() => service.validateCoupon('SAVE10', 'u1', 1000), /already used this coupon/);
	});

	test('validateCoupon returns the resolved discount on success', async () => {
		const service = createCouponService({
			couponRepository: { findByCode: async () => activeCoupon, isValidNow: () => true },
		});
		const result = await service.validateCoupon('SAVE10', 'u1', 1000);
		assert.equal(result.discount, 100);
		assert.equal(result.finalTotal, 900);
	});

	test('applyCoupon maps a global max-uses race (null result) to a clear error', async () => {
		const service = createCouponService({
			couponRepository: {
				findByCode: async () => activeCoupon,
				isValidNow: () => true,
				atomicIncrementUsage: async () => null,
			},
		});
		await assert.rejects(() => service.applyCoupon('SAVE10', 'u1', 'o1', 1000), /reached its maximum usage limit/);
	});

	test('applyCoupon maps PER_USER_LIMIT_EXCEEDED thrown from inside the transaction', async () => {
		const service = createCouponService({
			couponRepository: {
				findByCode: async () => activeCoupon,
				isValidNow: () => true,
				atomicIncrementUsage: async () => {
					throw new Error('PER_USER_LIMIT_EXCEEDED');
				},
			},
		});
		await assert.rejects(() => service.applyCoupon('SAVE10', 'u1', 'o1', 1000), /already used this coupon/);
	});

	test('applyCoupon rethrows unrelated errors from atomicIncrementUsage untouched', async () => {
		const service = createCouponService({
			couponRepository: {
				findByCode: async () => activeCoupon,
				isValidNow: () => true,
				atomicIncrementUsage: async () => {
					throw new Error('boom');
				},
			},
		});
		await assert.rejects(() => service.applyCoupon('SAVE10', 'u1', 'o1', 1000), /boom/);
	});
});
