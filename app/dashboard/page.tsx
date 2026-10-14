import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, KeyRound, LogOut } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import AuthAlert from "@/components/auth/AuthAlert";

export const metadata: Metadata = {
    title: "Dashboard",
    robots: { index: false, follow: true },
};

const ROW =
    "flex min-h-14 w-full items-center gap-3 px-5 text-left text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500";

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
        <main className="flex min-h-[70vh] justify-center bg-neutral-50 px-4 py-16 sm:px-6 md:py-24">
            <div className="w-full max-w-md">
                <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900">Your account</h1>
                <p className="mt-2 truncate text-[15px] text-neutral-500">{user.email}</p>

                {params.message === "password-updated" && (
                    <AuthAlert tone="success" className="mt-6">
                        Password updated successfully.
                    </AuthAlert>
                )}

                <div className={`${SURFACE_CARD} mt-8 divide-y divide-neutral-900/[0.06] overflow-hidden`}>
                    <Link href="/dashboard/update-password" className={`${ROW} text-neutral-800 hover:bg-neutral-900/[0.03]`}>
                        <KeyRound className="h-[18px] w-[18px] text-neutral-500" aria-hidden="true" />
                        <span className="flex-1">Change password</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                    </Link>

                    <form action={signOut}>
                        <button type="submit" className={`${ROW} text-red-700 hover:bg-red-50`}>
                            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
