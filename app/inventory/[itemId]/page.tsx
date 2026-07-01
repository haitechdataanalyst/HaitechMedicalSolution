"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { inventoryApi, ZohoInventoryItem } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    ArrowLeft, Package, CheckCircle2, AlertCircle, XCircle,
    Tag, Hash, Building2, Layers, RefreshCw, ShoppingCart,
    FileText, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ qty }: { qty: number }) {
    if (qty > 10) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> In Stock ({qty} available)
        </span>
    );
    if (qty > 0) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
            <AlertCircle className="h-4 w-4" /> Low Stock — Only {qty} left
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
            <XCircle className="h-4 w-4" /> Out of Stock
        </span>
    );
}

// ── Spec row ──────────────────────────────────────────────────────────────────
function SpecRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-3 border-b border-neutral-50 py-3 last:border-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                <Icon className="h-3.5 w-3.5 text-neutral-400" />
            </div>
            <div className="flex flex-1 items-start justify-between gap-4">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-right text-sm font-semibold text-neutral-800">{value}</span>
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
    return (
        <div className="container py-8">
            <div className="mb-6 h-4 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="h-80 animate-pulse rounded-2xl bg-neutral-200" />
                <div className="flex flex-col gap-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                    <div className="h-7 w-3/4 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
                    <div className="h-8 w-28 animate-pulse rounded-full bg-neutral-100" />
                    <div className="h-10 w-40 animate-pulse rounded bg-neutral-100" />
                    <div className="h-px bg-neutral-100" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                            <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InventoryItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<ZohoInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemId) return;
        setLoading(true);
        inventoryApi.getItem(decodeURIComponent(itemId))
            .then((res) => {
                if (res.success && res.data?.item) setItem(res.data.item);
                else setError(res.message || "Item not found");
            })
            .catch(() => setError("Could not load item details."))
            .finally(() => setLoading(false));
    }, [itemId]);

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Back breadcrumb */}
            <div className="border-b border-neutral-100 bg-white">
                <div className="container py-3">
                    <Link href="/inventory" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-primary-600">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Inventory
                    </Link>
                </div>
            </div>

            {loading && <DetailSkeleton />}

            {error && (
                <div className="container py-16 text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300" />
                    <p className="text-base font-semibold text-neutral-700">{error}</p>
                    <Link href="/inventory" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Go back
                    </Link>
                </div>
            )}

            {!loading && item && (
                <div className="container py-8">
                    <div className="grid gap-8 lg:grid-cols-2">

                        {/* ── Left: Image ── */}
                        <div className="flex flex-col gap-4">
                            <div className="flex aspect-square max-h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-8" />
                                ) : (
                                    <Package className="h-20 w-20 text-neutral-200" />
                                )}
                            </div>

                            {/* Stock detail card */}
                            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Stock Levels</h3>
                                <div className="grid grid-cols-3 divide-x divide-neutral-100">
                                    {[
                                        { label: "On Hand", value: item.stockOnHand },
                                        { label: "Committed", value: item.committedStock },
                                        { label: "Available", value: item.availableForSale },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col items-center gap-0.5 px-3 text-center">
                                            <span className={cn(
                                                "text-2xl font-bold",
                                                label === "Available" && value === 0 ? "text-red-500"
                                                    : label === "Available" && value <= 10 ? "text-amber-500"
                                                    : "text-neutral-800"
                                            )}>{value}</span>
                                            <span className="text-xs text-neutral-400">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Details ── */}
                        <div className="flex flex-col">
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                                {/* Status + category */}
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    {item.category && (
                                        <span className="rounded-full bg-primary-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-600">
                                            {item.category}
                                        </span>
                                    )}
                                    {item.brand && (
                                        <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-semibold text-neutral-600">
                                            {item.brand}
                                        </span>
                                    )}
                                    {item.status === "inactive" && (
                                        <span className="rounded-full bg-neutral-800 px-3 py-0.5 text-xs font-semibold text-white">Inactive</span>
                                    )}
                                </div>

                                {/* Name */}
                                <h1 className="text-2xl font-bold leading-snug text-neutral-900">{item.name}</h1>

                                {/* SKU */}
                                {item.sku && (
                                    <p className="mt-1 text-sm text-neutral-400">SKU: <span className="font-mono font-semibold text-neutral-600">{item.sku}</span></p>
                                )}

                                {/* Stock badge */}
                                <div className="mt-4">
                                    <StockBadge qty={item.availableForSale} />
                                </div>

                                {/* Price */}
                                <div className="mt-5 flex items-baseline gap-2">
                                    {item.rate > 0 ? (
                                        <>
                                            <span className="text-3xl font-bold text-neutral-900">{formatPrice(item.rate)}</span>
                                            {item.unit && <span className="text-sm text-neutral-400">per {item.unit}</span>}
                                        </>
                                    ) : (
                                        <span className="text-lg text-neutral-400">Price on request</span>
                                    )}
                                </div>
                                {item.taxRate != null && item.taxRate > 0 && (
                                    <p className="mt-1 text-xs text-neutral-400">
                                        + {item.taxRate}% {item.taxName || "Tax"} · excl. taxes
                                    </p>
                                )}

                                {/* Description */}
                                {item.description && (
                                    <p className="mt-5 border-t border-neutral-100 pt-5 text-sm leading-relaxed text-neutral-600">
                                        {item.description}
                                    </p>
                                )}

                                {/* Specs */}
                                <div className="mt-5 border-t border-neutral-100 pt-5">
                                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Item Details</h3>
                                    <SpecRow icon={Hash}      label="SKU"           value={item.sku} />
                                    <SpecRow icon={Layers}    label="Type"          value={item.itemType} />
                                    <SpecRow icon={Tag}       label="Unit"          value={item.unit} />
                                    <SpecRow icon={Building2} label="Brand"         value={item.brand} />
                                    <SpecRow icon={FileText}  label="HSN / SAC"     value={item.hsn} />
                                    <SpecRow icon={Info}      label="Tax"           value={item.taxRate != null ? `${item.taxRate}% ${item.taxName || ""}` : null} />
                                    <SpecRow icon={ShoppingCart} label="Reorder Level" value={item.reorderLevel ?? null} />
                                    {item.purchaseRate != null && item.purchaseRate > 0 && (
                                        <SpecRow icon={RefreshCw} label="Purchase Rate" value={formatPrice(item.purchaseRate)} />
                                    )}
                                </div>

                                {/* Last modified */}
                                {item.lastModified && (
                                    <p className="mt-4 text-xs text-neutral-400">
                                        Last updated: {new Date(item.lastModified).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
                                <p className="mb-3 text-sm text-neutral-500">
                                    Interested in this item? Contact us for availability and bulk pricing.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/support/contact?subject=${encodeURIComponent(`Enquiry: ${item.name}`)}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_2px_10px_-2px_rgb(31_182_205/0.45)] transition-all hover:bg-primary-600"
                                    >
                                        Enquire Now
                                    </Link>
                                    <Link
                                        href="/inventory"
                                        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> All Items
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
