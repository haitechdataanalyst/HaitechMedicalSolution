"use client";

import { useActionState } from "react";
import { verifyMfa, type AuthActionResult } from "@/app/auth/actions";

export default function MfaVerifyForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
        (_prev, formData) => verifyMfa(formData),
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
                <label htmlFor="code" className="form-label">
                    Authenticator code
                </label>
                <input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    className="form-input text-center text-lg tracking-[0.5em]"
                    placeholder="000000"
                />
            </div>

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60">
                {isPending ? "Verifying…" : "Verify"}
            </button>
        </form>
    );
}
