"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";

type Status = "loading" | "success" | "error" | "missing";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<Status>(token ? "loading" : "missing");
    const [message, setMessage] = useState("");
    const called = useRef(false);

    useEffect(() => {
        if (!token || called.current) return;
        called.current = true;

        authApi
            .verifyEmail(token)
            .then((res) => {
                if (res.success) {
                    setStatus("success");
                    setMessage(res.message || "Your email has been verified.");
                } else {
                    setStatus("error");
                    setMessage(res.message || "Verification failed. The link may have expired.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            });
    }, [token]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
                {/* Logo */}
                <Link href="/" className="mb-8 inline-flex items-center gap-3">
                    <Image src="/haitech-medical.png" alt="Haitech" width={36} height={36} />
                    <div className="text-left">
                        <p className="text-sm font-bold leading-none text-neutral-900">Haitech</p>
                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1fb6cd]">
                            Medical Solutions
                        </p>
                    </div>
                </Link>

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <Loader2 className="h-12 w-12 animate-spin text-[#1fb6cd]" />
                        <p className="text-sm font-medium text-neutral-600">Verifying your email…</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900">Email Verified!</h1>
                        <p className="text-sm text-neutral-500">{message}</p>
                        <Link
                            href="/login"
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0]"
                        >
                            Continue to Login
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <XCircle className="h-9 w-9 text-red-500" />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900">Verification Failed</h1>
                        <p className="text-sm text-neutral-500">{message}</p>
                        <div className="mt-2 flex flex-col gap-2 w-full">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0]"
                            >
                                Go to Login
                            </Link>
                            <p className="text-xs text-neutral-400">
                                Need a new link?{" "}
                                <Link href="/login" className="text-[#1fb6cd] underline">
                                    Sign in to resend verification
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {status === "missing" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                            <XCircle className="h-9 w-9 text-amber-500" />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-900">Invalid Link</h1>
                        <p className="text-sm text-neutral-500">
                            No verification token found. Please use the link from your email.
                        </p>
                        <Link
                            href="/login"
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0]"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
