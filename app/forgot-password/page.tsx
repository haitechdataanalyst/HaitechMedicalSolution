"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail]         = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent]           = useState(false);
    const [error, setError]         = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        await authApi.forgotPassword(email.trim().toLowerCase());
        setIsLoading(false);

        // Always show success — backend never reveals if email is registered
        setSent(true);
    };

    if (sent) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900">Check your inbox</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        If <span className="font-medium text-neutral-700">{email}</span> is registered,
                        you&apos;ll receive a password reset link within a few minutes.
                    </p>
                    <p className="mt-3 text-xs text-neutral-400">
                        Didn&apos;t get it? Check your spam folder or try again.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={() => { setSent(false); setEmail(""); }}
                            className="w-full rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
                        >
                            Try a different email
                        </button>
                        <Link
                            href="/login"
                            className="w-full rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white text-center shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0]"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">

                {/* Logo */}
                <Link href="/" className="mb-8 flex items-center gap-3">
                    <Image src="/haitech-medical.png" alt="Haitech" width={36} height={36} />
                    <div>
                        <p className="text-sm font-bold leading-none text-neutral-900">Haitech</p>
                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1fb6cd]">
                            Medical Solutions Pvt. Ltd.
                        </p>
                    </div>
                </Link>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1fb6cd]/10">
                    <Mail className="h-6 w-6 text-[#1fb6cd]" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900">Forgot password?</h1>
                <p className="mt-1.5 text-sm text-neutral-500">
                    Enter your registered email and we&apos;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[#1fb6cd] focus:outline-none focus:ring-2 focus:ring-[#1fb6cd]/20"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0] disabled:opacity-60"
                    >
                        {isLoading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Sending…
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Reset Link
                            </>
                        )}
                    </button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Sign In
                    </Link>
                </form>
            </div>
        </main>
    );
}
