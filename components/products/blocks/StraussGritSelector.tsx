"use client";

import { ProductVariant } from "@/types";
import { cn } from "@/lib/utils";
import { getGritDiamondStyle } from "./variant-utils";
import { OPTION_IDLE, OPTION_LABEL, OPTION_SELECTED, OPTION_TILE } from "./option-styles";
import Image from "next/image";

interface StraussGritSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant) => void;
}

export default function StraussGritSelector({ variants, selectedVariant, onVariantSelect }: StraussGritSelectorProps) {
    return (
        <div role="group" aria-label="Select Variant">
            <p className={OPTION_LABEL}>Select Variant</p>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {variants.map((variant) => {
                    const { bg, letter } = getGritDiamondStyle(variant);
                    const isSelected = selectedVariant?.id === variant.id;
                    const codeLabel = (variant.sku ?? variant.id).replace(/-/g, "");

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onVariantSelect(variant)}
                            aria-pressed={isSelected}
                            className={cn(OPTION_TILE, "flex flex-col items-center p-2 pb-2.5", isSelected ? OPTION_SELECTED : OPTION_IDLE)}
                            title={variant.name ?? variant.sku}
                        >
                            {/* Grit diamond in top-left */}
                            <span
                                aria-hidden="true"
                                className={`absolute top-2 left-2 flex h-6 w-6 items-center justify-center text-xs font-bold ${letter === "M" ? "text-neutral-700" : "text-white"} ${bg}`}
                                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                            >
                                {letter}
                            </span>

                            <span className="relative block h-14 w-10 shrink-0">
                                <Image src={variant.image} alt="" fill className="object-contain object-center" sizes="40px" />
                            </span>

                            <span className="mt-1.5 text-[13px] font-semibold text-neutral-900 tabular-nums">{codeLabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
