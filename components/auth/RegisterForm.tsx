"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup, type AuthActionResult } from "@/app/auth/actions";
import TurnstileWidget from "./TurnstileWidget";
import PasswordInput from "./PasswordInput";

export default function RegisterForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
        (_prev, formData) => signup(formData),
        {}
    );
    const [captchaToken, setCaptchaToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {state?.error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                    <span className="mt-px shrink-0">⚠</span>
                    {state.error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="form-label">
                    Email address
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required className="form-input" placeholder="you@example.com" />
            </div>

            <PasswordInput
                id="password"
                name="password"
                label="Password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={setPassword}
            />

            <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={mismatch ? "Passwords do not match" : undefined}
            />

            {turnstileSiteKey && (
                <div>
                    <input type="hidden" name="captchaToken" value={captchaToken} />
                    <TurnstileWidget siteKey={turnstileSiteKey} onVerify={setCaptchaToken} />
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || mismatch || (Boolean(turnstileSiteKey) && !captchaToken)}
                className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60"
            >
                {isPending ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                    Sign in →
                </Link>
            </p>
        </form>
    );
}
