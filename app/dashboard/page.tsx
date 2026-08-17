import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";

export const metadata: Metadata = {
    title: "Dashboard | Haitech Medical",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
    const params = await searchParams;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
                    <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Your account</h1>
                    <p className="mb-6 text-sm text-neutral-500">{user.email}</p>

                    {params.message === "password-updated" && (
                        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            Password updated successfully.
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/dashboard/update-password"
                            className="flex items-center gap-2.5 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            <KeyRound className="h-4 w-4 text-neutral-400" />
                            Change password
                        </Link>

                        <form action={signOut}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2.5 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
