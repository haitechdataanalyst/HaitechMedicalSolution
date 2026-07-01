"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Save, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { userApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccountPageHeader, SectionCard, FormField } from "@/components/account";

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
                    <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= score ? colors[score] : "bg-neutral-200")} />
                ))}
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">Strength: <span className="font-semibold">{labels[score]}</span></p>
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

    // Notifications (local only — no backend endpoint yet)
    const [notifs, setNotifs] = useState({ orderUpdates: true, promotions: false, newsletters: true, smsAlerts: true });

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
        <div className="space-y-5">
            <AccountPageHeader title="Account Settings" subtitle="Manage your profile and security preferences" />

            {/* ── Personal Information ── */}
            <SectionCard icon={User} title="Personal Information" iconBg="bg-primary-50" iconColor="text-primary-600">
                <div className="grid gap-4 sm:grid-cols-2">
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
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email Address</label>
                        <input
                            type="email"
                            value={user?.email ?? ""}
                            disabled
                            className="form-input w-full cursor-not-allowed bg-neutral-50 text-neutral-400"
                        />
                        <p className="mt-1 text-[11px] text-neutral-400">Email cannot be changed. Contact support if needed.</p>
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
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" /> {profileError}
                    </div>
                )}

                <div className="flex justify-end pt-3">
                    <button
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                        className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 disabled:opacity-60"
                    >
                        {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {profileLoading ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </SectionCard>

            {/* ── Change Password ── */}
            <SectionCard icon={Lock} title="Change Password" iconBg="bg-amber-50" iconColor="text-amber-600">
                {isGoogleOnly ? (
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <div>
                            <p className="text-sm font-semibold text-blue-800">Google Account</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                                You signed in with Google. Password management is handled by your Google account.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {/* Current password */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Current Password <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={pw.current}
                                        onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                                        placeholder="Enter current password"
                                        className="form-input pr-10 w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* New password */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        New Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            value={pw.newPw}
                                            onChange={(e) => setPw((p) => ({ ...p, newPw: e.target.value }))}
                                            placeholder="Min. 8 characters"
                                            className="form-input pr-10 w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                        >
                                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <PasswordStrengthBar password={pw.newPw} />
                                </div>

                                {/* Confirm */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Confirm New Password <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={pw.confirm}
                                        onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                                        placeholder="Repeat new password"
                                        className={cn(
                                            "form-input w-full",
                                            pw.confirm && pw.newPw !== pw.confirm ? "border-red-300 focus:border-red-400 focus:ring-red-200/50" : ""
                                        )}
                                    />
                                    {pw.confirm && pw.newPw !== pw.confirm && (
                                        <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {pwError && (
                            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4 shrink-0" /> {pwError}
                            </div>
                        )}

                        <div className="flex justify-end pt-3">
                            <button
                                onClick={handleChangePassword}
                                disabled={pwLoading}
                                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-600 disabled:opacity-60"
                            >
                                {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                {pwLoading ? "Changing…" : "Change Password"}
                            </button>
                        </div>
                    </>
                )}
            </SectionCard>

            {/* ── Notification Preferences ── */}
            <SectionCard icon={Bell} title="Notification Preferences" iconBg="bg-rose-50" iconColor="text-rose-500">
                <div className="space-y-3">
                    {[
                        { key: "orderUpdates", label: "Order Updates",      sub: "Shipping, delivery and tracking notifications" },
                        { key: "smsAlerts",    label: "SMS Alerts",         sub: "Important alerts via SMS to your registered number" },
                        { key: "newsletters",  label: "Product Updates",    sub: "New arrivals, restocks and feature announcements" },
                        { key: "promotions",   label: "Promotions & Offers", sub: "Exclusive deals and seasonal offers" },
                    ].map(({ key, label, sub }) => (
                        <label key={key} className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-neutral-100 px-4 py-3.5 transition-colors hover:bg-neutral-50">
                            <div>
                                <p className="text-sm font-semibold text-neutral-800">{label}</p>
                                <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>
                            </div>
                            <div className="relative mt-0.5 shrink-0">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={(notifs as Record<string, boolean>)[key]}
                                    onChange={(e) => setNotifs((n) => ({ ...n, [key]: e.target.checked }))}
                                />
                                <div className={cn(
                                    "flex h-6 w-11 items-center rounded-full border transition-all duration-200",
                                    (notifs as Record<string, boolean>)[key] ? "border-primary-500 bg-primary-500" : "border-neutral-200 bg-neutral-100"
                                )}>
                                    <div className={cn(
                                        "h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                                        (notifs as Record<string, boolean>)[key] ? "translate-x-6" : "translate-x-1"
                                    )} />
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end pt-3">
                    <button
                        onClick={() => toast.success("Preferences saved", { description: "Notification settings updated." })}
                        className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600"
                    >
                        <Save className="h-4 w-4" /> Save Preferences
                    </button>
                </div>
            </SectionCard>

            {/* ── Danger Zone ── */}
            <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
                <div className="border-b border-red-100 bg-red-50/50 px-6 py-4">
                    <h2 className="text-sm font-bold text-red-700">Danger Zone</h2>
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                    <div>
                        <p className="text-sm font-semibold text-neutral-800">Close Account</p>
                        <p className="text-xs text-neutral-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white">
                        Close Account
                    </button>
                </div>
            </div>
        </div>
    );
}
