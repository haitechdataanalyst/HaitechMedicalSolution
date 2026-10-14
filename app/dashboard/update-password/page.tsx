import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata: Metadata = {
    title: "Update Password",
    robots: { index: false, follow: true },
};

export default function UpdatePasswordPage() {
    return (
        <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used elsewhere" showHighlights={false} backHref="/dashboard" backLabel="Dashboard">
            <AuthNotice />

            <UpdatePasswordForm />
        </AuthLayout>
    );
}
