"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { calculateCartTotal, getCartItemKey } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { CloseIcon, CartIcon, TrashIcon, ImageIcon } from "@/components/icons";
import { Minus, Plus, Truck } from "lucide-react";
import { SafeImage } from "@/components/ui";
import { toast } from "sonner";

const STEPPER_BTN =
    "flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.06] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500";

// Sheet motion: decelerate in, quick ease out. Transform/opacity only.
const SHEET_EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
    const router = useRouter();
    const total = calculateCartTotal(items);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        if (isOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, closeCart]);

    const goToCheckout = () => {
        closeCart();
        router.push("/checkout");
    };

    const goToCart = () => {
        closeCart();
        router.push("/cart");
    };

    return (
        <>
            {/* Scrim */}
            <div
                aria-hidden="true"
                className={cn("fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ease-out", isOpen ? "visible opacity-100" : "invisible opacity-0")}
                onClick={closeCart}
            />

            {/* Clip wrapper — prevents translate-x-full from widening the viewport on mobile */}
            <div className="pointer-events-none fixed inset-y-0 right-0 z-50 w-full overflow-hidden sm:max-w-[440px] sm:p-3">
                {/* Sheet */}
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cart-drawer-title"
                    inert={!isOpen}
                    className={cn(
                        "material-popover pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-none transition-transform duration-[400ms] sm:rounded-3xl",
                        SHEET_EASE,
                        isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
                        <h2 id="cart-drawer-title" className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">
                            My Cart
                            {itemCount > 0 && <span className="ml-2 text-base font-normal text-neutral-500 tabular-nums">{itemCount}</span>}
                        </h2>
                        <button
                            type="button"
                            onClick={closeCart}
                            className="focus-visible:outline-primary-500 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.06] hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                            aria-label="Close cart"
                        >
                            <CloseIcon size={20} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center px-8 pb-10 text-center">
                                <CartIcon size={40} className="text-neutral-400" aria-hidden="true" />
                                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-neutral-900">Your cart is empty</h3>
                                <p className="mt-1.5 text-[15px] text-neutral-500">Add products to get started</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeCart();
                                        router.push("/products");
                                    }}
                                    className="btn btn-primary btn-lg mt-7"
                                >
                                    Shop Now
                                </button>
                            </div>
                        ) : (
                            <>
                                <ul className="divide-y divide-neutral-900/[0.06] px-6">
                                    {items.map((item) => {
                                        const key = getCartItemKey(item);
                                        const lineTotal = item.basePrice ? item.basePrice * item.quantity : null;

                                        return (
                                            <li key={key} className="flex gap-4 py-5">
                                                {/* Image */}
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                                                    {item.image ? (
                                                        <SafeImage
                                                            src={item.image}
                                                            alt={item.productName}
                                                            fill
                                                            sizes="80px"
                                                            className="object-contain p-2 mix-blend-multiply"
                                                            fallbackVariant="product"
                                                            containerClassName="h-full w-full"
                                                            fallbackClassName="rounded-xl"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                                            <ImageIcon size={24} aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h4 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.productName}</h4>
                                                        {lineTotal ? (
                                                            <p className="shrink-0 text-[15px] font-semibold text-neutral-900 tabular-nums">{formatPrice(lineTotal)}</p>
                                                        ) : (
                                                            <p className="shrink-0 text-[13px] text-neutral-500">On request</p>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-[13px] text-neutral-500">{item.sku}</p>
                                                    {item.customization &&
                                                        Object.entries(item.customization).map(([k, v]) => (
                                                            <span key={k} className="mt-0.5 block text-[13px] text-neutral-500 capitalize">
                                                                {k}: {v}
                                                            </span>
                                                        ))}

                                                    <div className="mt-3 flex items-center justify-between gap-3">
                                                        {/* Qty stepper */}
                                                        <div className="flex items-center rounded-full bg-neutral-900/[0.04]">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(key, item.quantity - 1)}
                                                                className={STEPPER_BTN}
                                                                aria-label={`Decrease quantity of ${item.productName}`}
                                                            >
                                                                <Minus className="h-4 w-4" aria-hidden="true" />
                                                            </button>
                                                            <span className="min-w-7 text-center text-[15px] font-semibold text-neutral-900 tabular-nums" aria-live="polite">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(key, item.quantity + 1)}
                                                                className={STEPPER_BTN}
                                                                aria-label={`Increase quantity of ${item.productName}`}
                                                            >
                                                                <Plus className="h-4 w-4" aria-hidden="true" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                removeItem(key);
                                                                toast("Removed from cart", {
                                                                    description: item.productName,
                                                                    duration: 2500,
                                                                });
                                                            }}
                                                            className="focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-neutral-500 transition-colors duration-200 ease-out hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                                                            aria-label={`Remove ${item.productName}`}
                                                        >
                                                            <TrashIcon size={14} aria-hidden="true" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Free delivery note */}
                                <p className="mx-6 mt-1 mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800">
                                    <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    Free delivery on this order
                                </p>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-neutral-900/[0.06] px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                            {total > 0 && (
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[15px] font-medium text-neutral-700">Order Total</span>
                                    <span className="text-xl font-semibold tracking-[-0.01em] text-neutral-900 tabular-nums">{formatPrice(total)}</span>
                                </div>
                            )}

                            <p className="mt-1 text-[13px] text-neutral-500">Prices incl. GST · Free delivery on all orders</p>

                            <button type="button" onClick={goToCheckout} className="btn btn-primary btn-lg mt-5 w-full">
                                Checkout
                            </button>
                            <button type="button" onClick={goToCart} className="btn btn-ghost btn-md text-primary-700 mt-1 w-full">
                                View Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
