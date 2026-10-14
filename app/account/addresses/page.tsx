"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { userApi, Address } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";
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
        <div className="space-y-6">
            <AccountPageHeader
                title="Saved Addresses"
                subtitle="Manage your delivery addresses"
                action={
                    <button type="button" onClick={openAdd} className="btn btn-primary btn-md">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add New
                    </button>
                }
            />

            {/* Add / Edit form */}
            {showForm && (
                <section className={cn(SURFACE_CARD, "overflow-hidden")} aria-labelledby="address-form-title">
                    <h2 id="address-form-title" className="px-6 pt-6 text-[17px] font-semibold tracking-[-0.015em] text-neutral-900 md:px-7">
                        {editId ? "Edit Address" : "New Address"}
                    </h2>
                    <div className="grid gap-5 px-6 pt-5 pb-2 sm:grid-cols-2 md:px-7">
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
                    <div className="flex justify-end gap-2 px-6 pt-4 pb-6 md:px-7">
                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary btn-md">
                            Cancel
                        </button>
                        <button type="button" onClick={handleSave} disabled={isSaving} className="btn btn-primary btn-md">
                            {isSaving && <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />}
                            {editId ? "Save Changes" : "Add Address"}
                        </button>
                    </div>
                </section>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2">
                    {[1, 2].map((i) => <div key={i} className="h-48 rounded-2xl bg-white motion-safe:animate-pulse" />)}
                </div>
            ) : addresses.length === 0 ? (
                <div className={cn(SURFACE_CARD, "px-6 py-16 text-center")}>
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-neutral-400" aria-hidden="true" />
                    <p className="text-[15px] text-neutral-600">No saved addresses yet</p>
                    <button type="button" onClick={openAdd} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary-700 hover:underline">
                        Add your first address
                    </button>
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2">
                    {addresses.map((addr) => (
                        <li
                            key={addr.id}
                            className={cn(SURFACE_CARD, "flex flex-col", addr.isDefault && "ring-2 ring-primary-700/40")}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between gap-3 pt-3 pr-3 pl-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-semibold text-neutral-900 capitalize">{addr.addressType}</span>
                                    {addr.isDefault && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                            <Star className="h-3 w-3" aria-hidden="true" />
                                            Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(addr)}
                                        aria-label={`Edit ${addr.addressType} address`}
                                        className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.05] hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                                    >
                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(addr.id)}
                                        aria-label={`Delete ${addr.addressType} address`}
                                        className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                                    >
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 px-6 pt-2 pb-5">
                                <p className="text-[15px] font-medium text-neutral-900">{addr.fullName}</p>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                                    {addr.addressLine1}
                                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                                    {addr.landmark && `, ${addr.landmark}`}<br />
                                    {addr.city}, {addr.state} — {addr.postalCode}<br />
                                    {addr.country}
                                </p>
                                {addr.phone && <p className="mt-2 text-[13px] text-neutral-500 tabular-nums">{addr.phone}</p>}
                            </div>

                            {/* Footer */}
                            {!addr.isDefault && (
                                <div className="px-4 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-medium text-primary-700 hover:text-primary-800 hover:underline"
                                    >
                                        Set as default
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
