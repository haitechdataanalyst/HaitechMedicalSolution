import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata: Metadata = {
    title: "Sign In",
    robots: { index: false, follow: true },
    description: "Sign in to your Haitech Medical account.",
};

export default function LoginPage() {
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
            <AuthNotice checkEmail="Check your email to confirm your account before signing in." />

            <LoginForm />
        </AuthLayout>
    );
}
