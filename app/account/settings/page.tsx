"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Lock, Bell, Save, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { userApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccountPageHeader, SectionCard, FormField } from "@/components/account";
import { SURFACE_CARD } from "@/components/ui/surfaces";

const EYE_BTN =
    "absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500";

const NOTIFS_STORAGE_KEY = "haitech-notification-prefs";
const DEFAULT_NOTIFS = { orderUpdates: true, promotions: false, newsletters: true, smsAlerts: true };

function PasswordStrengthBar({ password }: { password: string }) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const colors = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    if (!password) return null;
    return (
        <div className="mt-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-200", i <= score ? colors[score] : "bg-neutral-200")} />
                ))}
            </div>
            <p className="mt-1.5 text-[13px] text-neutral-500">Strength: <span className="font-semibold">{labels[score]}</span></p>
        </div>
    );
}

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();

    // Profile state
    const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "" });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");

    // Password state
    const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");

    // Notifications — no backend endpoint yet, so preferences are persisted to this
    // device only (localStorage) rather than faking a server-side save.
    const [notifs, setNotifs] = useState<typeof DEFAULT_NOTIFS>(() => {
        if (typeof window === "undefined") return DEFAULT_NOTIFS;
        try {
            const stored = localStorage.getItem(NOTIFS_STORAGE_KEY);
            return stored ? { ...DEFAULT_NOTIFS, ...(JSON.parse(stored) as Partial<typeof DEFAULT_NOTIFS>) } : DEFAULT_NOTIFS;
        } catch {
            return DEFAULT_NOTIFS;
        }
    });

    // Populate profile from auth context
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName ?? "",
                lastName:  user.lastName  ?? "",
                phone:     user.phone     ?? "",
            });
        }
    }, [user]);

    const handleSaveNotifs = () => {
        try {
            localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
            toast.success("Preferences saved to this device", { description: "Notification settings will apply next time you sign in here." });
        } catch {
            toast.error("Couldn't save preferences", { description: "Your browser may be blocking local storage." });
        }
    };

    // ── Save profile ───────────────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setProfileError("");
        if (!profile.firstName.trim()) { setProfileError("First name is required."); return; }

        setProfileLoading(true);
        const res = await userApi.updateProfile({
            firstName: profile.firstName.trim(),
            lastName:  profile.lastName.trim(),
            phone:     profile.phone.trim() || null,
        });
        setProfileLoading(false);

        if (res.success) {
            await refreshUser();
            toast.success("Profile updated", { description: "Your personal information has been saved." });
        } else {
            setProfileError(res.message || "Failed to update profile.");
        }
    };

    // ── Change password ────────────────────────────────────────────────────────
    const handleChangePassword = async () => {
        setPwError("");
        if (!pw.current)             { setPwError("Current password is required."); return; }
        if (pw.newPw.length < 8)     { setPwError("New password must be at least 8 characters."); return; }
        if (pw.newPw !== pw.confirm)  { setPwError("New passwords do not match."); return; }
        if (pw.current === pw.newPw)  { setPwError("New password must be different from current."); return; }

        setPwLoading(true);
        const res = await userApi.changePassword(pw.current, pw.newPw);
        setPwLoading(false);

        if (res.success) {
            setPw({ current: "", newPw: "", confirm: "" });
            toast.success("Password changed", { description: "Your password has been updated successfully." });
        } else {
            setPwError(res.message || "Failed to change password.");
        }
    };

    const isGoogleOnly = user?.authProvider === "google";

    return (
        <div className="space-y-6">
            <AccountPageHeader title="Account Settings" subtitle="Manage your profile and security preferences" />

            {/* ── Personal Information ── */}
            <SectionCard icon={User} title="Personal Information" iconBg="bg-primary-50" iconColor="text-primary-700">
                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        label="First Name"
                        value={profile.firstName}
                        onChange={(v) => setProfile((p) => ({ ...p, firstName: v }))}
                        placeholder="First name"
                    />
                    <FormField
                        label="Last Name"
                        value={profile.lastName}
                        onChange={(v) => setProfile((p) => ({ ...p, lastName: v }))}
                        placeholder="Last name"
                    />
                    <div className="sm:col-span-2">
                        <label htmlFor="settings-email" className="form-label">Email Address</label>
                        <input
                            id="settings-email"
                            type="email"
                            value={user?.email ?? ""}
                            disabled
                            aria-describedby="settings-email-hint"
                            className="form-input w-full cursor-not-allowed bg-neutral-50 text-neutral-600"
                        />
                        <p id="settings-email-hint" className="mt-1.5 text-[13px] text-neutral-500">Email cannot be changed. Contact support if needed.</p>
                    </div>
                    <FormField
                        label="Phone Number"
                        value={profile.phone}
                        type="tel"
                        onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
                        placeholder="+91 9999999999"
                    />
                </div>

                {profileError && (
                    <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {profileError}
                    </div>
                )}

                <div className="flex justify-end pt-6">
                    <button type="button" onClick={handleSaveProfile} disabled={profileLoading} className="btn btn-primary btn-md">
                        {profileLoading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                        {profileLoading ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </SectionCard>

            {/* ── Change Password ── */}
            <SectionCard icon={Lock} title="Change Password" iconBg="bg-amber-50" iconColor="text-amber-700">
                {isGoogleOnly ? (
                    <div className="flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-3.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
                        <div>
                            <p className="text-sm font-semibold text-blue-900">Google Account</p>
                            <p className="mt-0.5 text-[13px] text-blue-800">
                                You signed in with Google. Password management is handled by your Google account.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-5">
                            {/* Current password */}
                            <div>
                                <label htmlFor="settings-current-pw" className="form-label">
                                    Current Password <span className="text-red-600" aria-hidden="true">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="settings-current-pw"
                                        type={showCurrent ? "text" : "password"}
                                        value={pw.current}
                                        onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                        className="form-input w-full pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent((s) => !s)}
                                        aria-label={showCurrent ? "Hide current password" : "Show current password"}
                                        aria-pressed={showCurrent}
                                        className={EYE_BTN}
                                    >
                                        {showCurrent ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* New password */}
                                <div>
                                    <label htmlFor="settings-new-pw" className="form-label">
                                        New Password <span className="text-red-600" aria-hidden="true">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="settings-new-pw"
                                            type={showNew ? "text" : "password"}
                                            value={pw.newPw}
                                            onChange={(e) => setPw((p) => ({ ...p, newPw: e.target.value }))}
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            className="form-input w-full pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew((s) => !s)}
                                            aria-label={showNew ? "Hide new password" : "Show new password"}
                                            aria-pressed={showNew}
                                            className={EYE_BTN}
                                        >
                                            {showNew ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
                                        </button>
                                    </div>
                                    <PasswordStrengthBar password={pw.newPw} />
                                </div>

                                {/* Confirm */}
                                <div>
                                    <label htmlFor="settings-confirm-pw" className="form-label">
                                        Confirm New Password <span className="text-red-600" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="settings-confirm-pw"
                                        type={showNew ? "text" : "password"}
                                        value={pw.confirm}
                                        onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                                        placeholder="Repeat new password"
                                        autoComplete="new-password"
                                        aria-invalid={pw.confirm && pw.newPw !== pw.confirm ? true : undefined}
                                        aria-describedby={pw.confirm && pw.newPw !== pw.confirm ? "settings-confirm-pw-error" : undefined}
                                        className={cn("form-input w-full", pw.confirm && pw.newPw !== pw.confirm && "form-input-error")}
                                    />
                                    {pw.confirm && pw.newPw !== pw.confirm && (
                                        <p id="settings-confirm-pw-error" className="form-error">Passwords do not match.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {pwError && (
                            <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {pwError}
                            </div>
                        )}

                        <div className="flex justify-end pt-6">
                            <button type="button" onClick={handleChangePassword} disabled={pwLoading} className="btn btn-primary btn-md">
                                {pwLoading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                                {pwLoading ? "Changing…" : "Change Password"}
                            </button>
                        </div>
                    </>
                )}
            </SectionCard>

            {/* ── Notification Preferences ── */}
            <SectionCard icon={Bell} title="Notification Preferences" iconBg="bg-rose-50" iconColor="text-rose-600">
                <div className="-mx-2 divide-y divide-neutral-900/[0.06]">
                    {[
                        { key: "orderUpdates", label: "Order Updates",      sub: "Shipping, delivery and tracking notifications" },
                        { key: "smsAlerts",    label: "SMS Alerts",         sub: "Important alerts via SMS to your registered number" },
                        { key: "newsletters",  label: "Product Updates",    sub: "New arrivals, restocks and feature announcements" },
                        { key: "promotions",   label: "Promotions & Offers", sub: "Exclusive deals and seasonal offers" },
                    ].map(({ key, label, sub }) => {
                        const checked = (notifs as Record<string, boolean>)[key];
                        return (
                            <label key={key} className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-2 py-4">
                                <div>
                                    <p className="text-[15px] font-medium text-neutral-900">{label}</p>
                                    <p className="mt-0.5 text-[13px] text-neutral-500">{sub}</p>
                                </div>
                                <div className="relative shrink-0">
                                    <input
                                        type="checkbox"
                                        role="switch"
                                        className="peer sr-only"
                                        checked={checked}
                                        onChange={(e) => setNotifs((n) => ({ ...n, [key]: e.target.checked }))}
                                    />
                                    <div className={cn(
                                        "flex h-[30px] w-[50px] items-center rounded-full transition-colors duration-200 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500",
                                        checked ? "bg-primary-700" : "bg-neutral-200"
                                    )}>
                                        <div className={cn(
                                            "h-[26px] w-[26px] rounded-full bg-white shadow-[0_2px_4px_rgba(15,23,42,0.2)] transition-transform duration-200 ease-out",
                                            checked ? "translate-x-[22px]" : "translate-x-0.5"
                                        )} />
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
                <div className="flex justify-end pt-6">
                    <button type="button" onClick={handleSaveNotifs} className="btn btn-primary btn-md">
                        <Save className="h-4 w-4" aria-hidden="true" /> Save Preferences
                    </button>
                </div>
            </SectionCard>

            {/* ── Danger Zone ── */}
            <section className={cn(SURFACE_CARD, "px-6 py-6 md:px-7")}>
                <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-red-700">Danger Zone</h2>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[15px] font-medium text-neutral-900">Close Account</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-500">Our team handles account closure directly to make sure your order history and data are removed correctly.</p>
                    </div>
                    <Link
                        href="/support/contact?subject=close-account"
                        className="btn btn-md shrink-0 bg-red-50 text-red-700 hover:bg-red-100"
                    >
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
