"use client";

import { ProductVariant } from "@/types";
import { cn } from "@/lib/utils";
import { OPTION_IDLE, OPTION_LABEL, OPTION_SELECTED, OPTION_TILE } from "./option-styles";

interface LegacyVariantSelectorProps {
    variants: ProductVariant[];
    variantType: string;
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant) => void;
}

export default function LegacyVariantSelector({ variants, variantType, selectedVariant, onVariantSelect }: LegacyVariantSelectorProps) {
    const isColorType = variantType === "color";
    const groupLabel = isColorType ? "Select Color" : variantType === "model" ? "Select Model" : "Select Variant";

    return (
        <div role="group" aria-label={groupLabel}>
            <p className={OPTION_LABEL}>
                {groupLabel}
                {isColorType && selectedVariant && <span className="ml-2 font-normal text-neutral-500">{selectedVariant.name ?? selectedVariant.id}</span>}
            </p>
            <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                    const swatchColor = variant.color ?? variant.colorCode;
                    const isColorSwatch = Boolean(swatchColor);
                    const isSelected = selectedVariant?.id === variant.id;
                    const name = variant.name ?? variant.color ?? variant.frameStyle ?? variant.sku;

                    if (isColorSwatch) {
                        return (
                            <button
                                key={variant.id}
                                type="button"
                                onClick={() => onVariantSelect(variant)}
                                title={name}
                                aria-label={name}
                                aria-pressed={isSelected}
                                className={cn(
                                    "focus-visible:outline-primary-500 flex h-11 w-11 items-center justify-center rounded-full transition-[transform,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.94]",
                                    isSelected ? "ring-primary-700 ring-2" : "ring-1 ring-neutral-900/10 hover:ring-neutral-900/25"
                                )}
                            >
                                <span className="block h-8 w-8 rounded-full ring-1 ring-neutral-900/10 ring-inset" style={{ backgroundColor: swatchColor }} />
                            </button>
                        );
                    }

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onVariantSelect(variant)}
                            title={name}
                            aria-pressed={isSelected}
                            className={cn(OPTION_TILE, "px-4", isSelected ? OPTION_SELECTED : OPTION_IDLE)}
                        >
                            {variant.name ?? variant.frameStyle ?? variant.grit ?? variant.sku ?? variant.id}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
