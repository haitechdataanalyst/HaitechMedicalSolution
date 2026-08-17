import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import MfaVerifyForm from "@/components/auth/MfaVerifyForm";

export const metadata: Metadata = {
    title: "Verify Identity | Haitech Medical",
};

export default function MfaVerifyPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
                        <ShieldCheck className="h-5 w-5 text-primary-600" />
                    </div>
                    <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Two-factor verification</h1>
                    <p className="mb-6 text-sm text-neutral-500">Enter the 6-digit code from your authenticator app</p>

                    <MfaVerifyForm />
                </div>
            </div>
        </main>
    );
}
