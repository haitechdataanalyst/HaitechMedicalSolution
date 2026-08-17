"use client";

import { useActionState, useState } from "react";
import { updatePassword, type AuthActionResult } from "@/app/auth/actions";
import PasswordInput from "./PasswordInput";

export default function UpdatePasswordForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
        (_prev, formData) => updatePassword(formData),
        {}
    );
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

            <PasswordInput
                id="password"
                name="password"
                label="New password"
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
                label="Confirm new password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={mismatch ? "Passwords do not match" : undefined}
            />

            <button type="submit" disabled={isPending || mismatch} className="btn btn-primary btn-lg w-full rounded-full disabled:opacity-60">
                {isPending ? "Updating password…" : "Update Password"}
            </button>
        </form>
    );
}
