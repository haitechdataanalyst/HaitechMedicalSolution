import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

export const metadata: Metadata = {
    title: "Reset Password",
    robots: { index: false, follow: true },
    description: "Reset your Haitech Medical account password.",
};

interface ForgotPasswordPageProps {
    searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
    const params = await searchParams;

    return (
        <AuthLayout title="Forgot your password?" subtitle="We'll email you a link to reset it" showHighlights={false}>
            {params.message === "check-email" && (
                <AuthAlert tone="info" className="mb-5">
                    If an account exists for that email, a reset link is on its way.
                </AuthAlert>
            )}
            {params.error && (
                <AuthAlert tone="error" className="mb-5">
                    {params.error}
                </AuthAlert>
            )}

            <ForgotPasswordForm />
        </AuthLayout>
    );
}
