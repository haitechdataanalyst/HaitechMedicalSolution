"use client";

import { useState } from "react";
import { User, Building2, Lock, Bell, Save, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-account";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccountPageHeader, SectionCard, FormField } from "@/components/account";

export default function SettingsPage() {
    const [profile, setProfile] = useState({ name: MOCK_USER.name, email: MOCK_USER.email, phone: MOCK_USER.phone, designation: MOCK_USER.designation });
    const [business, setBusiness] = useState({ company: MOCK_USER.company, gst: MOCK_USER.gst, pan: MOCK_USER.pan });
    const [password, setPassword] = useState({ current: "", newPw: "", confirm: "" });
    const [showPw, setShowPw] = useState(false);
    const [notifs, setNotifs] = useState({ orderUpdates: true, promotions: false, newsletters: true, smsAlerts: true });
    const [saved, setSaved] = useState<string | null>(null);

    const handleSave = (section: string) => {
        setSaved(section);
        setTimeout(() => setSaved(null), 2500);
        toast.success("Settings saved", { description: `${section} updated successfully.`, duration: 3000 });
    };

    const SaveButton = ({ section }: { section: string }) => (
        <div className="flex justify-end pt-2">
            <button
                onClick={() => handleSave(section)}
                className={cn(
                    "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                    saved === section ? "bg-emerald-500" : "bg-primary-500 hover:bg-primary-600"
                )}
            >
                {saved === section ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
        </div>
    );

    return (
        <div className="space-y-5">
            <AccountPageHeader title="Account Settings" subtitle="Manage your profile, business details and preferences" />

            {/* Profile */}
            <SectionCard icon={User} title="Personal Information" iconBg="bg-primary-50" iconColor="text-primary-600">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Full Name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                    <FormField label="Email Address" value={profile.email} type="email" onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
                    <FormField label="Phone Number" value={profile.phone} type="tel" onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
                    <FormField label="Designation" value={profile.designation} onChange={(v) => setProfile((p) => ({ ...p, designation: v }))} />
                </div>
                <SaveButton section="Profile" />
            </SectionCard>

            {/* Business */}
            <SectionCard icon={Building2} title="Business Details" iconBg="bg-indigo-50" iconColor="text-indigo-600">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <FormField label="Company / Clinic Name" value={business.company} onChange={(v) => setBusiness((b) => ({ ...b, company: v }))} />
                    </div>
                    <FormField label="GSTIN" value={business.gst} onChange={(v) => setBusiness((b) => ({ ...b, gst: v }))} hint="15-digit Goods & Services Tax Identification Number" />
                    <FormField label="PAN Number" value={business.pan} onChange={(v) => setBusiness((b) => ({ ...b, pan: v }))} hint="10-character Permanent Account Number" />
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-xs font-semibold text-emerald-800">GST Verified Account</p>
                        <p className="text-[11px] text-emerald-700">Your GSTIN is verified. GST invoices are generated automatically for all orders.</p>
                    </div>
                </div>
                <SaveButton section="Business" />
            </SectionCard>

            {/* Password */}
            <SectionCard icon={Lock} title="Change Password" iconBg="bg-amber-50" iconColor="text-amber-600">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <FormField label="Current Password" value={password.current} type={showPw ? "text" : "password"} onChange={(v) => setPassword((p) => ({ ...p, current: v }))} />
                    </div>
                    <FormField label="New Password" value={password.newPw} type={showPw ? "text" : "password"} onChange={(v) => setPassword((p) => ({ ...p, newPw: v }))} hint="Minimum 8 characters" />
                    <FormField label="Confirm New Password" value={password.confirm} type={showPw ? "text" : "password"} onChange={(v) => setPassword((p) => ({ ...p, confirm: v }))} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => setShowPw((s) => !s)} className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700">
                        {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showPw ? "Hide" : "Show"} passwords
                    </button>
                </div>
                <SaveButton section="Password" />
            </SectionCard>

            {/* Notifications */}
            <SectionCard icon={Bell} title="Notification Preferences" iconBg="bg-rose-50" iconColor="text-rose-500">
                <div className="space-y-3">
                    {[
                        { key: "orderUpdates", label: "Order Updates",     sub: "Shipping, delivery and tracking notifications" },
                        { key: "smsAlerts",    label: "SMS Alerts",        sub: "Important alerts via SMS to your registered number" },
                        { key: "newsletters",  label: "Product Updates",   sub: "New arrivals, restocks and feature announcements" },
                        { key: "promotions",   label: "Promotions & Offers",sub: "Exclusive deals and seasonal offers" },
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
                <SaveButton section="Notifications" />
            </SectionCard>

            {/* Danger zone */}
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
