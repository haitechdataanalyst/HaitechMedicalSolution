"use client";

import Image from "next/image";
import { X, Package2 } from "lucide-react";
import { useCompare } from "./CompareProvider";

export function CompareBar() {
    const { items, remove, clear, openModal, activeGroup } = useCompare();

    if (items.length === 0) return null;

    return (
        <div
            role="region"
            aria-label="Product comparison"
            className="material-bar pb-safe fixed right-0 bottom-0 left-0 z-[60] shadow-[0_-1px_0_rgba(15,23,42,0.08),0_-12px_32px_-16px_rgba(15,23,42,0.18)] transition-[opacity,transform] duration-300 ease-out starting:opacity-0 motion-safe:starting:translate-y-4"
        >
            <div className="container py-3">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Label */}
                    <p className="hidden shrink-0 text-sm font-semibold text-neutral-900 sm:block">
                        Compare <span className="font-normal text-neutral-500 tabular-nums">{items.length}/3</span>
                        {activeGroup && <span className="font-normal text-neutral-500"> · {activeGroup.label}</span>}
                    </p>

                    {/* Product slots */}
                    <ul className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto">
                        {items.map((item) => (
                            <li key={item.id} className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-white py-1.5 pl-1.5 shadow-[0_0_0_1px_rgba(15,23,42,0.06)]">
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-1 mix-blend-multiply" sizes="40px" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Package2 className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                        </div>
                                    )}
                                </div>
                                <span className="max-w-[120px] truncate text-[13px] font-medium text-neutral-800">{item.name}</span>
                                <button
                                    type="button"
                                    onClick={() => remove(item.id)}
                                    className="flex h-11 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900"
                                    aria-label={`Remove ${item.name}`}
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-neutral-900/[0.06]">
                                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                                    </span>
                                </button>
                            </li>
                        ))}

                        {/* Empty slots */}
                        {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
                            <li key={i} className="flex h-[53px] w-24 shrink-0 items-center justify-center rounded-2xl bg-neutral-900/[0.04]">
                                <span className="text-xs text-neutral-500">Add another</span>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={clear}
                            className="hidden min-h-11 items-center rounded-full px-4 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-900/[0.05] hover:text-neutral-900 sm:inline-flex"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={clear}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-900/[0.05] sm:hidden"
                            aria-label="Clear comparison"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const section = document.getElementById("inline-compare-section");
                                if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
                                else openModal();
                            }}
                            disabled={items.length < 2}
                            className="bg-primary-800 hover:bg-primary-900 focus-visible:outline-primary-500 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:enabled:active:scale-[0.97]"
                        >
                            Compare<span className="hidden sm:inline">&nbsp;now</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
