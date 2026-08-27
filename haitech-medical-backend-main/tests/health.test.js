import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { closeDB } from '../src/config/index.js';

let server;
let port;

before(async () => {
	await new Promise((resolve) => {
		server = app.listen(0, '127.0.0.1', resolve);
	});
	port = server.address().port;
});

after(async () => {
	await new Promise((resolve, reject) => {
		server.close((err) => (err ? reject(err) : resolve()));
	});
	await closeDB();
});

const url = (path) => `http://127.0.0.1:${port}${path}`;

describe('GET /health/live', () => {
	test('returns 200 with alive status and process info', async () => {
		const res = await fetch(url('/health/live'));
		assert.equal(res.status, 200);

		const body = await res.json();
		assert.equal(body.success, true);
		assert.equal(body.statusCode, 200);
		assert.equal(body.data.status, 'alive');
		assert.equal(typeof body.data.uptime, 'number');
		assert.ok(body.data.uptime > 0);
		assert.equal(typeof body.data.memory.heapUsed, 'number');
		assert.equal(typeof body.data.memory.heapTotal, 'number');
		assert.equal(typeof body.data.memory.rss, 'number');
	});

	test('response shape has required envelope fields', async () => {
		const body = await fetch(url('/health/live')).then((r) => r.json());
		assert.ok('timestamp' in body);
		assert.ok('statusCode' in body);
		assert.ok('success' in body);
		assert.ok('data' in body);
		assert.match(body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
	});
});

describe('GET /health/ready', () => {
	test('returns valid dependency status (200 or 503)', async () => {
		const res = await fetch(url('/health/ready'));
		assert.ok(
			[200, 503].includes(res.status),
			`Expected 200 or 503, got ${res.status}`
		);

		const body = await res.json();
		assert.ok(typeof body.data.status === 'string');
		assert.ok(typeof body.data.dependencies === 'object');
		assert.ok('database' in body.data.dependencies);
		assert.ok('redis' in body.data.dependencies);
		assert.ok(['healthy', 'unhealthy'].includes(body.data.dependencies.database.status));
		assert.ok(['healthy', 'unhealthy'].includes(body.data.dependencies.redis.status));
	});

	test('degraded response still returns success:false when 503', async () => {
		const res = await fetch(url('/health/ready'));
		const body = await res.json();
		if (res.status === 503) {
			assert.equal(body.success, false);
			assert.equal(body.data.status, 'not ready');
		} else {
			assert.equal(body.success, true);
			assert.equal(body.data.status, 'ready');
		}
	});
});

describe('GET /api/versions', () => {
	test('returns supported API version list', async () => {
		const res = await fetch(url('/api/versions'));
		assert.equal(res.status, 200);

		const body = await res.json();
		assert.equal(body.success, true);
		assert.ok(Array.isArray(body.data.supported));
		assert.ok(body.data.supported.length > 0);
		assert.equal(typeof body.data.default, 'string');
		assert.ok(body.data.supported.includes(body.data.default));
	});
});

describe('Unknown routes', () => {
	test('returns 404 for unregistered paths', async () => {
		const res = await fetch(url('/not-a-real-endpoint'));
		assert.equal(res.status, 404);

		const body = await res.json();
		assert.equal(body.success, false);
		assert.equal(body.statusCode, 404);
	});

	test('returns 404 for unknown API paths', async () => {
		const res = await fetch(url('/api/v1/does-not-exist'));
		assert.equal(res.status, 404);
	});
});
