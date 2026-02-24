"use client";

import { ProductVariant } from "@/types";
import { getGritDiamondStyle } from "./variant-utils";
import Image from "next/image";

interface StraussGritSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant) => void;
}

export default function StraussGritSelector({ variants, selectedVariant, onVariantSelect }: StraussGritSelectorProps) {
    return (
        <div>
            <label className="mb-3 block text-sm font-semibold text-neutral-800">Select Variant</label>
            <div className="flex flex-wrap gap-4">
                {variants.map((variant) => {
                    const { bg, letter } = getGritDiamondStyle(variant);
                    const isSelected = selectedVariant?.id === variant.id;
                    const codeLabel = (variant.sku ?? variant.id).replace(/-/g, "");

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onVariantSelect(variant)}
                            className={`relative flex w-30 flex-col rounded-xl border-2 bg-white shadow-sm transition-all hover:shadow-md ${
                                isSelected ? "border-primary-500" : "border-neutral-200 hover:border-neutral-300"
                            }`}
                            title={variant.name ?? variant.sku}
                        >
                            {/* Diamond shape in top-left */}
                            <span
                                className={`absolute top-2 left-2 flex h-7 w-7 items-center justify-center text-xs font-bold ${letter === "M" ? "text-neutral-700" : "text-white"} ${bg}`}
                                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                            >
                                {letter}
                            </span>

                            {/* Product image */}
                            <div className="flex min-h-18 flex-1 items-center justify-center px-2 pt-9 pb-2">
                                <div className="relative h-14 w-10 shrink-0">
                                    <Image src={variant.image} alt={variant.name ?? variant.sku} fill className="object-contain object-center" sizes="40px" />
                                </div>
                            </div>

                            <div className="border-t border-neutral-100 px-2 py-2">
                                <span className="text-sm font-bold text-neutral-800">{codeLabel}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
