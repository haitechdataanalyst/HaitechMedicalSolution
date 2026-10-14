"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword, type AuthActionResult } from "@/app/auth/actions";
import AuthAlert from "./AuthAlert";

export default function ForgotPasswordForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>((_prev, formData) => forgotPassword(formData), {});

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {state?.error && <AuthAlert tone="error">{state.error}</AuthAlert>}

            <div>
                <label htmlFor="email" className="form-label">
                    Email address
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required className="form-input" placeholder="you@example.com" />
            </div>

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg mt-2 w-full">
                {isPending ? "Sending reset link…" : "Send Reset Link"}
            </button>

            <p className="mt-1 text-center text-sm">
                <Link href="/login" className="text-primary-700 hover:text-primary-800 font-medium hover:underline">
                    Back to sign in
                </Link>
            </p>
        </form>
    );
}
