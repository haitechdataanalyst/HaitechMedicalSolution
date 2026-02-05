"use client";

import { Product, ProductVariant, ContentBlock } from "@/types";
import StraussGritSelector from "./StraussGritSelector";
import InlineSpecificationsTable from "./InlineSpecificationsTable";

interface StraussProductBlockProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  showSpecifications?: boolean;
}

/**
 * Composite component for Strauss products that combines:
 * - Grit variant selector (diamond badges)
 * - Inline specifications table
 *
 * This maintains cohesive Strauss product display while keeping
 * individual components reusable.
 */
export default function StraussProductBlock({
  product,
  selectedVariant,
  onVariantSelect,
  showSpecifications = true,
}: StraussProductBlockProps) {
  if (!product.variants) {
    return null;
  }

  // Extract specifications from product content blocks
  const specsBlock = product.contentBlocks?.find(
    (b): b is ContentBlock & { type: "specifications" } => b.type === "specifications"
  );

  const specsData = specsBlock?.data as
    | {
        rows?: Array<{ label: string; value: string }>;
        specs?: Array<{ label: string; value: string }>;
        title?: string;
      }
    | undefined;

  const rows = specsData?.rows ?? specsData?.specs ?? [];
  const title = specsData?.title;

  return (
    <div className="space-y-6">
      <StraussGritSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onVariantSelect={onVariantSelect}
      />
    </div>
  );
}
