"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Package2, ArrowRight } from "lucide-react";
import { useCompare } from "./CompareProvider";
import { formatPrice } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";

export function CompareModal() {
    const { items, isOpen, closeModal, remove } = useCompare();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Escape closes; focus moves into the dialog and returns to the trigger afterwards.
    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    // Collect all unique spec labels across all compared items
    const allLabels = Array.from(new Set(items.flatMap((item) => (item.specs ?? []).map((s) => s.label))));

    return (
        <div className="fixed inset-0 z-[300] flex items-end justify-center px-0 sm:items-center sm:px-6">
            {/* Scrim */}
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-200 ease-out starting:opacity-0" onClick={closeModal} aria-hidden="true" />

            {/* Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="compare-modal-title"
                className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_32px_64px_-24px_rgba(15,23,42,0.35)] transition-[opacity,transform] duration-200 ease-out sm:rounded-3xl starting:opacity-0 motion-safe:starting:translate-y-4 sm:motion-safe:starting:translate-y-0 sm:motion-safe:starting:scale-[0.97]"
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between gap-4 py-3 pr-3 pl-6 sm:pl-8">
                    <div className="py-1">
                        <h2 id="compare-modal-title" className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">
                            Compare Products
                        </h2>
                        <p className="text-[13px] text-neutral-500">Side-by-side specification comparison</p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={closeModal}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900/[0.05] text-neutral-600 transition-colors hover:bg-neutral-900/[0.08] hover:text-neutral-900"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Scrollable table */}
                <div className="flex-1 overflow-auto overscroll-contain">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                {/* Sticky label column */}
                                <th className="sticky left-0 z-10 w-36 bg-white p-4 pl-6 text-left align-bottom text-[13px] font-medium text-neutral-500 sm:pl-8">Specification</th>

                                {/* Product columns */}
                                {items.map((item) => (
                                    <th key={item.id} className="min-w-[200px] p-4 text-left align-top font-normal">
                                        <div className="relative flex flex-col items-start gap-2">
                                            {/* Image */}
                                            <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-neutral-50">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-contain p-3 mix-blend-multiply" sizes="112px" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package2 className="h-10 w-10 text-neutral-300" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remove */}
                                            <button
                                                type="button"
                                                onClick={() => remove(item.id)}
                                                className="absolute top-0 right-0 flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/[0.05]">
                                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                                </span>
                                            </button>

                                            {/* Name + brand */}
                                            {item.brand && <span className="mt-2 text-[13px] text-neutral-500">{item.brand}</span>}
                                            <p className="-mt-1.5 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.name}</p>

                                            {/* Price */}
                                            {shouldShowPrice(item.brand) && item.price ? (
                                                <p className="text-base font-semibold text-neutral-900 tabular-nums">{formatPrice(item.price, item.currency ?? "INR")}</p>
                                            ) : (
                                                <p className="text-[13px] text-neutral-500">Price on request</p>
                                            )}

                                            {/* Link */}
                                            <Link href={item.href} className="text-primary-700 hover:text-primary-800 inline-flex min-h-11 items-center gap-1 text-sm font-medium transition-colors">
                                                View Product
                                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-900/[0.06]">
                            {allLabels.length > 0 ? (
                                allLabels.map((label) => (
                                    <tr key={label}>
                                        <td className="sticky left-0 bg-white px-4 py-3 pl-6 text-[13px] font-medium text-neutral-500 sm:pl-8">{label}</td>
                                        {items.map((item) => {
                                            const spec = item.specs?.find((s) => s.label === label);
                                            return (
                                                <td key={item.id} className="px-4 py-3 text-sm text-neutral-800">
                                                    {spec?.value ?? <span className="text-neutral-400">—</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={items.length + 1} className="px-4 py-14 text-center">
                                        <p className="text-[15px] text-neutral-700">No detailed specifications available for these products.</p>
                                        <p className="mt-1 text-[13px] text-neutral-500">Visit each product page for full details.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="h-4" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
