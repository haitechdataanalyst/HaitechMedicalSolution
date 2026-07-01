"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2, XCircle, Lock } from "lucide-react";
import { authApi } from "@/lib/api";

function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { label: "", color: "bg-neutral-200" },
        { label: "Weak", color: "bg-red-400" },
        { label: "Fair", color: "bg-amber-400" },
        { label: "Good", color: "bg-yellow-400" },
        { label: "Strong", color: "bg-emerald-500" },
    ];
    return { score, ...map[score] };
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const strength = getStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing reset token. Please use the link from your email.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        const res = await authApi.resetPassword(token, password);
        setIsLoading(false);

        if (res.success) {
            setDone(true);
            setTimeout(() => router.push("/login"), 3000);
        } else {
            setError(res.message || "Reset failed. The link may have expired.");
        }
    };

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
                    <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-full bg-red-50">
                        <XCircle className="h-9 w-9 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900">Invalid Link</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        No reset token found. Please use the link from your password reset email.
                    </p>
                    <Link
                        href="/login"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0]"
                    >
                        Back to Login
                    </Link>
                </div>
            </main>
        );
    }

    if (done) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
                    <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900">Password Reset!</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Your password has been updated. Redirecting you to login…
                    </p>
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
                            Medical Solutions
                        </p>
                    </div>
                </Link>

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#1fb6cd]/10">
                    <Lock className="h-6 w-6 text-[#1fb6cd]" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Set new password</h1>
                <p className="mt-1 text-sm text-neutral-500">Choose a strong password for your account.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* New password */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Min. 8 characters"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[#1fb6cd] focus:outline-none focus:ring-2 focus:ring-[#1fb6cd]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${
                                                i <= strength.score ? strength.color : "bg-neutral-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                {strength.label && (
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Strength: <span className="font-medium">{strength.label}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                placeholder="Re-enter password"
                                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-[#1fb6cd] focus:outline-none focus:ring-2 focus:ring-[#1fb6cd]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirm && password !== confirm && (
                            <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full rounded-full bg-[#1fb6cd] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-[#179ab0] disabled:opacity-60"
                    >
                        {isLoading ? "Resetting…" : "Reset Password"}
                    </button>

                    <p className="text-center text-sm text-neutral-500">
                        Remember it?{" "}
                        <Link href="/login" className="font-medium text-[#1fb6cd] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
