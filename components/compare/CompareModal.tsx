"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Package2, ExternalLink, GitCompareArrows } from "lucide-react";
import { useCompare } from "./CompareProvider";
import { formatPrice } from "@/lib/utils";
import { COMMERCE_ENABLED } from "@/lib/config";

export function CompareModal() {
    const { items, isOpen, closeModal, remove } = useCompare();

    if (!isOpen) return null;

    // Collect all unique spec labels across all compared items
    const allLabels = Array.from(
        new Set(items.flatMap((item) => (item.specs ?? []).map((s) => s.label)))
    );

    return (
        <div className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center px-0 sm:px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.3)] max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                            <GitCompareArrows className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-neutral-900">Compare Products</h2>
                            <p className="text-xs text-neutral-400">Side-by-side specification comparison</p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable table */}
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100">
                                {/* Sticky label column */}
                                <th className="sticky left-0 w-36 bg-neutral-50 p-4 text-left text-[11px] font-bold uppercase tracking-widest text-neutral-400 align-bottom">
                                    Specification
                                </th>

                                {/* Product columns */}
                                {items.map((item) => (
                                    <th key={item.id} className="min-w-[200px] p-5 text-left align-top">
                                        <div className="flex flex-col items-start gap-3">
                                            {/* Remove */}
                                            <button
                                                onClick={() => remove(item.id)}
                                                className="self-end rounded-full p-0.5 text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>

                                            {/* Image */}
                                            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain p-3"
                                                        sizes="112px"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package2 className="h-10 w-10 text-neutral-200" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name + brand */}
                                            <p className="font-semibold leading-snug text-neutral-900">{item.name}</p>
                                            {item.brand && (
                                                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary-700">
                                                    {item.brand}
                                                </span>
                                            )}

                                            {/* Price */}
                                            {COMMERCE_ENABLED && (item.price ? (
                                                <p className="text-base font-bold text-neutral-900">
                                                    {formatPrice(item.price, item.currency ?? "INR")}
                                                </p>
                                            ) : (
                                                <p className="text-xs italic text-neutral-400">Price on request</p>
                                            ))}

                                            {/* Link */}
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                                            >
                                                View Product
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {allLabels.length > 0 ? (
                                allLabels.map((label, idx) => (
                                    <tr
                                        key={label}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/70"}
                                    >
                                        <td className="sticky left-0 bg-inherit px-4 py-3 text-xs font-semibold text-neutral-500 border-r border-neutral-100">
                                            {label}
                                        </td>
                                        {items.map((item) => {
                                            const spec = item.specs?.find((s) => s.label === label);
                                            return (
                                                <td key={item.id} className="px-5 py-3 text-sm text-neutral-700">
                                                    {spec?.value ?? (
                                                        <span className="text-neutral-300">—</span>
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
                                        className="px-4 py-12 text-center text-sm text-neutral-400"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <GitCompareArrows className="h-8 w-8 text-neutral-200" />
                                            <p>No detailed specifications available for these products.</p>
                                            <p className="text-xs">Visit each product page for full details.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
