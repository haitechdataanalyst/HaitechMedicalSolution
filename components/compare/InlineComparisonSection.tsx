"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Package2, ArrowRight, Minus } from "lucide-react";
import { useCompare } from "./CompareProvider";
import { formatPrice } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export function InlineComparisonSection() {
    const { items, remove, clear } = useCompare();
    const sectionRef = useRef<HTMLDivElement>(null);
    const prevCountRef = useRef(items.length);

    // Auto-scroll when items cross from 1 → 2+
    useEffect(() => {
        if (prevCountRef.current < 2 && items.length >= 2) {
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }
        prevCountRef.current = items.length;
    }, [items.length]);

    if (items.length === 0) return null;

    // All unique spec labels across all compared items
    const allLabels = Array.from(new Set(items.flatMap((item) => (item.specs ?? []).map((s) => s.label))));
    const anyPriceVisible = items.some((item) => shouldShowPrice(item.brand));

    return (
        <div id="inline-compare-section" ref={sectionRef} className="mt-16 scroll-mt-24">
            {/* Header */}
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-neutral-900 md:text-[28px]">Product Comparison</h2>
                    <p className="mt-1 text-[15px] text-neutral-500">
                        {items.length} product{items.length !== 1 ? "s" : ""} selected
                        {items.length < 2 && " — add one more to compare"}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={clear}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-900/[0.05] hover:text-neutral-900"
                >
                    Clear All
                </button>
            </div>

            {/* Product cards row */}
            <div className="mb-8 grid gap-4 md:gap-5" style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 2)}, minmax(0, 1fr))` }}>
                {items.map((item) => (
                    <ProductCompareCard key={item.id} item={item} onRemove={() => remove(item.id)} />
                ))}
                {/* Empty slot */}
                {items.length < 3 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-900/[0.03] p-8 text-center">
                        <p className="text-[15px] font-medium text-neutral-700">Add a product</p>
                        <p className="mt-1 text-[13px] text-neutral-500">Browse and click Compare on any product</p>
                    </div>
                )}
            </div>

            {/* Spec table */}
            {items.length >= 2 && (
                <div className={`${SURFACE_CARD} overflow-x-auto`}>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="sticky left-0 w-40 bg-white px-5 py-4 text-left text-[13px] font-medium text-neutral-500">Specification</th>
                                {items.map((item) => (
                                    <th key={item.id} className="px-5 py-4 text-left font-normal">
                                        {item.brand && <span className="block text-[13px] text-neutral-500">{item.brand}</span>}
                                        <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{item.name}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-900/[0.06]">
                            {/* Price row */}
                            <tr>
                                {anyPriceVisible && <td className="sticky left-0 bg-white px-5 py-3.5 text-[13px] font-medium text-neutral-500">Price</td>}
                                {items.map((item) => (
                                    <td key={item.id} className="px-5 py-3.5">
                                        {anyPriceVisible &&
                                            (shouldShowPrice(item.brand) && item.price ? (
                                                <span className="text-base font-semibold text-neutral-900 tabular-nums">{formatPrice(item.price, item.currency ?? "INR")}</span>
                                            ) : (
                                                <span className="text-sm text-neutral-500">Price on request</span>
                                            ))}
                                    </td>
                                ))}
                            </tr>

                            {allLabels.length > 0 ? (
                                allLabels.map((label) => (
                                    <tr key={label}>
                                        <td className="sticky left-0 bg-white px-5 py-3 text-[13px] font-medium text-neutral-500">{label}</td>
                                        {items.map((item) => {
                                            const spec = item.specs?.find((s) => s.label === label);
                                            return (
                                                <td key={item.id} className="px-5 py-3 text-sm text-neutral-800">
                                                    {spec?.value ?? <Minus className="h-3.5 w-3.5 text-neutral-400" aria-label="Not specified" />}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={items.length + 1} className="px-5 py-10 text-center text-sm text-neutral-500">
                                        No detailed specifications available — visit each product page for full details.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Waiting for more products */}
            {items.length === 1 && (
                <div className="rounded-2xl bg-neutral-900/[0.03] py-12 text-center">
                    <p className="text-[15px] font-medium text-neutral-800">Add one more product to see the comparison</p>
                    <p className="mt-1 text-sm text-neutral-500">
                        Browse products and click <span className="font-semibold">Compare</span> on any card
                    </p>
                </div>
            )}
        </div>
    );
}

function ProductCompareCard({ item, onRemove }: { item: ReturnType<typeof useCompare>["items"][number]; onRemove: () => void }) {
    return (
        <div className={`${SURFACE_CARD} group relative p-2`}>
            {/* Remove — 44px hit area around a 28px visual */}
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                aria-label={`Remove ${item.name}`}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
            </button>

            {/* Image tile */}
            <div className="relative flex h-48 items-center justify-center rounded-xl bg-neutral-50 p-6">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="h-36 w-36 object-contain mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                ) : (
                    <Package2 className="h-16 w-16 text-neutral-300" aria-hidden="true" />
                )}
            </div>

            {/* Info */}
            <div className="px-2.5 pt-4 pb-1.5">
                {item.brand && <p className="text-[13px] text-neutral-500">{item.brand}</p>}
                <h3 className="text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.name}</h3>

                <div className="mt-1 flex items-center justify-between gap-2">
                    {shouldShowPrice(item.brand) && item.price ? (
                        <span className="text-base font-semibold text-neutral-900 tabular-nums">{formatPrice(item.price, item.currency ?? "INR")}</span>
                    ) : (
                        <span className="text-[13px] text-neutral-500">Price on request</span>
                    )}
                    <Link href={item.href} className="text-primary-700 hover:text-primary-800 inline-flex min-h-11 items-center gap-1 text-sm font-medium transition-colors">
                        View <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
