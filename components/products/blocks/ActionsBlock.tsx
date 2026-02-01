"use client";

import { useState } from "react";
import { ActionsBlock as ActionsBlockType, Product, CartItem } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button, Input, Select } from "@/components/ui";

interface ActionsBlockProps {
  data: ActionsBlockType["data"];
  product: Product;
  onVariantSelect?: (imageUrl: string) => void;
}

export default function ActionsBlock({ data, product, onVariantSelect }: ActionsBlockProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [customFields, setCustomFields] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    const cartItem: CartItem = {
      productId: String(product.id),
      productName: product.name,
      sku: product.sku,
      quantity,
      basePrice: product.basePrice,
      customization: data.customization ? customFields : undefined,
      image: product.defaultImage,
    };

    addItem(cartItem);
  };

  if (!data.addToCart) {
    return null;
  }

  // Handle variant/color selection
  const handleVariantSelect = (variant: NonNullable<typeof product.variants>[number]) => {
    if (variant && onVariantSelect) {
      onVariantSelect(variant.image);
    }
  };

  return (
    <div className="bg-surface sticky top-24 space-y-6 rounded-xl border border-neutral-200 p-4 sm:p-6">
      {/* Price - Commented out for quote-based system */}
      {/* <div>
        <span className="text-foreground text-2xl font-bold sm:text-3xl">
          {product.basePrice ? formatCurrency(product.basePrice) : "Price on Application"}
        </span>
        {product.basePrice && <span className="text-muted ml-2 text-sm">excl. GST</span>}
      </div> */}

      {/* Color/Variant Selection */}
      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">{product.variantType === "color" ? "Select Color" : "Select Variant"}</label>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <button key={variant.id} type="button" onClick={() => handleVariantSelect(variant)} className="group relative" title={variant.color || variant.frameStyle || variant.sku}>
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
      {data.customization && data.customFields && (
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
      )}

      {/* Quantity */}
      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="hover:bg-surface-secondary flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-12 text-center text-base font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="hover:bg-surface-secondary flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button onClick={handleAddToCart} className="w-full" size="lg">
        Add to Cart
      </Button>

      <p className="text-muted text-center text-xs">Add items to your cart and request a quote. We&apos;ll respond within 24 hours.</p>
    </div>
  );
}
