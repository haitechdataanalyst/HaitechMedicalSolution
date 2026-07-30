"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, GitCompareArrows, Package2, ExternalLink, Minus } from "lucide-react";
import { useCompare } from "./CompareProvider";
import { formatPrice } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";

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
    const allLabels = Array.from(
        new Set(items.flatMap((item) => (item.specs ?? []).map((s) => s.label)))
    );
    const anyPriceVisible = items.some((item) => shouldShowPrice(item.brand));

    return (
        <div
            id="inline-compare-section"
            ref={sectionRef}
            className="mt-12 scroll-mt-24 border-t border-neutral-200 pt-10"
        >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50">
                        <GitCompareArrows className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">Product Comparison</h2>
                        <p className="text-sm text-neutral-400">
                            {items.length} product{items.length !== 1 ? "s" : ""} selected
                            {items.length < 2 && " — add one more to compare"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={clear}
                    className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                </button>
            </div>

            {/* Product Cards Row */}
            <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(items.length, 2)}, minmax(0, 1fr))` }}>
                {items.map((item) => (
                    <ProductCompareCard key={item.id} item={item} onRemove={() => remove(item.id)} />
                ))}
                {/* Empty slot */}
                {items.length < 3 && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                            <GitCompareArrows className="h-5 w-5 text-neutral-300" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-neutral-400">Add a product</p>
                            <p className="mt-0.5 text-xs text-neutral-300">Browse and click Compare on any product</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Spec Table */}
            {items.length >= 2 && (
                <div className="overflow-hidden rounded-2xl border border-neutral-100">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50">
                                <th className="sticky left-0 w-40 bg-neutral-50 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    Specification
                                </th>
                                {items.map((item) => (
                                    <th key={item.id} className="px-5 py-3.5 text-left">
                                        <span className="block truncate text-sm font-bold text-neutral-800">{item.name}</span>
                                        {item.brand && (
                                            <span className="mt-0.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700">
                                                {item.brand}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Price row */}
                        <tbody>
                            <tr className="border-b border-neutral-50 bg-primary-50/30">
                                {anyPriceVisible && (
                                    <td className="sticky left-0 bg-primary-50/30 px-5 py-3.5 text-xs font-bold text-neutral-500 border-r border-neutral-100">
                                        Price
                                    </td>
                                )}
                                {items.map((item) => (
                                    <td key={item.id} className="px-5 py-3.5">
                                        {anyPriceVisible && (shouldShowPrice(item.brand) && item.price ? (
                                            <span className="text-base font-bold text-neutral-900">
                                                {formatPrice(item.price, item.currency ?? "INR")}
                                            </span>
                                        ) : (
                                            <span className="text-sm italic text-neutral-400">Price on request</span>
                                        ))}
                                    </td>
                                ))}
                            </tr>

                            {allLabels.length > 0 ? (
                                allLabels.map((label, idx) => (
                                    <tr
                                        key={label}
                                        className={`border-b border-neutral-50 ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
                                    >
                                        <td className="sticky left-0 bg-inherit px-5 py-3 text-xs font-semibold text-neutral-500 border-r border-neutral-100">
                                            {label}
                                        </td>
                                        {items.map((item) => {
                                            const spec = item.specs?.find((s) => s.label === label);
                                            return (
                                                <td key={item.id} className="px-5 py-3 text-sm text-neutral-700">
                                                    {spec?.value ?? (
                                                        <Minus className="h-3.5 w-3.5 text-neutral-300" />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={items.length + 1}
                                        className="px-5 py-8 text-center text-sm text-neutral-400"
                                    >
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
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-12 text-center">
                    <GitCompareArrows className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                    <p className="font-semibold text-neutral-500">Add one more product to see the comparison</p>
                    <p className="mt-1 text-sm text-neutral-400">
                        Browse products and click <span className="font-semibold">Compare</span> on any card
                    </p>
                </div>
            )}
        </div>
    );
}

function ProductCompareCard({ item, onRemove }: { item: ReturnType<typeof useCompare>["items"][number]; onRemove: () => void }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Remove button */}
            <button
                onClick={onRemove}
                className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${item.name}`}
            >
                <X className="h-3.5 w-3.5" />
            </button>

            {/* Image area */}
            <div className="relative flex h-48 items-center justify-center bg-gradient-to-b from-neutral-50 to-white p-6">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="h-36 w-36 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <Package2 className="h-16 w-16 text-neutral-200" />
                )}
            </div>

            {/* Info */}
            <div className="border-t border-neutral-100 px-4 py-4">
                {item.brand && (
                    <span className="mb-1.5 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary-700">
                        {item.brand}
                    </span>
                )}
                <h3 className="font-bold leading-snug text-neutral-900">{item.name}</h3>

                <div className="mt-2 flex items-center justify-between">
                    {shouldShowPrice(item.brand) && item.price ? (
                        <span className="text-base font-bold text-neutral-900">
                            {formatPrice(item.price, item.currency ?? "INR")}
                        </span>
                    ) : (
                        <span className="text-xs italic text-neutral-400">Price on request</span>
                    )}
                    <Link
                        href={item.href}
                        className="flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    >
                        View <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
