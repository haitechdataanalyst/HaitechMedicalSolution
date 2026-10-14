"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { inventoryApi, ZohoInventoryItem } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    ArrowLeft, Package, CheckCircle2, AlertCircle, XCircle,
    Tag, Building2, Layers, RefreshCw, ShoppingCart,
    FileText, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import { SkeletonBar } from "@/components/catalog/listing";

const SECTION_TITLE = "text-[15px] font-semibold tracking-[-0.01em] text-neutral-900";

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ qty }: { qty: number }) {
    if (qty > 10) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> In Stock ({qty} available)
        </span>
    );
    if (qty > 0) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
            <AlertCircle className="h-4 w-4" aria-hidden="true" /> Low Stock — Only {qty} left
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
            <XCircle className="h-4 w-4" aria-hidden="true" /> Out of Stock
        </span>
    );
}

// ── Spec row ──────────────────────────────────────────────────────────────────
function SpecRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-center gap-3 py-3">
            <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
            <div className="flex flex-1 items-start justify-between gap-4">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-right text-sm font-medium text-neutral-900">{value}</span>
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
    return (
        <div role="status" aria-label="Loading item" className="container py-8 md:py-12 motion-safe:animate-pulse">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                <div className={cn(SURFACE_CARD, "p-2")}>
                    <div className="aspect-square max-h-[420px] w-full rounded-xl bg-neutral-50" />
                </div>
                <div className={cn(SURFACE_CARD, "flex flex-col gap-4 p-6 md:p-8")}>
                    <SkeletonBar className="h-3.5 w-24" />
                    <SkeletonBar className="h-8 w-3/4" />
                    <SkeletonBar className="h-4 w-32" />
                    <SkeletonBar className="h-8 w-36" />
                    <SkeletonBar className="h-9 w-40" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between pt-2">
                            <SkeletonBar className="h-3.5 w-24" />
                            <SkeletonBar className="h-3.5 w-20" />
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
        <div className="min-h-screen bg-neutral-50/50">
            {/* Back link */}
            <div className="container pt-4">
                <Link
                    href="/inventory"
                    className="hover:text-primary-700 focus-visible:outline-primary-500 -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors focus-visible:outline-2"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Inventory
                </Link>
            </div>

            {loading && <DetailSkeleton />}

            {error && (
                <div role="alert" className="container py-16 text-center md:py-24">
                    <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" aria-hidden="true" />
                    <p className="text-lg font-semibold text-neutral-900">{error}</p>
                    <Link href="/inventory" className={cn(PILL_PRIMARY, "mt-6")}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go back
                    </Link>
                </div>
            )}

            {!loading && item && (
                <div className="container pt-4 pb-16 md:pb-24">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">

                        {/* ── Left: Image ── */}
                        <div className="flex flex-col gap-4 lg:gap-6">
                            <div className={cn(SURFACE_CARD, "p-2")}>
                                <div className="flex aspect-square max-h-[420px] w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-10 mix-blend-multiply" />
                                    ) : (
                                        <Package className="h-16 w-16 text-neutral-300" aria-hidden="true" />
                                    )}
                                </div>
                            </div>

                            {/* Stock detail card */}
                            <div className={cn(SURFACE_CARD, "p-6")}>
                                <h2 className={cn(SECTION_TITLE, "mb-4")}>Stock levels</h2>
                                <div className="grid grid-cols-3 divide-x divide-neutral-900/[0.06]">
                                    {[
                                        { label: "On Hand", value: item.stockOnHand },
                                        { label: "Committed", value: item.committedStock },
                                        { label: "Available", value: item.availableForSale },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col items-center gap-0.5 px-3 text-center">
                                            <span className={cn(
                                                "text-2xl font-semibold tracking-[-0.02em] tabular-nums",
                                                label === "Available" && value === 0 ? "text-red-600"
                                                    : label === "Available" && value <= 10 ? "text-amber-600"
                                                    : "text-neutral-900"
                                            )}>{value}</span>
                                            <span className="text-[13px] text-neutral-500">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Details ── */}
                        <div className="flex flex-col">
                            <div className={cn(SURFACE_CARD, "p-6 md:p-8")}>
                                {/* Status + category */}
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    {item.category && (
                                        <span className="bg-primary-50 text-primary-800 rounded-full px-3 py-1 text-xs font-medium">
                                            {item.category}
                                        </span>
                                    )}
                                    {item.brand && (
                                        <span className="rounded-full bg-neutral-900/[0.05] px-3 py-1 text-xs font-medium text-neutral-700">
                                            {item.brand}
                                        </span>
                                    )}
                                    {item.status === "inactive" && (
                                        <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">Inactive</span>
                                    )}
                                </div>

                                {/* Name */}
                                <h1 className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[2rem]">{item.name}</h1>

                                {/* Stock badge */}
                                <div className="mt-4">
                                    <StockBadge qty={item.availableForSale} />
                                </div>

                                {/* Price */}
                                <div className="mt-5 flex items-baseline gap-2">
                                    {item.rate > 0 ? (
                                        <>
                                            <span className="text-3xl font-semibold tracking-[-0.02em] text-neutral-900 tabular-nums">{formatPrice(item.rate)}</span>
                                            {item.unit && <span className="text-sm text-neutral-500">per {item.unit}</span>}
                                        </>
                                    ) : (
                                        <span className="text-lg text-neutral-500">Price on request</span>
                                    )}
                                </div>
                                {item.taxRate != null && item.taxRate > 0 && (
                                    <p className="mt-1 text-[13px] text-neutral-500">
                                        + {item.taxRate}% {item.taxName || "Tax"} · excl. taxes
                                    </p>
                                )}

                                {/* Description */}
                                {item.description && (
                                    <p className="mt-6 text-[15px] leading-relaxed text-neutral-600">
                                        {item.description}
                                    </p>
                                )}

                                {/* Specs */}
                                <div className="mt-8 divide-y divide-neutral-900/[0.06]">
                                    <h2 className={cn(SECTION_TITLE, "pb-2")}>Item details</h2>
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
                                    <p className="mt-4 text-[13px] text-neutral-500">
                                        Last updated: {new Date(item.lastModified).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* CTA */}
                            <div className={cn(SURFACE_CARD, "mt-4 p-6 lg:mt-6")}>
                                <p className="mb-4 text-[15px] leading-relaxed text-neutral-600">
                                    Interested in this item? Contact us for availability and bulk pricing.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/support/contact?subject=${encodeURIComponent(`Enquiry: ${item.name}`)}`}
                                        className={PILL_PRIMARY}
                                    >
                                        Enquire Now
                                    </Link>
                                    <Link
                                        href="/inventory"
                                        className="focus-visible:outline-primary-500 inline-flex min-h-12 items-center gap-2 rounded-full bg-neutral-900/[0.05] px-7 text-[15px] font-semibold text-neutral-800 transition-[transform,background-color] duration-200 ease-out hover:bg-neutral-900/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                                    >
                                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Items
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
