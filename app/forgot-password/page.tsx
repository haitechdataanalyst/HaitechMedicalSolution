import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata: Metadata = {
    title: "Reset Password",
    robots: { index: false, follow: true },
    description: "Reset your Haitech Medical account password.",
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout title="Forgot your password?" subtitle="We'll email you a link to reset it" showHighlights={false}>
            <AuthNotice checkEmail="If an account exists for that email, a reset link is on its way." />

            <ForgotPasswordForm />
        </AuthLayout>
    );
}
