"use client";

import { useState, useCallback } from "react";
import { ActionsBlock as ActionsBlockType, Product, CartItem, Frame } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button, Input, Select, WhatsAppButton } from "@/components/ui";
import FrameColorSelector from "./FrameColorSelector";

interface ActionsBlockProps {
  data: ActionsBlockType["data"];
  product: Product;
  onVariantSelect?: (imageUrl: string) => void;
  frames?: Frame[];
}

export default function ActionsBlock({ data, product, onVariantSelect, frames = [] }: ActionsBlockProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [customFields, setCustomFields] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFrameColor, setSelectedFrameColor] = useState<{
    frameId: string;
    colorId: string;
    image: string;
  } | null>(null);

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setCustomFields((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

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

  const validateFields = (): boolean => {
    if (!data.customFields) return true;

    const newErrors: Record<string, string> = {};

    data.customFields.forEach((field, index) => {
      const fieldId = field.id || field.name || `field-${index}`;
      if (field.required && !customFields[fieldId]) {
        newErrors[fieldId] = `${field.label} is required`;
      }

      if (field.type === "number" && customFields[fieldId]) {
        const value = Number(customFields[fieldId]);
        if (field.min !== undefined && value < field.min) {
          newErrors[fieldId] = `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[fieldId] = `Maximum value is ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (data.customization && !validateFields()) {
      return;
    }

    // Build customization data including frame selection
    const customization: Record<string, string | number> = { ...customFields };
    if (selectedFrameColor) {
      customization.frame = selectedFrameColor.frameId;
      customization.color = selectedFrameColor.colorId;
    }

    const cartItem: CartItem = {
      productId: String(product.id),
      productName: product.name,
      sku: product.sku,
      quantity,
      basePrice: product.basePrice,
      customization: Object.keys(customization).length > 0 ? customization : undefined,
      image: selectedFrameColor?.image || product.defaultImage,
    };

    addItem(cartItem);
  };

  if (!data.addToCart) {
    return null;
  }

  // Check if product has the new frame variants structure
  const hasFrameVariants = product.variantType === "frame-color" && product.frameVariants && frames.length > 0;

  // Legacy variant handling (for products not yet migrated)
  const handleLegacyVariantSelect = (variant: NonNullable<typeof product.variants>[number]) => {
    if (variant && onVariantSelect) {
      onVariantSelect(variant.image);
    }
  };

  return (
    <div className="bg-surface sticky top-24 space-y-6 rounded-xl border border-neutral-200 p-4 sm:p-6">
      {/* Frame/Color Selection for loupes */}
      {hasFrameVariants && product.frameVariants && <FrameColorSelector frames={frames} frameVariants={product.frameVariants} onSelectionChange={handleFrameColorChange} />}

      {/* Legacy Color/Variant Selection (for products still using old structure) */}
      {!hasFrameVariants && product.hasVariants && product.variants && product.variants.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">{product.variantType === "color" ? "Select Color" : "Select Variant"}</label>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <button key={variant.id} type="button" onClick={() => handleLegacyVariantSelect(variant)} className="group relative" title={variant.color || variant.frameStyle || variant.sku}>
                {variant.color ? (
                  <span className="hover:border-primary-500 block h-8 w-8 rounded-full border-2 border-neutral-300 shadow-sm transition-colors" style={{ backgroundColor: variant.color }} />
                ) : (
                  <span className="hover:border-primary-500 block rounded-lg border border-neutral-300 px-3 py-1.5 text-sm transition-colors">{variant.frameStyle || variant.grit || variant.sku}</span>
                )}
              </button>
            ))}
          </div>
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
        <WhatsAppButton
          phoneNumber="+918291939355"
          message={`Hi, I'm interested in ${product.name} (SKU: ${product.sku}). Can you provide more details?`}
          size="lg"
          className="flex-1"
        />
      </div>

      <p className="text-muted text-center text-xs">Add items to your cart and request a quote. We&apos;ll respond within 24 hours.</p>
    </div>
  );
}
