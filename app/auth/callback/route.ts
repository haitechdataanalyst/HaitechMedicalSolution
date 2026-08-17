import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Only ever redirect to a same-site relative path — an attacker-controlled
// `next` value pointing off-site would turn this into an open redirect.
function safeRedirectPath(path: string | null): string {
    if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
    return path;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = safeRedirectPath(searchParams.get("next"));

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Missing authorization code")}`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    return NextResponse.redirect(`${origin}${next}`);
}
