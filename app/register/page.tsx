import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata: Metadata = {
    title: "Create Account",
    robots: { index: false, follow: true },
    description: "Create a Haitech Medical account.",
};

export default function RegisterPage() {
    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up to manage orders and quote requests"
            footer={
                <p className="mt-6 flex items-center justify-center gap-2 px-2 text-center text-[13px] text-neutral-500">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    Session verified on every request — never stored in the browser
                </p>
            }
        >
            <AuthNotice checkEmail="Almost there — check your email for a confirmation link to activate your account." />

            <RegisterForm turnstileSiteKey={turnstileSiteKey} />
        </AuthLayout>
    );
}
