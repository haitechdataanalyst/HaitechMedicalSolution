import { Product, ProductVariant } from "@/types";

// Strauss category IDs (Strauss parent 40, subcategories 41–52)
export const STRAUSS_CATEGORY_IDS = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

/**
 * Check if a product is a Strauss grit-based product
 */
export const isStraussGritProduct = (product: Product): boolean =>
  Boolean(
    product.hasVariants &&
      product.variantType === "grit" &&
      product.variants?.length &&
      STRAUSS_CATEGORY_IDS.includes(product.category)
  );

/**
 * Check if a product uses legacy variant structure (non-frame, non-grit variants like Salli colors)
 */
export const isLegacyVariantProduct = (product: Product): boolean =>
  Boolean(
    product.hasVariants &&
      product.variants &&
      product.variants.length > 0 &&
      product.variantType !== "frame-color" &&
      !isStraussGritProduct(product)
  );

/**
 * Check if a product has frame variants
 */
export const hasFrameVariants = (product: Product, framesCount: number): boolean =>
  product.variantType === "frame-color" && Boolean(product.frameVariants) && framesCount > 0;

/**
 * Get grit diamond style based on variant ID/SKU/name
 */
export function getGritDiamondStyle(variant: ProductVariant): { bg: string; letter: string } {
  const id = (variant.id ?? "").toLowerCase();
  const sku = (variant.sku ?? "").toUpperCase();
  const name = (variant.name ?? "").toLowerCase();

  if (id.endsWith("-c") || sku.endsWith("-C") || name === "coarse") {
    return { bg: "bg-emerald-600", letter: "C" };
  }
  if (id.endsWith("-f") || sku.endsWith("-F") || name === "fine") {
    return { bg: "bg-red-600", letter: "F" };
  }
  if (id.endsWith("-m") || sku.endsWith("-M") || name === "medium") {
    return { bg: "bg-neutral-200", letter: "M" };
  }

  return { bg: "bg-neutral-300", letter: (sku.split("-").pop() ?? "?").slice(0, 1) };
}

/**
 * Format a color/variant ID into a display name
 */
export function formatColorName(colorId: string): string {
  return colorId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
