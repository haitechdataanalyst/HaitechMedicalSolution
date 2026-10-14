import { headers } from "next/headers";

/**
 * Resolves the real client IP from the incoming request's X-Forwarded-For
 * header, using the rightmost value (set by our own trusted proxy/CDN) —
 * not the leftmost, which is client-supplied and trivially spoofable.
 * Shared by all three lead-capture Server Actions so they derive IP
 * identically before forwarding it to the backend.
 */
export async function getTrustedClientIp(): Promise<string | null> {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const parts =
        forwardedFor
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) ?? [];
    return parts[parts.length - 1] || null;
}

export async function getClientUserAgent(): Promise<string | null> {
    const headersList = await headers();
    return headersList.get("user-agent");
}
