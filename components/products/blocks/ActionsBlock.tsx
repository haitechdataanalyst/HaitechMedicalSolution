'use client';

import { useState } from 'react';
import { ActionsBlock as ActionsBlockType, Product, CartItem } from '@/types';
import { useCart } from '@/components/cart/CartProvider';
import { formatCurrency } from '@/lib/cart';
import { Button, Input, Select } from '@/components/ui';

interface ActionsBlockProps {
  data: ActionsBlockType['data'];
  product: Product;
}

export default function ActionsBlock({ data, product }: ActionsBlockProps) {
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

    data.customFields.forEach((field) => {
      if (field.required && !customFields[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'number' && customFields[field.id]) {
        const value = Number(customFields[field.id]);
        if (field.min !== undefined && value < field.min) {
          newErrors[field.id] = `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.id] = `Maximum value is ${field.max}`;
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
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity,
      basePrice: product.basePrice,
      customization: data.customization ? customFields : undefined,
      image: product.image,
    };

    addItem(cartItem);
  };

  if (!data.addToCart) {
    return null;
  }

  return (
    <div className="bg-surface border border-neutral-200 rounded-xl p-4 sm:p-6 space-y-6 sticky top-24">
      {/* Price */}
      <div>
        <span className="text-2xl sm:text-3xl font-bold text-foreground">
          {product.basePrice ? formatCurrency(product.basePrice) : 'Price on Application'}
        </span>
        {product.basePrice && (
          <span className="text-sm text-muted ml-2">excl. GST</span>
        )}
      </div>

      {/* Customization Fields */}
      {data.customization && data.customFields && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Customization</h4>

          {data.customFields.map((field) => {
            if (field.type === 'select' && field.options) {
              return (
                <Select
                  key={field.id}
                  label={field.label}
                  required={field.required}
                  options={field.options.map((opt) => ({ value: opt, label: opt }))}
                  value={customFields[field.id]?.toString() || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  error={errors[field.id]}
                />
              );
            }

            return (
              <Input
                key={field.id}
                label={field.label}
                type={field.type}
                required={field.required}
                min={field.min}
                max={field.max}
                value={customFields[field.id]?.toString() || ''}
                onChange={(e) =>
                  handleFieldChange(
                    field.id,
                    field.type === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
                error={errors[field.id]}
              />
            );
          })}
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-neutral-600 border border-neutral-200 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            -
          </button>
          <span className="text-base font-medium w-12 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-neutral-600 border border-neutral-200 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className="w-full"
        size="lg"
      >
        Add to Quote Cart
      </Button>

      <p className="text-xs text-muted text-center">
        Add items to your cart and request a quote. We&apos;ll respond within 24 hours.
      </p>
    </div>
  );
}
