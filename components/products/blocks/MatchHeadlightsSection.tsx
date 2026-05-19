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
                    <h4 className="text-sm font-semibold text-neutral-800">Match Headlights</h4>
                    <p className="mt-0.5 text-xs text-neutral-500">Add a compatible LED headlight to your loupes order. Billed separately.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition-colors", isEnabled ? "bg-primary-500" : "bg-neutral-300")}
                >
                    <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform", isEnabled ? "translate-x-6" : "translate-x-1")} />
                </button>
            </div>

            {/* Content */}
            {isEnabled && (
                <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {filteredCategories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCategoryId(category.id)}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                                    activeCategoryId === category.id
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "hover:border-primary-300 hover:text-primary-600 cursor-pointer border border-neutral-300 bg-white text-neutral-600"
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
                                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-white p-1">
                                    <Image src={product.image} alt={product.name} fill className="object-contain" sizes="96px" />
                                </div>
                                <span className="text-center text-xs font-medium text-neutral-700">{product.name}</span>
                                <Link href={`/our-headlights`} className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-0.5 text-xs transition-colors">
                                    Read More <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
