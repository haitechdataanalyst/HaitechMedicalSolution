"use client";

import { ProductVariant } from "@/types";

interface LegacyVariantSelectorProps {
    variants: ProductVariant[];
    variantType: string;
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant) => void;
}

export default function LegacyVariantSelector({ variants, variantType, selectedVariant, onVariantSelect }: LegacyVariantSelectorProps) {
    const isColorType = variantType === "color";

    return (
        <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">
                {isColorType ? "Select Color" : variantType === "model" ? "Select Model" : "Select Variant"}
            </label>
            <div className="flex flex-wrap gap-4">
                {variants.map((variant) => {
                    const swatchColor = variant.color ?? variant.colorCode;
                    const isColorSwatch = Boolean(swatchColor);
                    const isSelected = selectedVariant?.id === variant.id;

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => onVariantSelect(variant)}
                            className="group relative flex flex-col items-center gap-2"
                            title={variant.name ?? variant.color ?? variant.frameStyle ?? variant.sku}
                        >
                            {isColorSwatch ? (
                                <span
                                    className={`block h-10 w-10 rounded-full border-2 shadow-sm transition-colors ${
                                        isSelected ? "border-primary-500 ring-primary-500 ring-2 ring-offset-2" : "hover:border-primary-400 border-neutral-300"
                                    }`}
                                    style={{ backgroundColor: swatchColor }}
                                />
                            ) : (
                                <span
                                    className={`block rounded-lg border-2 px-3 py-1.5 text-sm transition-colors ${
                                        isSelected ? "border-primary-500 ring-primary-500 ring-2 ring-offset-2" : "hover:border-primary-400 border-neutral-300"
                                    }`}
                                >
                                    {variant.name ?? variant.frameStyle ?? variant.grit ?? variant.sku ?? variant.id}
                                </span>
                            )}
                            {isColorType && variant.name && <span className={`text-xs ${isSelected ? "text-primary-700 font-medium" : "text-muted"}`}>{variant.name}</span>}
                        </button>
                    );
                })}
            </div>
            {isColorType && selectedVariant && <p className="text-muted mt-2 text-sm">Selected: {selectedVariant.name ?? selectedVariant.id}</p>}
        </div>
    );
}
