"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionResult } from "@/app/auth/actions";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
        (_prev, formData) => login(formData),
        {}
    );

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
                autoComplete="current-password"
                required
                placeholder="••••••••••"
                labelExtra={
                    <Link href="/forgot-password" className="text-xs font-semibold text-primary-500 hover:underline">
                        Forgot password?
                    </Link>
                }
            />

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60">
                {isPending ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-center text-sm text-neutral-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                    Create one free →
                </Link>
            </p>
        </form>
    );
}
