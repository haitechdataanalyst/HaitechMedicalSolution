"use client";

import { useCallback, useEffect, useState } from "react";
import { Product, ProductVariant, Frame } from "@/types";
import FrameColorSelector from "./FrameColorSelector";
import StraussProductBlock from "./StraussProductBlock";
import LegacyVariantSelector from "./LegacyVariantSelector";
import {
  isStraussGritProduct,
  isLegacyVariantProduct,
  hasFrameVariants,
} from "./variant-utils";

export interface VariantSelection {
  frameId?: string;
  colorId?: string;
  legacyVariant?: ProductVariant;
  image?: string;
}

interface VariantSelectorProps {
  product: Product;
  frames: Frame[];
  onSelectionChange: (selection: VariantSelection) => void;
}

// Get initial variant for products that need auto-selection
function getInitialVariant(product: Product): ProductVariant | null {
  if (isStraussGritProduct(product) && product.variants?.length) {
    return product.variants[0];
  }
  return null;
}

export default function VariantSelector({
  product,
  frames,
  onSelectionChange,
}: VariantSelectorProps) {
  // Initialize with default variant for Strauss products
  const [selectedLegacyVariant, setSelectedLegacyVariant] = useState<ProductVariant | null>(
    () => getInitialVariant(product)
  );

  // Notify parent when legacy variant changes
  useEffect(() => {
    if (selectedLegacyVariant) {
      onSelectionChange({
        legacyVariant: selectedLegacyVariant,
        image: selectedLegacyVariant.image,
      });
    }
  }, [selectedLegacyVariant, onSelectionChange]);

  // Handler for frame/color selection
  const handleFrameColorChange = useCallback(
    (selection: { frameId: string; colorId: string; image: string } | null) => {
      if (selection) {
        onSelectionChange({
          frameId: selection.frameId,
          colorId: selection.colorId,
          image: selection.image,
        });
      }
    },
    [onSelectionChange]
  );

  // Handler for legacy variant selection (Strauss grit, Salli colors, etc.)
  const handleLegacyVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedLegacyVariant(variant);
  }, []);

  // Determine which selector to render
  const productHasFrameVariants = hasFrameVariants(product, frames.length);
  const productIsStraussGrit = isStraussGritProduct(product);
  const productIsLegacyVariant = isLegacyVariantProduct(product);

  // Frame/Color selector for loupes
  if (productHasFrameVariants && product.frameVariants) {
    return (
      <FrameColorSelector
        frames={frames}
        frameVariants={product.frameVariants}
        onSelectionChange={handleFrameColorChange}
      />
    );
  }

  // Strauss grit selector with inline specifications
  if (productIsStraussGrit && product.variants) {
    return (
      <StraussProductBlock
        product={product}
        selectedVariant={selectedLegacyVariant}
        onVariantSelect={handleLegacyVariantSelect}
      />
    );
  }

  // Legacy color/variant selector (Salli, etc.)
  if (productIsLegacyVariant && product.variants) {
    return (
      <LegacyVariantSelector
        variants={product.variants}
        variantType={product.variantType ?? "variant"}
        selectedVariant={selectedLegacyVariant}
        onVariantSelect={handleLegacyVariantSelect}
      />
    );
  }

  // No variants to select
  return null;
}

// Export hook for managing variant selection state externally
export function useVariantSelection() {
  const [selection, setSelection] = useState<VariantSelection>({});

  const handleSelectionChange = useCallback((newSelection: VariantSelection) => {
    setSelection(newSelection);
  }, []);

  return {
    selection,
    handleSelectionChange,
  };
}
