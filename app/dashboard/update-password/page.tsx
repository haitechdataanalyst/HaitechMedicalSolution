import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
    title: "Update Password | Haitech Medical",
};

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16">
            <div className="w-full max-w-md">
                <Link href="/dashboard" className="mb-8 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-primary-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Dashboard
                </Link>

                <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
                    <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Set a new password</h1>
                    <p className="mb-6 text-sm text-neutral-500">Choose a strong password you haven&apos;t used elsewhere</p>

                    {params.error && (
                        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                            {params.error}
                        </div>
                    )}

                    <UpdatePasswordForm />
                </div>
            </div>
        </main>
    );
}
