"use client";

import { GitCompareArrows, Check, ChevronDown } from "lucide-react";
import { useCompare, type CompareItem } from "./CompareProvider";
import { usePathname } from "next/navigation";
import { type Product, type SpecificationsBlock } from "@/types";
import { detectBrand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { getCompareGroup } from "@/lib/compare-group.resolve";

interface CompareActionPanelProps {
    product: Product;
}

export function CompareActionPanel({ product }: CompareActionPanelProps) {
    const { items, add, remove, isAdded, activeGroup } = useCompare();
    const pathname = usePathname();
    const added = isAdded(String(product.id));
    const isFull = items.length >= 3 && !added;
    const brand = detectBrand(product.sku);
    const group = getCompareGroup(product.category);
    // Only products from the same category family can be compared (e.g. loupes with loupes, never with a Salli chair)
    const mismatch = !!activeGroup && !added && activeGroup.key !== group.key;

    if (brand.name !== "Admetec" && brand.name !== "Salli") return null;

    const buildItem = (): CompareItem => {
        const specs = product.contentBlocks
            ?.filter((b): b is SpecificationsBlock => b.type === "specifications")
            .flatMap((b) => b.data.rows ?? b.data.specs ?? []);
        return {
            id: String(product.id),
            name: product.name,
            image: product.defaultImage ?? product.gallery?.[0] ?? "/images/placeholder.jpg",
            href: pathname,
            price: product.basePrice,
            currency: product.currency,
            brand: brand.name,
            specs,
            group,
        };
    };

    const handleToggle = () => {
        if (added) {
            remove(String(product.id));
        } else if (!isFull) {
            add(buildItem());
        }
    };

    const scrollToCompare = () => {
        const section = document.getElementById("inline-compare-section");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleToggle}
                disabled={isFull}
                aria-pressed={added}
                title={mismatch ? `Compare works within one category — you are comparing ${activeGroup?.label}` : undefined}
                className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background-color,color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:enabled:active:scale-[0.97]",
                    added
                        ? "bg-primary-50 text-primary-800 hover:bg-primary-100"
                        : isFull
                          ? "cursor-not-allowed bg-neutral-900/[0.04] text-neutral-500"
                          : mismatch
                            ? "bg-neutral-900/[0.04] text-neutral-500 hover:bg-neutral-900/[0.08]"
                          : "bg-neutral-900/[0.05] text-neutral-800 hover:bg-neutral-900/[0.08]"
                )}
            >
                {added ? (
                    <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Added to Compare
                    </>
                ) : (
                    <>
                        <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                        {isFull ? "Compare full (3/3)" : "Add to Compare"}
                    </>
                )}
            </button>

            {/* Scroll anchor — show when this product is added and there are others to compare with */}
            {added && items.length >= 2 && (
                <button
                    type="button"
                    onClick={scrollToCompare}
                    className="text-primary-700 hover:text-primary-800 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors duration-200"
                >
                    See comparison
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
