"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Star } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <main className="flex min-h-screen">

            {/* ── Left panel — hidden below lg, matches register ── */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-[#001926] p-10 lg:flex lg:w-[42%] xl:w-[38%]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#001926] via-[#002f43] to-[#00465e] opacity-90" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#1fb6cd] opacity-10 blur-3xl" />
                <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#1fb6cd] opacity-5 blur-2xl" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/haitech-medical.png" alt="Haitech" width={40} height={40} className="shrink-0" />
                        <div>
                            <p className="text-base font-bold leading-none text-white">Haitech</p>
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#4cd8ef]">Medical Solutions Pvt. Ltd.</p>
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

                    {/* Testimonial glassmorphism card */}
                    <div
                        className="rounded-2xl border border-white/10 p-6"
                        style={{ background: "rgba(0,47,67,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                    >
                        <div className="mb-3 flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-[#FFD700] text-[#FFD700]" />
                            ))}
                        </div>
                        <p className="mb-5 text-sm italic leading-relaxed text-white/80">
                            &quot;Haitech transformed how we source dental equipment. The quality and support
                            are simply outstanding — a true expert partner in our clinical growth.&quot;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1fb6cd] text-sm font-bold text-white">
                                D
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Dr. Priya Mehta</p>
                                <p className="text-[11px] text-white/50">Senior Orthodontist, Pune</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    {[
                        { value: "500+", label: "Professionals" },
                        { value: "5",    label: "Brands"        },
                        { value: "24/7", label: "Support"       },
                        { value: "4.9★", label: "Rating"        },
                    ].map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-0.5">
                            <p className="text-lg font-bold text-white">{s.value}</p>
                            <p className="text-[11px] text-white/50">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel — matches register layout exactly ── */}
            <div className="relative flex flex-1 flex-col justify-center overflow-y-auto px-6 py-16 sm:px-10 lg:px-14 xl:px-20">

                {/* Back to home */}
                <Link
                    href="/"
                    className="absolute left-6 top-6 flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-primary-600 sm:left-10"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Home
                </Link>

                {/* Mobile logo — hidden on lg+ when left panel shows */}
                <div className="mb-6 lg:hidden">
                    <Image src="/haitech_medical_logo.png" alt="Haitech Medical" width={150} height={31} className="h-auto" />
                </div>

                <div className="mx-auto w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Welcome back</h1>
                        <p className="text-sm text-neutral-500">Sign in to your Haitech account to manage orders</p>
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
                                <Link href="/support/contact" className="text-xs font-semibold text-primary-500 hover:underline">
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
                            className="btn btn-primary btn-lg w-full rounded-full"
                            style={{ boxShadow: "0 6px 24px -4px rgb(31 182 205 / 0.45)", paddingBlock: "0.9375rem" }}
                        >
                            Sign In
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
