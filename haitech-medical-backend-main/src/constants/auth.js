export const authProviders = Object.freeze({
	LOCAL: 'local',
	GOOGLE: 'google',
	HYBRID: 'hybrid',
	// Users JIT-provisioned or linked via a verified Supabase session — see
	// supabaseAuth.service.js. Supabase is the sole identity source as of
	// Phase 4; LOCAL/GOOGLE/HYBRID rows predate that and are no longer created.
	SUPABASE: 'supabase',
});

export const roleCodes = Object.freeze({
	USER: 'user',
	ADMIN: 'admin',
});
