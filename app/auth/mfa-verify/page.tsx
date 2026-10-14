import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import MfaVerifyForm from "@/components/auth/MfaVerifyForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
    title: "Verify Identity",
    robots: { index: false, follow: true },
};

export default function MfaVerifyPage() {
    return (
        <AuthLayout
            title="Two-factor verification"
            subtitle="Enter the 6-digit code from your authenticator app"
            showHighlights={false}
            icon={
                <span className="bg-primary-50 flex h-12 w-12 items-center justify-center rounded-full">
                    <ShieldCheck className="text-primary-700 h-6 w-6" aria-hidden="true" />
                </span>
            }
        >
            <MfaVerifyForm />
        </AuthLayout>
    );
}
