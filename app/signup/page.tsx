"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Check } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { cn } from "@/lib/utils";
import { authApi, setAccessToken } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

const PROFESSIONS = [
    "General Dentist", "Orthodontist", "Oral Surgeon", "Periodontist",
    "Endodontist", "Pediatric Dentist", "Prosthodontist", "Dental Hygienist",
    "Practice Manager", "Other",
];

const BRANDS = [
    { name: "Admetec", src: "/BrandLogo/AdmetecLogo.jpeg" },
    { name: "Almadent", src: "/BrandLogo/AlmadentLogo.jpeg" },
    { name: "Medesy", src: "/BrandLogo/MedesyLogo.jpeg" },
    { name: "Salli", src: "/BrandLogo/SalliLogo.jpeg" },
    { name: "Strauss", src: "/BrandLogo/StraussLogo.jpeg" },
];

const STATS = [
    { value: "500+", label: "Professionals" },
    { value: "5", label: "Brands" },
    { value: "24/7", label: "Support" },
    { value: "4.9★", label: "Rating" },
];

const STEPS = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Your Practice" },
    { number: 3, label: "Security" },
];

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
    if (score <= 2) return { score, label: "Fair", color: "bg-amber-400" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-400" };
    if (score <= 4) return { score, label: "Strong", color: "bg-emerald-400" };
    return { score, label: "Very strong", color: "bg-emerald-500" };
}

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

export default function SignupPage() {
    const { googleLogin } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [form, setForm] = useState({
        fullName: "", email: "", phone: "",
        profession: "", practiceName: "", country: "",
        password: "", confirmPassword: "",
    });

    const setField = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const validateStep = (s: number): string => {
        if (s === 1) {
            if (!form.fullName.trim()) return "Full name is required.";
            if (!form.email || !isValidEmail(form.email)) return "Please enter a valid email address.";
            if (!form.phone.trim()) return "Phone number is required.";
        }
        if (s === 2) {
            if (!form.profession) return "Please select your profession.";
            if (!form.country) return "Please select your country.";
        }
        if (s === 3) {
            if (!form.password || form.password.length < 8) return "Password must be at least 8 characters.";
            if (form.password !== form.confirmPassword) return "Passwords do not match.";
            if (!agreedToTerms) return "Please agree to the Terms of Service and Privacy Policy.";
        }
        return "";
    };

    const handleNext = () => {
        const err = validateStep(step);
        if (err) { setError(err); return; }
        setError("");
        setStep((s) => s + 1);
    };

    const handleBack = () => { setError(""); setStep((s) => s - 1); };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateStep(3);
        if (err) { setError(err); return; }
        setError("");
        setIsLoading(true);

        const nameParts = form.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || "User";
        const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "User";
        const rawUsername = form.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
        const username = rawUsername.length >= 3 ? rawUsername : `user${Date.now()}`;

        const res = await authApi.register({
            firstName,
            lastName,
            username,
            email: form.email,
            phone: form.phone.replace(/\D/g, ""),
            password: form.password,
        });

        setIsLoading(false);

        if (res.success && res.data) {
            setAccessToken(res.data.accessToken);
            setSuccess(true);
        } else {
            setError(res.message || "Registration failed. Please try again.");
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
                <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-10 text-center shadow-lg">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-neutral-900">Account Created!</h2>
                    <p className="mb-6 text-sm text-neutral-500">
                        Welcome, {form.fullName.split(" ")[0]}! Our team will verify your account and you&apos;ll receive a confirmation email shortly.
                    </p>
                    <Link
                        href="/login"
                        className="btn btn-primary btn-lg block w-full rounded-full text-center"
                        style={{ boxShadow: "0 6px 24px -4px rgb(31 182 205 / 0.45)" }}
                    >
                        Sign In to Your Account
                    </Link>
                    <Link href="/" className="mt-4 block text-sm text-neutral-400 transition-colors hover:text-primary-600">
                        Return to homepage
                    </Link>
                </div>
            </div>
        );
    }

    const pwStrength = getPasswordStrength(form.password);

    return (
        <div className="flex min-h-screen">

            {/* ── Left Panel ── */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-gradient p-10 lg:flex lg:w-[42%] xl:w-[38%]">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />
                <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-primary-400/5 blur-3xl" />

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

                {/* Headline + brand logos */}
                <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
                    <span className="mb-4 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                        Join the Community
                    </span>
                    <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
                        Access 5 world-class
                        <br />
                        <span className="text-primary-300">dental brands</span>
                    </h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/60">
                        Join 500+ dental professionals who trust Haitech for premium equipment &amp; dedicated support.
                    </p>

                    {/* Brand names grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {BRANDS.map((brand) => (
                            <div
                                key={brand.name}
                                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/8 px-3 py-3.5 backdrop-blur-sm"
                            >
                                <span className="text-xs font-bold tracking-wide text-white/75">{brand.name}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-center rounded-xl border border-white/8 bg-white/5 px-3 py-3.5">
                            <span className="text-xs font-semibold text-white/40">+80 products</span>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-0.5">
                            <p className="text-lg font-bold text-white">{s.value}</p>
                            <p className="text-[11px] text-white/50">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="relative flex flex-1 flex-col justify-center overflow-y-auto px-6 py-16 sm:px-10 lg:px-14 xl:px-20">

                {/* Back to home — anchored top-left, out of form flow */}
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
                        <h1 className="mb-1.5 text-2xl font-bold text-neutral-900">Create your account</h1>
                        <p className="text-sm text-neutral-500">Get access to exclusive products and pricing</p>
                    </div>

                    {/* ── Google Sign-Up ── */}
                    <div className="mb-6">
                        {isGoogleLoading ? (
                            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-600">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                                Signing up with Google…
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
                                    text="signup_with"
                                    logo_alignment="left"
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6 flex items-center">
                        <div className="flex-1 border-t border-neutral-200" />
                        <span className="mx-4 shrink-0 text-xs font-medium text-neutral-400">or create account with email</span>
                        <div className="flex-1 border-t border-neutral-200" />
                    </div>

                    {/* Step indicator */}
                    <div className="mb-8 flex items-center">
                        {STEPS.map((s, i) => (
                            <div key={s.number} className="flex flex-1 items-center">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                                            step === s.number
                                                ? "bg-primary-500 text-white"
                                                : step > s.number
                                                ? "bg-emerald-500 text-white"
                                                : "border-2 border-neutral-200 text-neutral-400"
                                        )}
                                        style={step === s.number ? { boxShadow: "0 4px 12px rgb(31 182 205 / 0.35)" } : undefined}
                                    >
                                        {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                                    </div>
                                    <span className={cn(
                                        "hidden text-xs font-medium sm:block",
                                        step === s.number ? "text-neutral-800" :
                                        step > s.number ? "text-emerald-600" : "text-neutral-400"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        "mx-2 h-px flex-1 transition-colors duration-300 sm:mx-3",
                                        step > s.number ? "bg-emerald-300" : "bg-neutral-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <span className="mt-px shrink-0">⚠</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} noValidate>

                        {/* ── Step 1: Basic Info ── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="fullName">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="fullName" type="text" value={form.fullName}
                                        onChange={(e) => setField("fullName", e.target.value)}
                                        placeholder="Dr. Jane Smith" autoComplete="name"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="email">
                                        Email Address <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="email" type="email" value={form.email}
                                        onChange={(e) => setField("email", e.target.value)}
                                        placeholder="you@example.com" autoComplete="email"
                                        className={cn("form-input", form.email && !isValidEmail(form.email) && "form-input-error")}
                                    />
                                    {form.email && !isValidEmail(form.email) && (
                                        <p className="mt-1.5 text-xs text-red-500">Please enter a valid email address.</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="phone">
                                        Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="phone" type="tel" value={form.phone}
                                        onChange={(e) => setField("phone", e.target.value)}
                                        placeholder="+91 9876543210" autoComplete="tel"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Practice Info ── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="profession">
                                        Profession <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        id="profession" value={form.profession}
                                        onChange={(e) => setField("profession", e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">Select your profession</option>
                                        {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="practiceName">
                                        Practice / Clinic Name
                                    </label>
                                    <input
                                        id="practiceName" type="text" value={form.practiceName}
                                        onChange={(e) => setField("practiceName", e.target.value)}
                                        placeholder="Sunshine Dental Clinic"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="country">
                                        Country <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        id="country" value={form.country}
                                        onChange={(e) => setField("country", e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">Select your country</option>
                                        <option value="India">India</option>
                                        <option value="Australia">Australia</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Security ── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="password">
                                        Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={(e) => setField("password", e.target.value)}
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            className="form-input pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {form.password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= pwStrength.score ? pwStrength.color : "bg-neutral-200")} />
                                                ))}
                                            </div>
                                            <p className="mt-1 text-[11px] text-neutral-500">
                                                Strength: <span className="font-semibold">{pwStrength.label}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="confirmPassword">
                                        Confirm Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            value={form.confirmPassword}
                                            onChange={(e) => setField("confirmPassword", e.target.value)}
                                            placeholder="Repeat your password"
                                            autoComplete="new-password"
                                            className={cn("form-input pr-11", form.confirmPassword && form.password !== form.confirmPassword && "form-input-error")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
                                            aria-label={showConfirm ? "Hide" : "Show"}
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {form.confirmPassword && form.password !== form.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
                                    )}
                                </div>
                                <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-600">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 accent-primary-500"
                                    />
                                    <span>
                                        I agree to the{" "}
                                        <Link href="/support/policies/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                                        {" "}and{" "}
                                        <Link href="/support/policies/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex items-center gap-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary btn-lg flex-1 rounded-full disabled:opacity-60"
                                style={{ boxShadow: "0 6px 24px -4px rgb(31 182 205 / 0.45)", paddingBlock: "0.9375rem" }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creating account…
                                    </span>
                                ) : step < 3 ? (
                                    <span className="flex items-center gap-2">
                                        Continue
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Your data is secured with 256-bit SSL encryption
                    </div>
                </div>
            </div>
        </div>
    );
}
