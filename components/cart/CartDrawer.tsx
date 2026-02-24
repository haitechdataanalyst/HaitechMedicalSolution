"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { QuoteForm } from "./index";
import { formatCurrency, calculateCartTotal, getCartItemKey } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { CloseIcon, CartIcon, TrashIcon, ImageIcon } from "@/components/icons";
import { WhatsAppButton } from "@/components/ui";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
    const [showQuoteForm, setShowQuoteForm] = useState(false);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeCart();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
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
            <div className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity duration-300", isOpen ? "visible opacity-100" : "invisible opacity-0")} onClick={handleCloseCart} />

            {/* Drawer */}
            <div
                className={cn("bg-surface fixed top-0 right-0 z-50 flex h-full w-full flex-col shadow-xl transition-transform duration-300 sm:max-w-md", isOpen ? "translate-x-0" : "translate-x-full")}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">{showQuoteForm ? "Request Quote" : "Your Cart"}</h2>
                    <button onClick={handleCloseCart} className="icon-btn cursor-pointer" aria-label="Close cart">
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
                        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                            <CartIcon size={64} className="mb-4 text-neutral-300" />
                            <h3 className="text-foreground mb-1 text-lg font-medium">Your cart is empty</h3>
                            <p className="text-muted text-sm">Add products to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {items.map((item) => {
                                const itemKey = getCartItemKey(item);

                                return (
                                    <div key={itemKey} className="bg-surface-secondary flex gap-3 rounded-lg p-3 sm:gap-4">
                                        {/* Image */}
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 sm:h-20 sm:w-20">
                                            {item.image ? (
                                                <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-foreground truncate text-sm font-medium sm:text-base">{item.productName}</h4>
                                            <p className="text-muted text-xs sm:text-sm">{item.sku}</p>

                                            {/* Customization */}
                                            {item.customization && Object.keys(item.customization).length > 0 && (
                                                <div className="mt-1 space-y-0.5">
                                                    {Object.entries(item.customization).map(([key, value]) => (
                                                        <p key={key} className="text-subtle text-xs">
                                                            {key}: {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Price & Quantity */}
                                            {/* <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="text-muted hover:text-foreground hover:bg-surface-tertiary flex h-7 w-7 items-center justify-center rounded"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="text-muted hover:text-foreground hover:bg-surface-tertiary flex h-7 w-7 items-center justify-center rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-foreground text-sm font-medium">{item.basePrice ? formatCurrency(item.basePrice * item.quantity) : "POA"}</span>
                      </div> */}
                                        </div>

                                        {/* Remove Button */}
                                        <button onClick={() => removeItem(itemKey)} className="hover:text-error shrink-0 cursor-pointer p-1 text-neutral-400" aria-label="Remove item">
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
                    <div className="space-y-4 border-t border-[var(--border-color)] p-4">
                        {/* Total */}
                        {/* <div className="flex items-center justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground text-lg font-semibold">{formatCurrency(total)}</span>
            </div> */}

                        <p className="text-subtle text-center text-xs">Final pricing confirmed upon quote request</p>

                        {/* Request Quote & WhatsApp Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button onClick={() => setShowQuoteForm(true)} className="btn btn-primary btn-lg flex-1">
                                Request Quote
                            </button>
                            <WhatsAppButton
                                phoneNumber="+918291939355"
                                message="Hi, I have some items in my cart and would like to inquire about pricing and availability."
                                size="lg"
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
