/**
 * Next.js Proxy (formerly Middleware)
 *
 * Handles:
 *   - API rate-limit headers
 *   - Supabase session refresh on every request, and auth guards for
 *     protected routes (/dashboard)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/dashboard"];

async function refreshSupabaseSession(request: NextRequest): Promise<NextResponse> {
    let response = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Supabase Auth isn't configured yet on this environment — skip rather
    // than throwing on every request.
    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
        },
    });

    // getUser() re-validates the JWT against Supabase rather than trusting
    // the cookie's contents outright — the correct check to run in proxy.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtected && !user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- API Rate Limiting at the Edge ---
    if (pathname.startsWith("/api/")) {
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", "100");
        response.headers.set("X-RateLimit-Remaining", "99"); // Placeholder — use Redis in production
        return response;
    }

    return refreshSupabaseSession(request);
}

// Only run on specific paths for performance
export const config = {
    matcher: [
        // Match API routes
        "/api/:path*",
        // Match all pages except static assets and Next.js internals
        "/((?!_next/static|_next/image|favicon.ico|images|svg|icons|catalouges).*)",
    ],
};
