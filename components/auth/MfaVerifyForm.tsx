"use client";

import { useActionState } from "react";
import { verifyMfa, type AuthActionResult } from "@/app/auth/actions";
import AuthAlert from "./AuthAlert";

export default function MfaVerifyForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>((_prev, formData) => verifyMfa(formData), {});

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {state?.error && <AuthAlert tone="error">{state.error}</AuthAlert>}

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
                    className="form-input min-h-14 text-center text-2xl font-medium tracking-[0.5em] tabular-nums"
                    placeholder="000000"
                />
            </div>

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg mt-2 w-full">
                {isPending ? "Verifying…" : "Verify"}
            </button>
        </form>
    );
}
