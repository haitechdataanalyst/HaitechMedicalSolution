"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Building2, Home } from "lucide-react";
import { MOCK_ADDRESSES, MockAddress } from "@/lib/mock-account";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccountPageHeader, FormField } from "@/components/account";

const LABEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Clinic: Building2,
    Residence: Home,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<MockAddress[]>(MOCK_ADDRESSES);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ label: "", name: "", company: "", line1: "", line2: "", city: "", state: "", pin: "", phone: "" });

    const openAdd = () => {
        setForm({ label: "", name: "", company: "", line1: "", line2: "", city: "", state: "", pin: "", phone: "" });
        setEditId(null);
        setShowForm(true);
    };

    const openEdit = (addr: MockAddress) => {
        setForm({ label: addr.label, name: addr.name, company: addr.company, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pin: addr.pin, phone: addr.phone });
        setEditId(addr.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed");
    };

    const handleSetDefault = (id: string) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        toast.success("Default address updated");
    };

    const handleSave = () => {
        if (!form.line1 || !form.city || !form.pin) {
            toast.error("Please fill required fields");
            return;
        }
        if (editId) {
            setAddresses((prev) => prev.map((a) => a.id === editId ? { ...a, ...form } : a));
            toast.success("Address updated");
        } else {
            const newAddr: MockAddress = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 };
            setAddresses((prev) => [...prev, newAddr]);
            toast.success("Address added");
        }
        setShowForm(false);
        setEditId(null);
    };

    return (
        <div className="space-y-5">
            <AccountPageHeader
                title="Saved Addresses"
                subtitle="Manage your delivery addresses"
                action={
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add New
                    </button>
                }
            />

            {/* Add / Edit form */}
            {showForm && (
                <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
                    <div className="border-b border-neutral-100 bg-primary-50/50 px-6 py-4">
                        <h2 className="text-sm font-bold text-neutral-900">{editId ? "Edit Address" : "New Address"}</h2>
                    </div>
                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                        <FormField label="Label"           value={form.label}   placeholder="e.g. Clinic, Home"   onChange={(v) => setForm((p) => ({ ...p, label:   v }))} />
                        <FormField label="Full Name *"     value={form.name}    placeholder="Dr. Ranvijay Singh"  onChange={(v) => setForm((p) => ({ ...p, name:    v }))} />
                        <FormField label="Company / Clinic" value={form.company} placeholder="Optional"           onChange={(v) => setForm((p) => ({ ...p, company: v }))} className="sm:col-span-2" />
                        <FormField label="Address Line 1 *" value={form.line1}  placeholder="Street, Floor, etc." onChange={(v) => setForm((p) => ({ ...p, line1:   v }))} className="sm:col-span-2" />
                        <FormField label="Address Line 2"  value={form.line2}   placeholder="Area / Locality"     onChange={(v) => setForm((p) => ({ ...p, line2:   v }))} className="sm:col-span-2" />
                        <FormField label="City *"          value={form.city}    placeholder="Mumbai"              onChange={(v) => setForm((p) => ({ ...p, city:    v }))} />
                        <FormField label="State *"         value={form.state}   placeholder="Maharashtra"         onChange={(v) => setForm((p) => ({ ...p, state:   v }))} />
                        <FormField label="PIN Code *"      value={form.pin}     placeholder="400069"              onChange={(v) => setForm((p) => ({ ...p, pin:     v }))} />
                        <FormField label="Phone"           value={form.phone}   placeholder="+91 98765 43210"     onChange={(v) => setForm((p) => ({ ...p, phone:   v }))} />
                    </div>
                    <div className="flex justify-end gap-2 border-t border-neutral-100 px-6 py-4">
                        <button
                            onClick={() => setShowForm(false)}
                            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600"
                        >
                            {editId ? "Save Changes" : "Add Address"}
                        </button>
                    </div>
                </div>
            )}

            {/* Address cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => {
                    const LabelIcon = LABEL_ICONS[addr.label] ?? MapPin;
                    return (
                        <div
                            key={addr.id}
                            className={cn(
                                "relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
                                addr.isDefault ? "border-primary-200 shadow-[0_0_0_1px_rgba(31,182,205,0.2)]" : "border-neutral-100 hover:border-neutral-200"
                            )}
                        >
                            {/* Header */}
                            <div className={cn("flex items-center justify-between px-5 py-3.5", addr.isDefault ? "bg-primary-50" : "bg-neutral-50/50")}>
                                <div className="flex items-center gap-2">
                                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", addr.isDefault ? "bg-primary-100" : "bg-neutral-100")}>
                                        <LabelIcon className={cn("h-3.5 w-3.5", addr.isDefault ? "text-primary-600" : "text-neutral-500")} />
                                    </div>
                                    <span className={cn("text-xs font-bold", addr.isDefault ? "text-primary-700" : "text-neutral-700")}>
                                        {addr.label}
                                    </span>
                                    {addr.isDefault && (
                                        <span className="flex items-center gap-0.5 rounded-full bg-primary-500 px-2 py-0.5 text-[9px] font-bold text-white">
                                            <Star className="h-2.5 w-2.5" />
                                            Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openEdit(addr)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(addr.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 px-5 py-4">
                                <p className="text-sm font-semibold text-neutral-800">{addr.name}</p>
                                {addr.company && <p className="text-xs text-primary-600">{addr.company}</p>}
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                    {addr.line1}
                                    {addr.line2 && `, ${addr.line2}`}<br />
                                    {addr.city}, {addr.state} — {addr.pin}
                                </p>
                                {addr.phone && <p className="mt-1.5 text-xs text-neutral-500">{addr.phone}</p>}
                            </div>

                            {/* Footer */}
                            {!addr.isDefault && (
                                <div className="border-t border-neutral-100 px-5 py-3">
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                                    >
                                        Set as default
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
