import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

export const metadata: Metadata = {
    title: "Sign In",
    robots: { index: false, follow: true },
    description: "Sign in to your Haitech Medical account.",
};

interface LoginPageProps {
    searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your Haitech account to manage orders"
            footer={
                <p className="mt-6 flex items-center justify-center gap-2 px-2 text-center text-[13px] text-neutral-500">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    Session verified on every request — never stored in the browser
                </p>
            }
        >
            {params.message === "check-email" && (
                <AuthAlert tone="info" className="mb-5">
                    Check your email to confirm your account before signing in.
                </AuthAlert>
            )}
            {params.error && (
                <AuthAlert tone="error" className="mb-5">
                    {params.error}
                </AuthAlert>
            )}

            <LoginForm next={params.next} />
        </AuthLayout>
    );
}
