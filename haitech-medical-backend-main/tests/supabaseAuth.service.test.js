// Phase 4: lightweight-DI unit tests for supabaseAuth.service.js — the
// resolver that makes Supabase the sole identity source. Fake Supabase
// client + fake user repository, no network call and no DB.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSupabaseAuthService } from '../src/services/supabaseAuth.service.js';

describe('createSupabaseAuthService (fake client + repo injection)', () => {
	test('verifySupabaseToken rejects when Supabase returns an error', async () => {
		const service = createSupabaseAuthService({
			supabaseClient: { auth: { getUser: async () => ({ data: null, error: { message: 'bad token' } }) } },
		});
		await assert.rejects(() => service.verifySupabaseToken('bogus'), /Invalid or expired session/);
	});

	test('verifySupabaseToken throws a clear error when unconfigured', async () => {
		const service = createSupabaseAuthService({ supabaseClient: null });
		await assert.rejects(() => service.verifySupabaseToken('any'), /not configured/);
	});

	test('verifySupabaseToken returns the Supabase user on success', async () => {
		const supabaseUser = { id: 'sb-1', email: 'a@example.com' };
		const service = createSupabaseAuthService({
			supabaseClient: { auth: { getUser: async () => ({ data: { user: supabaseUser }, error: null }) } },
		});
		const result = await service.verifySupabaseToken('good-token');
		assert.deepEqual(result, supabaseUser);
	});

	test('resolveLocalUser returns the existing row when already linked by supabaseId', async () => {
		const service = createSupabaseAuthService({
			userRepository: {
				findBySupabaseId: async (id) => (id === 'sb-1' ? { id: 'local-1', supabaseId: 'sb-1' } : null),
			},
		});
		const user = await service.resolveLocalUser({ id: 'sb-1', email: 'a@example.com' });
		assert.equal(user.id, 'local-1');
	});

	test('resolveLocalUser links a pre-migration row found by email instead of creating a duplicate', async () => {
		let linked = null;
		const service = createSupabaseAuthService({
			userRepository: {
				findBySupabaseId: async () => null,
				findByEmail: async (email) => (email === 'legacy@example.com' ? { id: 'legacy-1' } : null),
				updateDetailsByUserId: async (id, data) => {
					linked = { id, ...data };
				},
				create: async () => {
					throw new Error('should not create a new user when an email match exists');
				},
			},
		});

		const user = await service.resolveLocalUser({ id: 'sb-2', email: 'legacy@example.com' });

		assert.equal(user.id, 'legacy-1');
		assert.equal(user.supabaseId, 'sb-2');
		assert.deepEqual(linked, { id: 'legacy-1', supabaseId: 'sb-2' });
	});

	test('resolveLocalUser JIT-provisions a new row when no match exists, using a unique username', async () => {
		const existingUsernames = new Set(['newuser']);
		const created = [];
		const service = createSupabaseAuthService({
			userRepository: {
				findBySupabaseId: async () => null,
				findByEmail: async () => null,
				findByUsername: async (u) => (existingUsernames.has(u) ? { id: 'someone-else' } : null),
				create: async (data) => {
					created.push(data);
					return { id: 'new-local-1', ...data };
				},
			},
		});

		const user = await service.resolveLocalUser({
			id: 'sb-3',
			email: 'newuser@example.com',
			email_confirmed_at: '2024-01-01T00:00:00Z',
		});

		assert.equal(user.id, 'new-local-1');
		assert.equal(created[0].supabaseId, 'sb-3');
		assert.equal(created[0].authProvider, 'supabase');
		assert.equal(created[0].emailVerified, true);
		// "newuser" is already taken, so it must fall back to a numeric suffix.
		assert.equal(created[0].username, 'newuser1');
	});
});
