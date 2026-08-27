import { createClient } from '@supabase/supabase-js';
import env from './config.js';

// Verifies frontend-issued Supabase access tokens (see supabaseAuth.service.js).
// The public anon key is sufficient here: supabase.auth.getUser(token) sends
// the caller's own token as its bearer credential to Supabase's Auth server —
// no service-role key needed. `null` when unconfigured so the app can still
// boot (see environment.validation.js's warning) in environments without it.
export const supabase =
	env.SUPABASE.URL && env.SUPABASE.ANON_KEY
		? createClient(env.SUPABASE.URL, env.SUPABASE.ANON_KEY, {
				auth: { persistSession: false, autoRefreshToken: false },
			})
		: null;

export default supabase;
