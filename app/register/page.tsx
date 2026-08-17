import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
    title: "Create Account | Haitech Medical",
    description: "Create a Haitech Medical account.",
};

interface RegisterPageProps {
    searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
    const params = await searchParams;
    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up to manage orders and quote requests"
            footer={
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Session verified on every request — never stored in the browser
                </div>
            }
        >
            {params.message === "check-email" && (
                <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700" role="status">
                    Almost there — check your email for a confirmation link to activate your account.
                </div>
            )}
            {params.error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                    {params.error}
                </div>
            )}

            <RegisterForm turnstileSiteKey={turnstileSiteKey} />
        </AuthLayout>
    );
}
