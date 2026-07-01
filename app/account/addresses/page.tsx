"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { userApi, Address } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccountPageHeader, FormField } from "@/components/account";

type FormState = {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;
    isDefault: boolean;
};

const EMPTY: FormState = {
    fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "",
    city: "", state: "", postalCode: "", country: "India", addressType: "home", isDefault: false,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [isSaving, setIsSaving] = useState(false);

    const load = () => {
        userApi.getAddresses().then((res) => {
            if (res.success && res.data?.addresses) setAddresses(res.data.addresses);
        }).finally(() => setIsLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setForm(EMPTY);
        setEditId(null);
        setShowForm(true);
    };

    const openEdit = (addr: Address) => {
        setForm({
            fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 ?? "", landmark: addr.landmark ?? "",
            city: addr.city, state: addr.state, postalCode: addr.postalCode,
            country: addr.country, addressType: addr.addressType, isDefault: addr.isDefault,
        });
        setEditId(addr.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const res = await userApi.deleteAddress(id);
        if (res.success) {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            toast.success("Address removed");
        } else {
            toast.error(res.message || "Failed to remove address");
        }
    };

    const handleSetDefault = async (id: string) => {
        const res = await userApi.setDefaultAddress(id);
        if (res.success) {
            setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
            toast.success("Default address updated");
        } else {
            toast.error(res.message || "Failed to update default");
        }
    };

    const handleSave = async () => {
        if (!form.fullName || !form.addressLine1 || !form.city || !form.postalCode) {
            toast.error("Please fill all required fields");
            return;
        }
        setIsSaving(true);
        const payload = {
            fullName: form.fullName, phone: form.phone, addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || null, landmark: form.landmark || null,
            city: form.city, state: form.state, postalCode: form.postalCode,
            country: form.country, addressType: form.addressType, isDefault: form.isDefault,
        };

        const res = editId
            ? await userApi.updateAddress(editId, payload)
            : await userApi.addAddress(payload);

        setIsSaving(false);

        if (res.success) {
            toast.success(editId ? "Address updated" : "Address added");
            setShowForm(false);
            setEditId(null);
            load();
        } else {
            toast.error(res.message || "Failed to save address");
        }
    };

    const f = (key: keyof FormState) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

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
                        <FormField label="Full Name *"       value={form.fullName}      placeholder="Dr. Ranvijay Singh"   onChange={f("fullName")}      />
                        <FormField label="Phone"             value={form.phone}         placeholder="+91 98765 43210"      onChange={f("phone")}         />
                        <FormField label="Address Line 1 *"  value={form.addressLine1}  placeholder="Street, Floor, etc."  onChange={f("addressLine1")}  className="sm:col-span-2" />
                        <FormField label="Address Line 2"    value={form.addressLine2}  placeholder="Area / Locality"      onChange={f("addressLine2")}  className="sm:col-span-2" />
                        <FormField label="Landmark"          value={form.landmark}      placeholder="Near hospital, etc."  onChange={f("landmark")}      className="sm:col-span-2" />
                        <FormField label="City *"            value={form.city}          placeholder="Mumbai"               onChange={f("city")}          />
                        <FormField label="State"             value={form.state}         placeholder="Maharashtra"           onChange={f("state")}         />
                        <FormField label="PIN Code *"        value={form.postalCode}    placeholder="400069"               onChange={f("postalCode")}    />
                        <FormField label="Country"           value={form.country}       placeholder="India"                onChange={f("country")}       />
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
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
                        >
                            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {editId ? "Save Changes" : "Add Address"}
                        </button>
                    </div>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-white" />)}
                </div>
            ) : addresses.length === 0 ? (
                <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-14 text-center shadow-sm">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                    <p className="text-sm font-medium text-neutral-500">No saved addresses yet</p>
                    <button onClick={openAdd} className="mt-3 text-xs font-semibold text-primary-600 hover:underline">
                        Add your first address →
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((addr) => (
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
                                        <MapPin className={cn("h-3.5 w-3.5", addr.isDefault ? "text-primary-600" : "text-neutral-500")} />
                                    </div>
                                    <span className={cn("text-xs font-bold capitalize", addr.isDefault ? "text-primary-700" : "text-neutral-700")}>
                                        {addr.addressType}
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
                                <p className="text-sm font-semibold text-neutral-800">{addr.fullName}</p>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                    {addr.addressLine1}
                                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                                    {addr.landmark && `, ${addr.landmark}`}<br />
                                    {addr.city}, {addr.state} — {addr.postalCode}<br />
                                    {addr.country}
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
                    ))}
                </div>
            )}
        </div>
    );
}
