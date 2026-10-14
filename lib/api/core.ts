import { createClient } from "@/utils/supabase/client";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
// Longest a browser request may wait on the backend before it is abandoned
const REQUEST_TIMEOUT_MS = 30_000;

export type ApiResponse<T = unknown> = {
    timestamp: string;
    statusCode: number;
    status: number;
    success: boolean;
    message: string;
    data?: T;
    error?: T;
    meta?: Record<string, unknown>;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

// ── Token sourcing (Supabase is the sole identity source — see AuthProvider) ──
// Supabase's browser client auto-refreshes the session in the background, so
// getSession() reliably returns a current token without a custom 401-retry
// dance like the old localStorage-token flow needed.
const getSupabaseAccessToken = async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
};

// ── Core fetch ───────────────────────────────────────────────────────────────

export type FetchOptions = RequestInit & {
    skipAuth?: boolean;
};

export const apiFetch = async <T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    const { skipAuth = false, headers: extraHeaders, ...rest } = options;

    const token = skipAuth ? null : await getSupabaseAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Api-Key": API_KEY } : {}),
        ...(extraHeaders as Record<string, string>),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        ...rest,
        credentials: "include",
        headers,
    });

    try {
        return (await res.json()) as ApiResponse<T>;
    } catch {
        // A gateway error page or empty body isn't JSON — report it in the normal response shape instead of throwing a parse error.
        return {
            timestamp: new Date().toISOString(),
            statusCode: res.status,
            status: res.status,
            success: false,
            message: "The server returned an unexpected response. Please try again.",
        };
    }
};
