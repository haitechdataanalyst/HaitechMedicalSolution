// Same-site redirect targets only. A `next` value comes from the URL, so it is untrusted:
// anything that could leave the site (absolute URLs, "//host", "/\host", control characters)
// falls back to the default.
export function safeNextPath(raw: string | null | undefined, fallback = "/"): string {
    if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
    if (/[\u0000-\u001f\u007f]/.test(raw)) return fallback;
    try {
        const parsed = new URL(raw, "http://local.invalid");
        return parsed.origin === "http://local.invalid" ? parsed.pathname + parsed.search + parsed.hash : fallback;
    } catch {
        return fallback;
    }
}
