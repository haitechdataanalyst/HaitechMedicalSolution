"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2, RefreshCcw } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email) { setError("Please enter your email address."); return; }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setIsLoading(false);
        setSent(true);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30 px-4 py-16">
            {/* Card */}
            <div className="w-full max-w-md">
                {/* Back link */}
                <Link
                    href="/login"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-primary-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </Link>

                <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-lg">
                    {/* Top accent */}
                    <div className="h-1.5 bg-brand-gradient" />

                    <div className="p-8 sm:p-10">
                        {!sent ? (
                            <>
                                {/* Icon */}
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                                        <Mail className="h-8 w-8 text-primary-500" />
                                    </div>
                                </div>

                                {/* Heading */}
                                <div className="mb-8 text-center">
                                    <h1 className="heading-2 mb-2">Forgot password?</h1>
                                    <p className="text-neutral-500">
                                        No worries — enter your email and we&apos;ll send you a reset link.
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="form-label" htmlFor="email">
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            autoComplete="email"
                                            className="form-input"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Sending link…
                                            </span>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-sm text-neutral-400">
                                    Remember your password?{" "}
                                    <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        ) : (
                            /* Success state */
                            <div className="text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                </div>

                                <h2 className="heading-2 mb-3">Check your inbox</h2>
                                <p className="mb-2 text-neutral-500">
                                    We&apos;ve sent a password reset link to
                                </p>
                                <p className="mb-6 font-semibold text-neutral-900">{email}</p>
                                <p className="mb-8 text-sm text-neutral-400">
                                    The link expires in 30 minutes. Check your spam folder if you don&apos;t see it.
                                </p>

                                <button
                                    onClick={() => { setSent(false); setEmail(""); }}
                                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Send to a different email
                                </button>

                                <Link
                                    href="/login"
                                    className="btn btn-primary btn-lg w-full rounded-full"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logo + security */}
                <div className="mt-8 flex flex-col items-center gap-3">
                    <Image
                        src="/haitech_medical_logo.png"
                        alt="Haitech Medical"
                        width={130}
                        height={27}
                        className="h-auto opacity-50"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Secured with SSL encryption
                    </div>
                </div>
            </div>
        </div>
    );
}
