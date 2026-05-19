"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { getCartItemKey } from "@/lib/cart";
import { submitQuoteRequest, QuoteFormState } from "@/app/actions/quote";
import {
    CheckCircle2,
    ChevronRight,
    Shield,
    Truck,
    MapPin,
    User,
    Phone,
    Mail,
    Building2,
    FileText,
    CreditCard,
    ShoppingCart,
    ArrowLeft,
} from "lucide-react";

const initialState: QuoteFormState = { success: false };

function formatINR(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function InputField({
    label,
    icon: Icon,
    required,
    error,
    ...props
}: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                <Icon className="h-3.5 w-3.5 text-neutral-400" />
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                required={required}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function CheckoutPage() {
    const { items, clearCart, itemCount } = useCart();
    const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const formTimestamp = useRef(Date.now().toString());

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (state.success) {
            clearCart();
            setShowSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [state.success, clearCart]);

    const subtotal = items.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);

    /* ── Order Confirmed ── */
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50 py-16">
                <div className="container flex flex-col items-center text-center">
                    <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                    </div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Order Confirmed
                    </div>
                    <h1 className="mb-3 mt-4 text-2xl font-bold text-neutral-900">Order Placed Successfully!</h1>
                    <p className="mb-2 text-neutral-600">
                        Thank you! We've received your order and will confirm shortly.
                    </p>
                    <p className="mb-8 max-w-md text-sm text-neutral-400">
                        Our team will call / email you within 24 hours to confirm availability and arrange payment.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-colors hover:bg-primary-600"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-8 py-3.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Empty cart ── */
    if (mounted && items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 py-16">
                <div className="container flex flex-col items-center text-center">
                    <ShoppingCart className="mb-4 h-16 w-16 text-neutral-300" />
                    <h1 className="mb-4 text-2xl font-bold text-neutral-800">Your cart is empty</h1>
                    <Link
                        href="/products"
                        className="rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                    >
                        Shop Now
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
                    <Link href="/cart" className="flex items-center gap-1 transition-colors hover:text-primary-600">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Cart
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-semibold text-neutral-800">Checkout</span>
                </nav>

                {/* Step indicator */}
                <div className="mb-6 flex items-center gap-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-500">✓</div>
                        <span className="text-xs font-medium text-neutral-400">Cart</span>
                    </div>
                    <div className="mx-3 h-px w-12 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">2</div>
                        <span className="text-xs font-semibold text-primary-600">Checkout</span>
                    </div>
                    <div className="mx-3 h-px w-12 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-400">3</div>
                        <span className="text-xs font-medium text-neutral-400">Confirmed</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">

                    {/* ── Left: Delivery form ── */}
                    <div className="min-w-0 flex-1 space-y-4">

                        {/* Delivery address card */}
                        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">1</div>
                                <div>
                                    <h2 className="font-bold text-neutral-900">Delivery Details</h2>
                                    <p className="text-xs text-neutral-400">We'll ship to this address</p>
                                </div>
                            </div>

                            <form action={formAction} className="p-6">
                                {/* Hidden bot protection fields */}
                                <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
                                <input type="hidden" name="formTimestamp" value={formTimestamp.current} />
                                <div className="absolute -left-[9999px]" aria-hidden="true">
                                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                                </div>

                                {state.error && !state.fieldErrors && (
                                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
                                        {state.error}
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InputField
                                        label="Full Name"
                                        icon={User}
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Dr. Ranvijay Singh"
                                        error={state.fieldErrors?.name}
                                    />
                                    <InputField
                                        label="Phone Number"
                                        icon={Phone}
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="+91 9876543210"
                                        error={state.fieldErrors?.phone}
                                    />
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Email Address"
                                            icon={Mail}
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="doctor@clinic.com"
                                            error={state.fieldErrors?.email}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Clinic / Practice Name"
                                            icon={Building2}
                                            name="company"
                                            type="text"
                                            placeholder="Your Dental Practice"
                                            error={state.fieldErrors?.company}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
                                            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                                            Delivery Address
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={3}
                                            placeholder="Street address, City, State, PIN code"
                                            className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                        {state.fieldErrors?.message && (
                                            <p className="mt-1 text-xs text-red-500">{state.fieldErrors.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment note */}
                                <div className="mt-6 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white shrink-0 mt-0.5">2</div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-800">Payment on Confirmation</h3>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                                                Our team will contact you within 24 hours to confirm your order and arrange
                                                payment via bank transfer, UPI, or cheque. An invoice will be provided.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment method chips */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {["Bank Transfer", "UPI / GPay", "Cheque", "Cash on Delivery"].map((method) => (
                                            <span
                                                key={method}
                                                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600"
                                            >
                                                <CreditCard className="h-3 w-3 text-neutral-400" />
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-4 text-sm font-bold text-white shadow-[0_2px_12px_-2px_rgb(31_182_205/0.45)] transition-all hover:bg-primary-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Placing Order…
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            Place Order
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                                    <Shield className="h-3.5 w-3.5" />
                                    Safe and Secure · Your details are protected
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── Right: Order summary ── */}
                    <div className="w-full shrink-0 lg:w-80 xl:w-[340px]">
                        <div className="sticky top-24 space-y-3">

                            {/* Items */}
                            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                                <div className="border-b border-neutral-100 px-5 py-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                        Order Summary · {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </h2>
                                </div>
                                <div className="max-h-56 overflow-y-auto divide-y divide-neutral-50">
                                    {items.map((item) => (
                                        <div key={getCartItemKey(item)} className="flex items-center gap-3 px-5 py-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="h-full w-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-neutral-300 text-xs">—</div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-neutral-800">{item.productName}</p>
                                                <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold text-neutral-900">
                                                {item.basePrice ? formatINR(item.basePrice * item.quantity) : "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price details */}
                            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                                <div className="border-b border-neutral-100 px-5 py-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Price Details</h2>
                                </div>
                                <div className="space-y-3 px-5 py-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">
                                            Price ({itemCount} {itemCount === 1 ? "item" : "items"})
                                        </span>
                                        <span className="font-medium text-neutral-900">
                                            {subtotal > 0 ? formatINR(subtotal) : "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">Delivery Charges</span>
                                        <span className="font-medium text-emerald-600">Free</span>
                                    </div>
                                    <div className="border-t border-dashed border-neutral-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-neutral-900">Total Amount</span>
                                            <span className="text-xl font-bold text-neutral-900">
                                                {subtotal > 0 ? formatINR(subtotal) : "—"}
                                            </span>
                                        </div>
                                        {subtotal > 0 && (
                                            <p className="mt-0.5 text-right text-xs text-neutral-400">
                                                Inclusive of all taxes
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="rounded-xl border border-neutral-100 bg-white px-5 py-4">
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Shield, text: "100% secure & safe checkout" },
                                        { icon: Truck, text: "Free delivery on all orders" },
                                        { icon: FileText, text: "GST invoice provided" },
                                    ].map(({ icon: Icon, text }) => (
                                        <div key={text} className="flex items-center gap-2.5 text-xs text-neutral-500">
                                            <Icon className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
