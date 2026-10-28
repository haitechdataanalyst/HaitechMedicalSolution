"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { getCartItemKey } from "@/lib/cart";
import { ShoppingCart, Trash2, Truck, Shield, Tag, ChevronRight, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import { cloudinaryUrl } from "@/lib/cloudinary-loader";

const STEPPER_BTN =
    "flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.06] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500";

export default function CartPage() {
    const { items, removeItem, updateQuantity, itemCount } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const subtotal = items.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);
    const hasPrice = items.some((i) => i.basePrice);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-neutral-50" aria-busy="true">
                <div className="container py-8 md:py-12">
                    <div className="h-12 w-48 rounded-xl bg-white motion-safe:animate-pulse" />
                    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
                        <div className="h-72 rounded-2xl bg-white motion-safe:animate-pulse" />
                        <div className="h-72 rounded-2xl bg-white motion-safe:animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
                    <ShoppingCart className="mb-6 h-12 w-12 text-neutral-400" aria-hidden="true" />
                    <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">Your cart is empty!</h1>
                    <p className="mt-3 text-base text-neutral-500 md:text-lg">Add items to it now.</p>
                    <Link href="/products" className={`${PILL_PRIMARY} mt-8`}>
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="container py-8 md:py-12">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <Link href="/" className="transition-colors hover:text-neutral-900">
                        Home
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-neutral-800" aria-current="page">
                        My Cart
                    </span>
                </nav>

                <h1 className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">
                    My Cart
                    <span className="ml-3 align-middle text-base font-normal tracking-normal text-neutral-500 md:text-lg">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                </h1>

                <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
                    {/* ── Left: Cart items ── */}
                    <div className="min-w-0">
                        <ul className={`${SURFACE_CARD} divide-y divide-neutral-900/[0.06] px-5 md:px-7`}>
                            {items.map((item) => {
                                const key = getCartItemKey(item);
                                const lineTotal = item.basePrice ? item.basePrice * item.quantity : null;

                                return (
                                    <li key={key} className="flex gap-4 py-6 md:gap-6">
                                        {/* Image */}
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50 md:h-28 md:w-28">
                                            {item.image ? (
                                                <img src={cloudinaryUrl(item.image, 256)} alt={item.productName} className="h-full w-full object-contain p-3 mix-blend-multiply" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                                    <ShoppingCart className="h-8 w-8" aria-hidden="true" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.productName}</h3>
                                                    {item.customization &&
                                                        Object.entries(item.customization).map(([k, v]) => (
                                                            <span key={k} className="mr-2 text-[13px] text-neutral-500 capitalize">
                                                                {k}: {v}
                                                            </span>
                                                        ))}
                                                </div>

                                                {/* Price */}
                                                <div className="shrink-0 sm:text-right">
                                                    {lineTotal ? (
                                                        <>
                                                            <p className="text-[17px] font-semibold text-neutral-900 tabular-nums">{formatPrice(lineTotal)}</p>
                                                            {item.quantity > 1 && <p className="mt-0.5 text-[13px] text-neutral-500 tabular-nums">{formatPrice(item.basePrice!)} each</p>}
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-neutral-500">Price on request</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-3">
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
                                                    <span className="min-w-8 text-center text-[15px] font-semibold text-neutral-900 tabular-nums" aria-live="polite">
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
                                                    onClick={() => removeItem(key)}
                                                    className="focus-visible:outline-primary-500 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-neutral-500 transition-colors duration-200 ease-out hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                                                    aria-label={`Remove ${item.productName}`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Free delivery note */}
                        <p className="mt-4 flex items-center gap-2.5 rounded-2xl bg-emerald-50 px-5 py-3.5 text-sm font-medium text-emerald-800">
                            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Free delivery on this order
                        </p>
                    </div>

                    {/* ── Right: Price summary ── */}
                    <aside className="lg:sticky lg:top-24" aria-label="Price summary">
                        <div className={`${SURFACE_CARD} p-6`}>
                            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Price Details</h2>

                            <dl className="mt-5 space-y-3 text-[15px]">
                                <div className="flex items-center justify-between">
                                    <dt className="text-neutral-600">
                                        Price ({itemCount} {itemCount === 1 ? "item" : "items"})
                                    </dt>
                                    <dd className="font-medium text-neutral-900 tabular-nums">{subtotal > 0 ? formatPrice(subtotal) : "—"}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-neutral-600">Discount</dt>
                                    <dd className="font-medium text-emerald-700 tabular-nums">₹0</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-neutral-600">Delivery Charges</dt>
                                    <dd className="font-medium text-emerald-700">Free</dd>
                                </div>

                                <div className="flex items-baseline justify-between border-t border-neutral-900/[0.06] pt-4">
                                    <dt className="text-[17px] font-semibold text-neutral-900">Total Amount</dt>
                                    <dd className="text-2xl font-semibold tracking-[-0.015em] text-neutral-900 tabular-nums">{subtotal > 0 ? formatPrice(subtotal) : "—"}</dd>
                                </div>
                                {subtotal > 0 && <p className="text-right text-[13px] text-neutral-500">Inclusive of all taxes</p>}
                            </dl>

                            <button type="button" onClick={() => router.push("/checkout")} className="btn btn-primary btn-lg mt-6 w-full">
                                Proceed to Checkout
                            </button>

                            <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-neutral-500">
                                <Shield className="h-4 w-4" aria-hidden="true" />
                                Safe and Secure Payments
                            </p>
                        </div>

                        {hasPrice && (
                            <p className="mt-4 flex items-start gap-2.5 px-2 text-[13px] leading-relaxed text-neutral-500">
                                <Tag className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                GST included in all prices · Invoice provided on order
                            </p>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
