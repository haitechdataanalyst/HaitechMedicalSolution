// Pure Joi-schema tests — no app boot, no DB, no Redis. These exist to prove
// the input-validation boundary actually rejects malicious/malformed input
// BEFORE it can reach a controller or query builder, independent of whether
// a live database is reachable in the current environment.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import Joi from 'joi';
import {
	adminPaymentTransactionsSchema,
	adminUpdateInventorySchema,
} from '../src/validations/admin.validation.js';
import { listProductsSchema, productIdSchema, compareProductsSchema } from '../src/validations/products.validation.js';

// Mirrors how validation.middleware.js actually compiles/validates a schema,
// so these tests exercise the real Joi behavior, not a re-implementation.
const runQuery = (schema, query) => Joi.compile(schema.query).prefs({ abortEarly: false, allowUnknown: false }).validate(query);
const runParams = (schema, params) => Joi.compile(schema.params).prefs({ abortEarly: false, allowUnknown: false }).validate(params);
const runBody = (schema, body) => Joi.compile(schema.body).prefs({ abortEarly: false, allowUnknown: false }).validate(body);

describe('admin payment-transactions validation (Phase 1 SQL-injection fix)', () => {
	test('rejects a SQL-injection-shaped orderId', () => {
		const { error } = runQuery(adminPaymentTransactionsSchema, {
			orderId: "' OR '1'='1",
		});
		assert.ok(error, 'expected validation to reject a non-UUID orderId');
	});

	test('rejects a stacked-query-shaped userId', () => {
		const { error } = runQuery(adminPaymentTransactionsSchema, {
			userId: "1'; DROP TABLE payment_transactions; --",
		});
		assert.ok(error, 'expected validation to reject a non-UUID userId');
	});

	test('accepts a well-formed request', () => {
		const { error, value } = runQuery(adminPaymentTransactionsSchema, {
			page: '2',
			limit: '10',
			orderId: '11111111-1111-4111-8111-111111111111',
		});
		assert.equal(error, undefined);
		assert.equal(value.page, 2);
		assert.equal(value.limit, 10);
	});

	test('accepts a request with no filters at all', () => {
		const { error } = runQuery(adminPaymentTransactionsSchema, {});
		assert.equal(error, undefined);
	});
});

describe('admin inventory update validation', () => {
	test('rejects a non-numeric productId param', () => {
		const { error } = runParams(adminUpdateInventorySchema, { productId: "1 OR 1=1" });
		assert.ok(error, 'expected non-numeric productId to be rejected');
	});

	test('rejects a body with neither quantity nor reservedQuantity', () => {
		const { error } = runBody(adminUpdateInventorySchema, {});
		assert.ok(error, 'expected at-least-one-of validation to fire');
	});

	test('rejects a negative quantity', () => {
		const { error } = runBody(adminUpdateInventorySchema, { quantity: -5 });
		assert.ok(error, 'expected negative quantity to be rejected');
	});

	test('accepts a valid partial update', () => {
		const { error } = runBody(adminUpdateInventorySchema, { quantity: 10 });
		assert.equal(error, undefined);
	});
});

describe('products list validation', () => {
	test('rejects an out-of-range page size', () => {
		const { error } = runQuery(listProductsSchema, { limit: '999999' });
		assert.ok(error, 'expected an oversized limit to be capped/rejected');
	});

	test('rejects a non-numeric category filter', () => {
		const { error } = runQuery(listProductsSchema, { category: 'DROP TABLE products' });
		assert.ok(error, 'expected a non-numeric category id to be rejected');
	});

	test('accepts a normal listing request', () => {
		const { error, value } = runQuery(listProductsSchema, { page: '1', limit: '20', sort: 'price_asc' });
		assert.equal(error, undefined);
		assert.equal(value.sort, 'price_asc');
	});

	test('rejects an unrecognized sort value', () => {
		const { error } = runQuery(listProductsSchema, { sort: 'hack_the_planet' });
		assert.ok(error, 'expected an unknown sort value to be rejected');
	});
});

describe('product id / compare validation', () => {
	test('rejects an overlong id param (payload-size guard)', () => {
		const { error } = runParams(productIdSchema, { id: 'a'.repeat(500) });
		assert.ok(error, 'expected an overlong id to be rejected');
	});

	test('accepts a slug-shaped id', () => {
		const { error } = runParams(productIdSchema, { id: 'admetec-loupe-3x' });
		assert.equal(error, undefined);
	});

	test('accepts a numeric id', () => {
		const { error } = runParams(productIdSchema, { id: '101' });
		assert.equal(error, undefined);
	});

	test('rejects a missing ids param on compare', () => {
		const { error } = runQuery(compareProductsSchema, {});
		assert.ok(error, 'expected ids to be required');
	});
});
