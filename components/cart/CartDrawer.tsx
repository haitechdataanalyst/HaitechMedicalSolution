'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { QuoteForm } from './index';
import { formatCurrency, calculateCartTotal, getCartItemKey } from '@/lib/cart';
import { cn } from '@/lib/utils';
import { CloseIcon, CartIcon, TrashIcon, ImageIcon } from '@/components/icons';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeCart]);
  
  // Reset quote form state when opening/closing drawer
  const handleCloseCart = () => {
    setShowQuoteForm(false);
    closeCart();
  };

  const total = calculateCartTotal(items);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={handleCloseCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:max-w-md bg-surface z-50 shadow-xl transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {showQuoteForm ? 'Request Quote' : 'Your Cart'}
          </h2>
          <button
            onClick={handleCloseCart}
            className="icon-btn"
            aria-label="Close cart"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showQuoteForm ? (
            <QuoteForm
              onBack={() => setShowQuoteForm(false)}
              onSuccess={() => {
                setShowQuoteForm(false);
                closeCart();
              }}
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <CartIcon size={64} className="text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">Your cart is empty</h3>
              <p className="text-muted text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const itemKey = getCartItemKey(item);

                return (
                  <div
                    key={itemKey}
                    className="flex gap-3 sm:gap-4 p-3 bg-surface-secondary rounded-lg"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-200 rounded-lg shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate text-sm sm:text-base">
                        {item.productName}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted">{item.sku}</p>

                      {/* Customization */}
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {Object.entries(item.customization).map(([key, value]) => (
                            <p key={key} className="text-xs text-subtle">
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-tertiary rounded"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-tertiary rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.basePrice ? formatCurrency(item.basePrice * item.quantity) : 'POA'}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(itemKey)}
                      className="text-neutral-400 hover:text-error p-1 shrink-0"
                      aria-label="Remove item"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !showQuoteForm && (
          <div className="border-t border-[var(--border-color)] p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-lg font-semibold text-[var(--foreground)]">
                {formatCurrency(total)}
              </span>
            </div>

            <p className="text-xs text-subtle text-center">
              Final pricing confirmed upon quote request
            </p>

            {/* Request Quote Button */}
            <button
              onClick={() => setShowQuoteForm(true)}
              className="btn btn-primary btn-lg w-full"
            >
              Request Quote
            </button>
          </div>
        )}
      </div>
    </>
  );
}
