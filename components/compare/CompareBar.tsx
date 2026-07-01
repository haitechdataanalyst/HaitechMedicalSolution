"use client";

import Image from "next/image";
import { X, GitCompareArrows, Trash2, Package2 } from "lucide-react";
import { useCompare } from "./CompareProvider";

export function CompareBar() {
    const { items, remove, clear, openModal } = useCompare();

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom-4 duration-300">
            <div className="border-t border-neutral-200 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
                <div className="container py-3">
                    <div className="flex items-center gap-4">

                        {/* Label */}
                        <div className="hidden shrink-0 items-center gap-2 sm:flex">
                            <GitCompareArrows className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-semibold text-neutral-700">Compare</span>
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary-700">
                                {items.length}/3
                            </span>
                        </div>

                        {/* Product slots */}
                        <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-0.5">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative flex shrink-0 items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2"
                                >
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-white">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="40px" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package2 className="h-4 w-4 text-neutral-300" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="max-w-[110px] truncate text-xs font-medium text-neutral-700">
                                        {item.name}
                                    </span>
                                    <button
                                        onClick={() => remove(item.id)}
                                        className="ml-0.5 rounded-full p-0.5 text-neutral-300 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {/* Empty slots */}
                            {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex h-[52px] w-[80px] shrink-0 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50"
                                >
                                    <span className="text-[10px] text-neutral-300">+ Add more</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                onClick={clear}
                                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                            <button
                                onClick={() => {
                                    const section = document.getElementById("inline-compare-section");
                                    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                                    else openModal();
                                }}
                                disabled={items.length < 2}
                                className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <GitCompareArrows className="h-4 w-4" />
                                Compare Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
