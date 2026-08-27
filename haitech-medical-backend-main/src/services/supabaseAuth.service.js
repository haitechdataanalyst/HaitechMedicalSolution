import { supabase as defaultSupabaseClient } from '../config/index.js';
import { userRepository } from '../repositories/index.js';
import { authProviders, roleCodes } from '../constants/index.js';
import { unauthorizedError, internalError } from '../utils/index.js';

// Phase 4: Supabase is the sole identity source. The Express backend no
// longer issues or verifies its own JWTs (see auth.middleware.js) — it only
// verifies frontend-issued Supabase access tokens against Supabase's own
// Auth server, then resolves/JIT-provisions a local `users` row to anchor
// this app's existing business tables (orders, cart, etc. all FK to
// users.id, unchanged). See [[feedback_architecture_policy]].

const usernameFromEmail = (email) => email.split('@')[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';

// ── Lightweight DI ────────────────────────────────────────────────────────────
export const createSupabaseAuthService = ({
	supabaseClient = defaultSupabaseClient,
	userRepository: userRepo = userRepository,
} = {}) => {
	// Verifies a Supabase-issued access token against Supabase's Auth server.
	// Returns the raw Supabase user object ({ id, email, user_metadata, ... }) —
	// never a local users.id.
	const verifySupabaseToken = async (accessToken) => {
		if (!supabaseClient) {
			throw internalError('Supabase auth is not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)');
		}

		const { data, error } = await supabaseClient.auth.getUser(accessToken);
		if (error || !data?.user) {
			throw unauthorizedError('Invalid or expired session');
		}

		return data.user;
	};

	// Generates a unique username from the email's local part, deduping with a
	// numeric suffix — mirrors auth.service.js's resolveUniqueGoogleUsername.
	const resolveUniqueUsername = async (email) => {
		const seed = usernameFromEmail(email).slice(0, 45);

		let suffix = 0;
		while (suffix < 100) {
			const candidate = suffix === 0 ? seed : `${seed}${suffix}`;
			const existing = await userRepo.findByUsername(candidate);
			if (!existing) return candidate;
			suffix += 1;
		}

		return `user${Date.now()}`;
	};

	// Resolves (or JIT-provisions) the local `users` row for a verified
	// Supabase identity:
	//   1. Already linked (supabaseId matches) → return it.
	//   2. A pre-migration row with the same email exists → link it (one-time).
	//   3. Otherwise → create a new row.
	const resolveLocalUser = async (supabaseUser) => {
		const bySupabaseId = await userRepo.findBySupabaseId(supabaseUser.id);
		if (bySupabaseId) return bySupabaseId;

		const byEmail = await userRepo.findByEmail(supabaseUser.email);
		if (byEmail) {
			await userRepo.updateDetailsByUserId(byEmail.id, { supabaseId: supabaseUser.id });
			return { ...byEmail, supabaseId: supabaseUser.id };
		}

		const meta = supabaseUser.user_metadata || {};
		const username = await resolveUniqueUsername(supabaseUser.email);

		return userRepo.create({
			email: supabaseUser.email,
			username,
			firstName: meta.firstName || meta.first_name || usernameFromEmail(supabaseUser.email),
			lastName: meta.lastName || meta.last_name || '',
			phone: meta.phone || null,
			supabaseId: supabaseUser.id,
			authProvider: authProviders.SUPABASE,
			defaultRoleCode: roleCodes.USER,
			emailVerified: !!supabaseUser.email_confirmed_at,
		});
	};

	return { verifySupabaseToken, resolveLocalUser };
};

const defaultSupabaseAuthService = createSupabaseAuthService();
export const { verifySupabaseToken, resolveLocalUser } = defaultSupabaseAuthService;

const supabaseAuthService = { ...defaultSupabaseAuthService, createSupabaseAuthService };
export default supabaseAuthService;
