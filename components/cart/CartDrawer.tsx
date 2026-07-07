"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { calculateCartTotal, getCartItemKey } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { CloseIcon, CartIcon, TrashIcon, ImageIcon } from "@/components/icons";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { SafeImage } from "@/components/ui";
import { toast } from "sonner";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
    const router = useRouter();
    const total = calculateCartTotal(items);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
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
            {/* Overlay */}
            <div
                className={cn("fixed inset-0 z-40 bg-black/50 transition-opacity duration-300", isOpen ? "visible opacity-100" : "invisible opacity-0")}
                onClick={closeCart}
            />

            {/* Clip wrapper — prevents translate-x-full from widening the viewport on mobile */}
            <div className="pointer-events-none fixed inset-y-0 right-0 z-50 w-full overflow-hidden sm:max-w-md">
            {/* Drawer */}
            <div className={cn("pointer-events-auto flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary-600" />
                        <h2 className="text-base font-bold text-neutral-900">
                            My Cart{itemCount > 0 && <span className="ml-1.5 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">{itemCount}</span>}
                        </h2>
                    </div>
                    <button onClick={closeCart} className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700" aria-label="Close cart">
                        <CloseIcon size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                                <CartIcon size={36} className="text-neutral-300" />
                            </div>
                            <h3 className="text-base font-semibold text-neutral-800">Your cart is empty</h3>
                            <p className="text-sm text-neutral-400">Add products to get started</p>
                            <button
                                onClick={() => { closeCart(); router.push("/products"); }}
                                className="mt-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                            >
                                Shop Now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2 p-4">
                            {items.map((item) => {
                                const key = getCartItemKey(item);
                                const lineTotal = item.basePrice ? item.basePrice * item.quantity : null;

                                return (
                                    <div key={key} className="flex gap-3 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm">
                                        {/* Image */}
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                                            {item.image ? (
                                                <SafeImage
                                                    src={item.image}
                                                    alt={item.productName}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain p-1.5"
                                                    fallbackVariant="product"
                                                    containerClassName="h-full w-full"
                                                    fallbackClassName="rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">{item.productName}</h4>
                                            <p className="mt-0.5 text-xs text-neutral-400">{item.sku}</p>
                                            {item.customization && Object.entries(item.customization).map(([k, v]) => (
                                                <span key={k} className="mt-0.5 block text-xs text-neutral-500 capitalize">{k}: {v}</span>
                                            ))}

                                            <div className="mt-2 flex items-center gap-3">
                                                {/* Qty stepper */}
                                                <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200">
                                                    <button
                                                        onClick={() => updateQuantity(key, item.quantity - 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-sm font-bold text-neutral-500 transition-colors hover:bg-neutral-50"
                                                    >−</button>
                                                    <span className="flex h-7 w-8 items-center justify-center border-x border-neutral-200 text-sm font-semibold text-neutral-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(key, item.quantity + 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-sm font-bold text-neutral-500 transition-colors hover:bg-neutral-50"
                                                    >+</button>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        removeItem(key);
                                                        toast("Removed from cart", {
                                                            description: item.productName,
                                                            duration: 2500,
                                                        });
                                                    }}
                                                    className="flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors hover:text-red-500"
                                                    aria-label="Remove item"
                                                >
                                                    <TrashIcon size={13} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="shrink-0 text-right">
                                            {lineTotal ? (
                                                <p className="text-sm font-bold text-neutral-900">{formatPrice(lineTotal)}</p>
                                            ) : (
                                                <p className="text-xs text-neutral-400">On request</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Free delivery badge */}
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                                <Truck className="h-4 w-4 text-emerald-600" />
                                <p className="text-xs font-medium text-emerald-700">Free delivery on this order</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-neutral-100 p-4 space-y-3">
                        {/* Total */}
                        {total > 0 && (
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                                <span className="text-sm font-medium text-neutral-600">Order Total</span>
                                <span className="text-lg font-bold text-neutral-900">{formatPrice(total)}</span>
                            </div>
                        )}

                        <p className="text-center text-xs text-neutral-400">Prices incl. GST · Free delivery on all orders</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={goToCart}
                                className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                            >
                                View Cart
                            </button>
                            <button
                                onClick={goToCheckout}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-bold text-white shadow-[0_2px_10px_-2px_rgb(31_182_205/0.45)] transition-all hover:bg-primary-600"
                            >
                                Checkout
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </>
    );
}
