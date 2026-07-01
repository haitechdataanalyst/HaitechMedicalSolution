"use client";

import { GitCompareArrows, Check, ChevronDown } from "lucide-react";
import { useCompare, type CompareItem } from "./CompareProvider";
import { usePathname } from "next/navigation";
import { type Product, type SpecificationsBlock } from "@/types";
import { detectBrand } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface CompareActionPanelProps {
    product: Product;
}

export function CompareActionPanel({ product }: CompareActionPanelProps) {
    const { items, add, remove, isAdded } = useCompare();
    const pathname = usePathname();
    const added = isAdded(String(product.id));
    const isFull = items.length >= 3 && !added;
    const brand = detectBrand(product.sku);

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
                onClick={handleToggle}
                disabled={isFull}
                className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                    added
                        ? "bg-primary-500 text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)]"
                        : isFull
                        ? "cursor-not-allowed border border-neutral-200 bg-neutral-100 text-neutral-300"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                )}
            >
                {added ? (
                    <>
                        <Check className="h-4 w-4" />
                        Added to Compare
                    </>
                ) : (
                    <>
                        <GitCompareArrows className="h-4 w-4" />
                        {isFull ? "Compare full (3/3)" : "Add to Compare"}
                    </>
                )}
            </button>

            {/* Scroll anchor — show when this product is added and there are others to compare with */}
            {added && items.length >= 2 && (
                <button
                    onClick={scrollToCompare}
                    className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
                >
                    See comparison
                    <ChevronDown className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
