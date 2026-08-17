"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword, type AuthActionResult } from "@/app/auth/actions";

export default function ForgotPasswordForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
        (_prev, formData) => forgotPassword(formData),
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

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60">
                {isPending ? "Sending reset link…" : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-neutral-500">
                <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                    ← Back to sign in
                </Link>
            </p>
        </form>
    );
}
