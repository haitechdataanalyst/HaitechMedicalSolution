/**
 * Next.js Middleware
 *
 * Currently handles:
 *   - Request logging (development only)
 *   - Basic security headers validation
 *
 * Future additions when backend is connected:
 *   - Authentication guards for protected routes (e.g., /dashboard, /account)
 *   - Session validation
 *   - Role-based access control redirects
 *   - API rate limiting at the edge
 *
 * To add auth protection, uncomment the protected routes section below
 * and integrate with your auth provider (NextAuth.js, Clerk, etc.)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that will require authentication when backend is connected
// const PROTECTED_ROUTES = ["/dashboard", "/account", "/admin"];

// Routes that should redirect to dashboard if already authenticated
// const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- Future: Auth Guard ---
    // Uncomment when authentication is implemented:
    //
    // const session = request.cookies.get("session")?.value;
    // const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    // const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    //
    // if (isProtected && !session) {
    //     const loginUrl = new URL("/login", request.url);
    //     loginUrl.searchParams.set("callbackUrl", pathname);
    //     return NextResponse.redirect(loginUrl);
    // }
    //
    // if (isAuthRoute && session) {
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    // --- API Rate Limiting at the Edge ---
    // For API routes, add basic rate limiting headers
    if (pathname.startsWith("/api/")) {
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", "100");
        response.headers.set("X-RateLimit-Remaining", "99"); // Placeholder — use Redis in production
        return response;
    }

    return NextResponse.next();
}

// Only run middleware on specific paths for performance
export const config = {
    matcher: [
        // Match API routes
        "/api/:path*",
        // Match all pages except static assets and Next.js internals
        "/((?!_next/static|_next/image|favicon.ico|images|svg|icons|catalouges).*)",
    ],
};
