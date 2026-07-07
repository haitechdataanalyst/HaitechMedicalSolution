"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Star, Clock } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
    const { login, googleLogin } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await login(email, password);

        setIsLoading(false);

        if (result.success) {
            router.push("/");
        } else {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setError("Google sign-in did not return a credential. Please try again.");
            return;
        }
        setError("");
        setIsGoogleLoading(true);

        const result = await googleLogin(credentialResponse.credential);

        setIsGoogleLoading(false);

        if (result.success) {
            router.push("/");
        } else {
            setError(result.message);
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-in was cancelled or failed. Please try again.");
    };

    return (
        <main className="flex min-h-screen">

            {/* ── Left panel — hidden below lg, matches register ── */}
            <div className="hidden flex-col justify-between bg-[#001926] p-10 lg:flex lg:w-[42%] xl:w-[38%]" style={{ background: "linear-gradient(135deg, #001926 0%, #002f43 50%, #00465e 100%)" }}>
                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/haitech-medical.png" alt="Haitech" width={40} height={40} className="shrink-0" />
                        <div>
                            <p className="text-base font-bold leading-none text-white">Haitech</p>
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-teal">Medical Solutions Pvt. Ltd.</p>
                        </div>
                    </Link>
                </div>

                {/* Hero copy */}
                <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
                    <span className="mb-4 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                        Authorized Distributor
                    </span>
                    <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
                        Your gateway to<br />
                        <span className="text-[#1fb6cd]">premium dental care</span>
                    </h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/60">
                        India&apos;s most trusted platform for premium dental &amp; medical equipment.
                        Empowering healthcare professionals with precision technology.
                    </p>

                    {/* Credentials */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <ul className="space-y-3.5">
                            <li className="flex items-center gap-3 text-sm text-white/80">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-[#1fb6cd]" />
                                ISO Certified Distributor
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/80">
                                <Star className="h-4 w-4 shrink-0 text-[#1fb6cd]" />
                                15+ Years of Clinical Equipment Experience
                            </li>
                            <li className="flex items-center gap-3 text-sm text-white/80">
                                <Clock className="h-4 w-4 shrink-0 text-[#1fb6cd]" />
                                24-Hour Response Guarantee
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    {[
                        { value: "5",     label: "Brands"    },
                        { value: "80+",   label: "Products"  },
                        { value: "15+",   label: "Years"     },
                        { value: "24-Hr", label: "Response"  },
                    ].map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-0.5">
                            <p className="text-lg font-bold text-white">{s.value}</p>
                            <p className="text-[11px] text-white/50">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="relative flex flex-1 flex-col justify-center overflow-y-auto px-6 py-16 sm:px-10 lg:px-14 xl:px-20">

                {/* Back to home */}
                <Link
                    href="/"
                    className="absolute left-6 top-6 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-primary-600 sm:left-10"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Home
                </Link>

                {/* Mobile logo */}
                <div className="mb-6 lg:hidden">
                    <Image src="/haitech_medical_logo.png" alt="Haitech Medical" width={150} height={31} className="h-auto" />
                </div>

                <div className="mx-auto w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Welcome back</h1>
                        <p className="text-sm text-neutral-500">Sign in to your Haitech account to manage orders</p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <span className="mt-px shrink-0">⚠</span>
                            {error}
                        </div>
                    )}

                    {/* ── Google Sign-In ── */}
                    <div className="mb-6">
                        {isGoogleLoading ? (
                            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-600">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                                Signing in with Google…
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    shape="pill"
                                    width="400"
                                    text="signin_with"
                                    logo_alignment="left"
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6 flex items-center">
                        <div className="flex-1 border-t border-neutral-200" />
                        <span className="mx-4 shrink-0 text-xs font-medium text-neutral-400">or sign in with email</span>
                        <div className="flex-1 border-t border-neutral-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Email address <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-primary-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 shrink-0 rounded border-neutral-300 accent-primary-500"
                            />
                            <span className="text-sm text-neutral-600">Remember me for 30 days</span>
                        </label>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60"
                            style={{ boxShadow: "0 6px 24px -4px rgb(31 182 205 / 0.45)", paddingBlock: "0.9375rem" }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Signing in…
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                            Create one free →
                        </Link>
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Your data is secured with 256-bit SSL encryption
                    </div>
                </div>
            </div>
        </main>
    );
}
