"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { getCartItemKey } from "@/lib/cart";
import { ShoppingCart, Trash2, ArrowRight, Truck, Shield, Tag, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, itemCount } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const subtotal = items.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);
    const hasPrice = items.some((i) => i.basePrice);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-neutral-50 py-6">
                <div className="container">
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="flex-1 space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-32 animate-pulse rounded-xl bg-white" />
                            ))}
                        </div>
                        <div className="h-64 w-full animate-pulse rounded-xl bg-white lg:w-80" />
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
                    <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-neutral-100">
                        <ShoppingCart className="h-14 w-14 text-neutral-300" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-neutral-800">Your cart is empty!</h1>
                    <p className="mb-8 text-neutral-500">Add items to it now.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-primary-600"
                    >
                        Shop Now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-6">
            <div className="container">

                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-1.5 text-sm text-neutral-400">
                    <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-semibold text-neutral-800">My Cart</span>
                </nav>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">

                    {/* ── Left: Cart items ── */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center justify-between">
                            <h1 className="text-lg font-bold text-neutral-900">
                                My Cart
                                <span className="ml-2 text-sm font-normal text-neutral-400">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                            </h1>
                        </div>

                        <div className="space-y-3">
                            {items.map((item) => {
                                const key = getCartItemKey(item);
                                const lineTotal = item.basePrice ? item.basePrice * item.quantity : null;

                                return (
                                    <div key={key} className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-neutral-300">
                                                        <ShoppingCart className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="mb-0.5 line-clamp-2 font-semibold leading-snug text-neutral-900">
                                                    {item.productName}
                                                </h3>
                                                <p className="mb-1.5 text-xs text-neutral-400">{item.sku}</p>
                                                {item.customization &&
                                                    Object.entries(item.customization).map(([k, v]) => (
                                                        <span key={k} className="mr-2 text-xs capitalize text-neutral-500">
                                                            {k}: {v}
                                                        </span>
                                                    ))}

                                                <div className="mt-3 flex flex-wrap items-center gap-4">
                                                    {/* Qty stepper */}
                                                    <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200">
                                                        <button
                                                            onClick={() => updateQuantity(key, item.quantity - 1)}
                                                            className="flex h-8 w-8 items-center justify-center text-base font-medium text-neutral-500 transition-colors hover:bg-neutral-50"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="flex h-8 w-10 items-center justify-center border-x border-neutral-200 text-sm font-semibold text-neutral-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(key, item.quantity + 1)}
                                                            className="flex h-8 w-8 items-center justify-center text-base font-medium text-neutral-500 transition-colors hover:bg-neutral-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(key)}
                                                        className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="shrink-0 text-right">
                                                {lineTotal ? (
                                                    <>
                                                        <p className="text-base font-bold text-neutral-900">{formatPrice(lineTotal)}</p>
                                                        {item.quantity > 1 && (
                                                            <p className="mt-0.5 text-xs text-neutral-400">{formatPrice(item.basePrice!)} each</p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-neutral-400">Price on request</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Free delivery badge */}
                        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                            <Truck className="h-4 w-4 shrink-0 text-emerald-600" />
                            <p className="text-sm font-medium text-emerald-700">
                                Free delivery on this order
                            </p>
                        </div>
                    </div>

                    {/* ── Right: Price summary ── */}
                    <div className="w-full shrink-0 lg:w-80 xl:w-[340px]">
                        <div className="sticky top-24 space-y-3">

                            {/* Promo / offer strip */}
                            {hasPrice && (
                                <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
                                    <Tag className="h-4 w-4 shrink-0 text-primary-600" />
                                    <p className="text-xs font-medium text-primary-700">
                                        GST included in all prices · Invoice provided on order
                                    </p>
                                </div>
                            )}

                            {/* Price details card */}
                            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                                <div className="border-b border-neutral-100 px-5 py-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                        Price Details
                                    </h2>
                                </div>

                                <div className="space-y-3 px-5 py-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">
                                            Price ({itemCount} {itemCount === 1 ? "item" : "items"})
                                        </span>
                                        <span className="font-medium text-neutral-900">
                                            {subtotal > 0 ? formatPrice(subtotal) : "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">Discount</span>
                                        <span className="font-medium text-emerald-600">₹0</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">Delivery Charges</span>
                                        <span className="font-medium text-emerald-600">Free</span>
                                    </div>

                                    <div className="border-t border-dashed border-neutral-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-neutral-900">Total Amount</span>
                                            <span className="text-xl font-bold text-neutral-900">
                                                {subtotal > 0 ? formatPrice(subtotal) : "—"}
                                            </span>
                                        </div>
                                        {subtotal > 0 && (
                                            <p className="mt-0.5 text-right text-xs text-neutral-400">
                                                Inclusive of all taxes
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 pb-5 space-y-3">
                                    <button
                                        onClick={() => router.push("/checkout")}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3.5 text-sm font-bold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-all hover:bg-primary-600 hover:shadow-lg"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="h-4 w-4" />
                                    </button>

                                    <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                                        <Shield className="h-3.5 w-3.5" />
                                        <span>Safe and Secure Payments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
