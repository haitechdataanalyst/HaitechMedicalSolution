import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
    title: "Reset Password | Haitech Medical",
    description: "Reset your Haitech Medical account password.",
};

interface ForgotPasswordPageProps {
    searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
    const params = await searchParams;

    return (
        <AuthLayout title="Forgot your password?" subtitle="We'll email you a link to reset it">
            {params.message === "check-email" && (
                <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700" role="status">
                    If an account exists for that email, a reset link is on its way.
                </div>
            )}
            {params.error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                    {params.error}
                </div>
            )}

            <ForgotPasswordForm />
        </AuthLayout>
    );
}
