"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, type AuthActionResult } from "@/app/auth/actions";
import PasswordInput from "./PasswordInput";
import AuthAlert from "./AuthAlert";

// ?next= is read in the browser so the page can be prerendered. It only becomes a hidden field; the sign-in action validates it.
function NextField() {
    const next = useSearchParams().get("next");
    return next ? <input type="hidden" name="next" value={next} /> : null;
}

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>((_prev, formData) => login(formData), {});

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {state?.error && <AuthAlert tone="error">{state.error}</AuthAlert>}
            <Suspense fallback={null}>
                <NextField />
            </Suspense>

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
                    <Link
                        href="/forgot-password"
                        className="text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 -my-3 rounded py-3 text-[13px] font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Forgot password?
                    </Link>
                }
            />

            <button type="submit" disabled={isPending} className="btn btn-primary btn-lg mt-2 w-full">
                {isPending ? "Signing in…" : "Sign In"}
            </button>

            <p className="mt-1 text-center text-sm text-neutral-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary-700 hover:text-primary-800 font-medium hover:underline">
                    Create one free
                </Link>
            </p>
        </form>
    );
}
