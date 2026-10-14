import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

export const metadata: Metadata = {
    title: "Update Password",
    robots: { index: false, follow: true },
};

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;

    return (
        <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used elsewhere" showHighlights={false} backHref="/dashboard" backLabel="Dashboard">
            {params.error && (
                <AuthAlert tone="error" className="mb-5">
                    {params.error}
                </AuthAlert>
            )}

            <UpdatePasswordForm />
        </AuthLayout>
    );
}
