"use client";

import { useState, useCallback, useEffect } from "react";
import { ActionsBlock as ActionsBlockType, Product, CartItem, Frame, ProductVariant } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui";
import FrameColorSelector from "./FrameColorSelector";
import ProductQuoteModal from "./ProductQuoteModal";
import Image from "next/image";

// Strauss category IDs (Strauss parent 40, subcategories 41–52)
const STRAUSS_CATEGORY_IDS = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
const isStraussGritProduct = (p: Product) =>
  Boolean(
    p.hasVariants &&
      p.variantType === "grit" &&
      p.variants?.length &&
      STRAUSS_CATEGORY_IDS.includes(p.category)
  );

function getGritDiamondStyle(variant: ProductVariant): { bg: string; letter: string } {
  const id = (variant.id ?? "").toLowerCase();
  const sku = (variant.sku ?? "").toUpperCase();
  const name = (variant.name ?? "").toLowerCase();
  if (id.endsWith("-c") || sku.endsWith("-C") || name === "coarse")
    return { bg: "bg-emerald-600", letter: "C" };
  if (id.endsWith("-f") || sku.endsWith("-F") || name === "fine")
    return { bg: "bg-red-600", letter: "F" };
  if (id.endsWith("-m") || sku.endsWith("-M") || name === "medium")
    return { bg: "bg-neutral-200", letter: "M" };
  return { bg: "bg-neutral-300", letter: (sku.split("-").pop() ?? "?").slice(0, 1) };
}

interface ActionsBlockProps {
  data: ActionsBlockType["data"];
  product: Product;
  onVariantSelect?: (imageUrl: string) => void;
  frames?: Frame[];
}

export default function ActionsBlock({ data, product, onVariantSelect, frames = [] }: ActionsBlockProps) {
  const { addItem } = useCart();
  const [quantity] = useState(1);
  const [customFields] = useState<Record<string, string | number>>({});
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedFrameColor, setSelectedFrameColor] = useState<{
    frameId: string;
    colorId: string;
    image: string;
  } | null>(null);
  const [selectedLegacyVariant, setSelectedLegacyVariant] = useState<ProductVariant | null>(null);

  // Strauss grit products: default to first variant so one is always selected
  useEffect(() => {
    if (isStraussGritProduct(product) && product.variants?.length && !selectedLegacyVariant) {
      setSelectedLegacyVariant(product.variants[0]);
    }
  }, [product.id, product.variants, selectedLegacyVariant]);

  // Handle frame/color selection change
  const handleFrameColorChange = useCallback(
    (selection: { frameId: string; colorId: string; image: string } | null) => {
      setSelectedFrameColor(selection);
      if (selection && onVariantSelect) {
        onVariantSelect(selection.image);
      }
    },
    [onVariantSelect]
  );

  const handleAddToCart = () => {
    // Build customization data including frame selection or legacy color (e.g. Salli)
    const customization: Record<string, string | number> = { ...customFields };
    if (selectedFrameColor) {
      customization.frame = selectedFrameColor.frameId;
      customization.color = selectedFrameColor.colorId;
    }
    if (selectedLegacyVariant) {
      customization.color = selectedLegacyVariant.name ?? selectedLegacyVariant.id;
      customization.variantSku = selectedLegacyVariant.sku;
    }

    const cartItem: CartItem = {
      productId: String(product.id),
      productName: product.name,
      sku: selectedLegacyVariant?.sku ?? product.sku,
      quantity,
      basePrice: product.basePrice,
      customization: Object.keys(customization).length > 0 ? customization : undefined,
      image: selectedFrameColor?.image ?? selectedLegacyVariant?.image ?? product.defaultImage,
    };

    addItem(cartItem);
  };
  // Get variant description for quote modal (frame+color or legacy color e.g. Salli)
  const getVariantDescription = (): string | undefined => {
    if (selectedFrameColor && product.frameVariants) {
      const frame = frames.find((f) => f.id === selectedFrameColor.frameId);
      const frameName = frame?.name || formatColorName(selectedFrameColor.frameId);
      const colorName = formatColorName(selectedFrameColor.colorId);
      return `${frameName} - ${colorName}`;
    }
    if (selectedLegacyVariant && product.variantType === "color") {
      return selectedLegacyVariant.name ?? selectedLegacyVariant.color ?? formatColorName(selectedLegacyVariant.id);
    }
    if (selectedLegacyVariant && product.variantType === "grit") {
      return selectedLegacyVariant.sku ?? selectedLegacyVariant.name ?? selectedLegacyVariant.id;
    }
    return undefined;
  };

  // Helper to format color ID into display name
  function formatColorName(colorId: string): string {
    return colorId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (!data.addToCart) {
    return null;
  }

  // Check if product has the new frame variants structure
  const hasFrameVariants = product.variantType === "frame-color" && product.frameVariants && frames.length > 0;

  // Legacy variant handling (e.g. Salli color) – track selection for quote and cart
  const handleLegacyVariantSelect = (variant: NonNullable<typeof product.variants>[number]) => {
    setSelectedLegacyVariant(variant);
    if (variant && onVariantSelect) {
      onVariantSelect(variant.image);
    }
  };

  return (
    <div className="bg-surface sticky top-24 space-y-6 rounded-xl border border-neutral-200 p-4 sm:p-6">
      {/* Frame/Color Selection for loupes */}
      {hasFrameVariants && product.frameVariants && <FrameColorSelector frames={frames} frameVariants={product.frameVariants} onSelectionChange={handleFrameColorChange} />}

      {/* Strauss grit: diamond variant selector (green C, red F, white M) + short description table */}
      {isStraussGritProduct(product) && product.variants && (
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-semibold text-neutral-800">Select Variant</label>
            <div className="flex flex-wrap gap-4">
              {product.variants.map((variant) => {
                const { bg, letter } = getGritDiamondStyle(variant);
                const isSelected = selectedLegacyVariant?.id === variant.id;
                const codeLabel = (variant.sku ?? variant.id).replace(/-/g, "");
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleLegacyVariantSelect(variant)}
                    className={`relative flex w-[120px] flex-col rounded-xl border-2 bg-white shadow-sm transition-all hover:shadow-md ${
                      isSelected ? "border-primary-500" : "border-neutral-200 hover:border-neutral-300"
                    }`}
                    title={variant.name ?? variant.sku}
                  >
                    {/* Diamond shape in top-left (proper rhombus, does not overlap image area) */}
                    <span
                      className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center text-xs font-bold ${letter === "M" ? "text-neutral-700" : "text-white"} ${bg}`}
                      style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                    >
                      {letter}
                    </span>
                    {/* Product image: small, centered, fully visible below the diamond */}
                    <div className="flex min-h-[72px] flex-1 items-center justify-center px-2 pt-9 pb-2">
                      <div className="relative h-14 w-10 shrink-0">
                        <Image
                          src={variant.image}
                          alt={variant.name ?? variant.sku}
                          fill
                          className="object-contain object-center"
                          sizes="40px"
                        />
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
          {(() => {
            const specsBlock = product.contentBlocks?.find((b) => b.type === "specifications");
            const data = specsBlock?.type === "specifications" ? (specsBlock.data as { rows?: Array<{ label: string; value: string }>; specs?: Array<{ label: string; value: string }>; title?: string }) : null;
            const rows: Array<{ label: string; value: string }> = (data?.rows ?? data?.specs) ?? [];
            if (rows.length === 0) return null;
            const title = data?.title;
            return (
              <div>
                {title && (
                  <h3 className="mb-3 text-sm font-semibold text-neutral-700">{title}</h3>
                )}
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <table className="w-full text-sm">
                    <tbody>
                      {rows.map((row: { label: string; value: string }, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-neutral-50" : "bg-white"}>
                          <td className="w-1/3 px-3 py-2.5 font-medium text-neutral-600">{row.label}</td>
                          <td className="px-3 py-2.5 text-neutral-800">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legacy Color/Variant Selection (for products still using old structure, e.g. Salli color options) */}
      {!hasFrameVariants && !isStraussGritProduct(product) && product.hasVariants && product.variants && product.variants.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">{product.variantType === "color" ? "Select Color" : "Select Variant"}</label>
          <div className="flex flex-wrap gap-4">
            {product.variants.map((variant) => {
              const swatchColor = variant.color ?? variant.colorCode;
              const isColorSwatch = Boolean(swatchColor);
              const isSelected = selectedLegacyVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleLegacyVariantSelect(variant)}
                  className="group relative flex flex-col items-center gap-2"
                  title={variant.name ?? variant.color ?? variant.frameStyle ?? variant.sku}
                >
                  {isColorSwatch ? (
                    <span
                      className={`block h-10 w-10 rounded-full border-2 shadow-sm transition-colors ${
                        isSelected
                          ? "border-primary-500 ring-2 ring-primary-500 ring-offset-2"
                          : "border-neutral-300 hover:border-primary-400"
                      }`}
                      style={{ backgroundColor: swatchColor }}
                    />
                  ) : (
                    <span
                      className={`block rounded-lg border-2 px-3 py-1.5 text-sm transition-colors ${
                        isSelected ? "border-primary-500 ring-2 ring-primary-500 ring-offset-2" : "border-neutral-300 hover:border-primary-400"
                      }`}
                    >
                      {variant.frameStyle ?? variant.grit ?? variant.sku}
                    </span>
                  )}
                  {product.variantType === "color" && variant.name && (
                    <span className={`text-xs ${isSelected ? "font-medium text-primary-700" : "text-muted"}`}>{variant.name}</span>
                  )}
                </button>
              );
            })}
          </div>
          {product.variantType === "color" && selectedLegacyVariant && (
            <p className="text-muted mt-2 text-sm">Selected: {selectedLegacyVariant.name ?? selectedLegacyVariant.id}</p>
          )}
        </div>
      )}

      {/* Customization Fields */}
      {/* {data.customization && data.customFields && (
        <div className="space-y-4">
          <h4 className="text-foreground font-medium">Customization</h4>

          {data.customFields.map((field, index) => {
            const fieldId = field.id || field.name || `field-${index}`;
            const fieldKey = fieldId;
            if (field.type === "select" && field.options) {
              // Handle options that could be strings or objects
              const selectOptions = field.options.map((opt, optIndex) => {
                if (typeof opt === "string") {
                  return { value: opt, label: opt };
                }
                // If opt is already an object with value/label
                return {
                  value: String(opt.value ?? opt.label ?? optIndex),
                  label: String(opt.label ?? opt.value ?? opt),
                };
              });
              return (
                <div key={fieldKey}>
                  <Select
                    label={field.label}
                    required={field.required}
                    options={selectOptions}
                    value={customFields[fieldId]?.toString() || ""}
                    onChange={(e) => handleFieldChange(fieldId, e.target.value)}
                    error={errors[fieldId]}
                  />
                </div>
              );
            }

            return (
              <div key={fieldKey}>
                <Input
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  value={customFields[fieldId]?.toString() || ""}
                  onChange={(e) => handleFieldChange(fieldId, field.type === "number" ? Number(e.target.value) : e.target.value)}
                  error={errors[fieldId]}
                />
              </div>
            );
          })}
        </div>
      )} */}

      {/* Quantity */}
      {/* <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="hover:bg-surface-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-base font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="hover:bg-surface-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors"
          >
            +
          </button>
        </div>
      </div> */}

      {/* Add to Cart Button */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleAddToCart} className="flex-1" size="lg">
          Add to Cart
        </Button>
        <Button onClick={() => setIsQuoteModalOpen(true)} variant="outline" size="lg" className="flex-1">
          Get a Quote
        </Button>
      </div>

      <p className="text-muted text-center text-xs">Add items to your cart and request a quote. We&apos;ll respond within 24 hours.</p>

      {/* Quote Modal */}
      <ProductQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={product.name}
        productSku={product.sku}
        productId={String(product.id)}
        selectedVariant={getVariantDescription()}
      />
    </div>
  );
}
