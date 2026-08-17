"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface AuthActionResult {
    error?: string;
}

function siteOrigin(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function firstIssueMessage(error: z.ZodError): string {
    return error.issues[0]?.message ?? "Invalid input";
}

const emailField = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
const passwordField = z.string().min(8, "Password must be at least 8 characters");

const signupSchema = z
    .object({
        email: emailField,
        password: passwordField,
        confirmPassword: z.string(),
        captchaToken: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export async function signup(formData: FormData): Promise<AuthActionResult> {
    const parsed = signupSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        captchaToken: formData.get("captchaToken") || undefined,
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const { email, password, captchaToken } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteOrigin()}/auth/callback?next=/dashboard`,
            captchaToken,
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/register?message=check-email");
}

const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1, "Password is required"),
});

export async function login(formData: FormData): Promise<AuthActionResult> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
        return { error: error.message };
    }

    // Password sign-in only ever reaches aal1. If the account has an
    // enrolled TOTP factor, it must clear an aal2 challenge before it can
    // touch anything session-protected.
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasVerifiedFactor = factorsData?.totp.some((factor) => factor.status === "verified");

    if (hasVerifiedFactor) {
        redirect("/auth/mfa-verify");
    }

    redirect("/dashboard");
}

const forgotPasswordSchema = z.object({
    email: emailField,
});

export async function forgotPassword(formData: FormData): Promise<AuthActionResult> {
    const parsed = forgotPasswordSchema.safeParse({
        email: formData.get("email"),
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${siteOrigin()}/auth/callback?next=/dashboard/update-password`,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/forgot-password?message=check-email");
}

const updatePasswordSchema = z
    .object({
        password: passwordField,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export async function updatePassword(formData: FormData): Promise<AuthActionResult> {
    const parsed = updatePasswordSchema.safeParse({
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?error=${encodeURIComponent("Your session has expired — request a new reset link")}`);
    }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard?message=password-updated");
}

export async function signOut(): Promise<never> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

const mfaVerifySchema = z.object({
    code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code from your authenticator app"),
});

export async function verifyMfa(formData: FormData): Promise<AuthActionResult> {
    const parsed = mfaVerifySchema.safeParse({ code: formData.get("code") });

    if (!parsed.success) {
        return { error: firstIssueMessage(parsed.error) };
    }

    const supabase = await createClient();
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp.find((factor) => factor.status === "verified");

    if (factorsError || !totpFactor) {
        return { error: "No verified authenticator found — please sign in again" };
    }

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

    if (challengeError || !challenge) {
        return { error: challengeError?.message ?? "Unable to start verification" };
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: parsed.data.code,
    });

    if (verifyError) {
        return { error: verifyError.message };
    }

    redirect("/dashboard");
}
