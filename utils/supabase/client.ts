import { createBrowserClient } from "@supabase/ssr";

// Returns null (instead of throwing) when Supabase isn't configured for this
// deployment, so a missing/misconfigured env var degrades to "auth features
// disabled" rather than crashing every page — AuthProvider wraps the entire
// app, so an uncaught throw here takes down pages that need no auth at all.
export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        if (typeof window !== "undefined") {
            console.warn(
                "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing) — sign-in and account features are disabled."
            );
        }
        return null;
    }

    return createBrowserClient(url, anonKey);
}
