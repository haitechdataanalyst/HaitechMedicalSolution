"use client";

import { useState } from "react";
import { MatchHeadlightsConfig, HeadlightCategory, HeadlightProduct } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface MatchHeadlightsProps {
    config: MatchHeadlightsConfig;
    headlightCategories: HeadlightCategory[];
}

export default function MatchHeadlightsSection({ config, headlightCategories }: MatchHeadlightsProps) {
    const [isEnabled, setIsEnabled] = useState(false);

    // Filter categories based on config
    const filteredCategories = config.categories ? headlightCategories.filter((c) => config.categories!.includes(c.id)) : headlightCategories;

    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(filteredCategories.length > 0 ? filteredCategories[0].id : null);

    const activeCategory = filteredCategories.find((c) => c.id === activeCategoryId);
    const products: HeadlightProduct[] = activeCategory?.products || [];

    return (
        <div className="space-y-3">
            {/* Header with toggle */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">Match Headlights</h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">Add a compatible LED headlight to your loupes order. Billed separately.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-label="Match Headlights"
                    aria-checked={isEnabled}
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={cn(
                        "focus-visible:outline-primary-500 relative mt-0.5 inline-flex h-8 w-[52px] before:absolute before:-inset-1.5 before:content-[''] shrink-0 items-center rounded-full transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                        isEnabled ? "bg-primary-700" : "bg-neutral-300"
                    )}
                >
                    <span className={cn("inline-block h-7 w-7 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.25)] transition-transform duration-200 ease-out", isEnabled ? "translate-x-[22px]" : "translate-x-0.5")} />
                </button>
            </div>

            {/* Content */}
            {isEnabled && (
                <div className="space-y-4 rounded-xl bg-neutral-50 p-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {filteredCategories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCategoryId(category.id)}
                                aria-pressed={activeCategoryId === category.id}
                                className={cn(
                                    "focus-visible:outline-primary-500 min-h-11 rounded-full px-4 text-[15px] font-medium transition-[transform,background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]",
                                    activeCategoryId === category.id ? "bg-primary-800 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-900/10 hover:text-neutral-900 hover:ring-neutral-900/25"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Products Carousel */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {products.map((product) => (
                            <div key={product.id} className="flex min-w-30 shrink-0 flex-col items-center gap-2">
                                <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white">
                                    <Image src={product.image} alt={product.name} fill className="object-contain p-2" sizes="96px" />
                                </div>
                                <span className="text-center text-[13px] font-medium text-neutral-800">{product.name}</span>
                                <Link href={`/our-headlights`} className="text-primary-700 hover:text-primary-800 inline-flex min-h-11 items-center gap-0.5 rounded-full px-2 text-[13px] font-medium">
                                    Read More <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
