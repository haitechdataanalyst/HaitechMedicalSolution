"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { getCartItemKey } from "@/lib/cart";
import { orderApi, paymentApi } from "@/lib/api";
import QuoteForm from "@/components/cart/QuoteForm";
import { AlertCircle, Check, CheckCircle2, Shield, Truck, MapPin, User, Phone, Mail, Building2, FileText, CreditCard, Smartphone, Landmark, Banknote, ShoppingCart, ArrowLeft } from "lucide-react";
import { PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";

const PAYMENT_METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    "UPI / GPay": Smartphone,
    "Credit Card": CreditCard,
    "Debit Card": CreditCard,
    "Net Banking": Landmark,
    "Bank Transfer": Landmark,
    Cheque: FileText,
    "Cash on Delivery": Banknote,
};
import { formatPrice } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
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
    const fieldId = props.id ?? (props.name ? `checkout-${props.name}` : undefined);
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;
    return (
        <div>
            <label htmlFor={fieldId} className="form-label flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                {label}
                {required && (
                    <span className="text-red-600" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            <input id={fieldId} required={required} aria-invalid={error ? true : undefined} aria-describedby={errorId} className={`form-input ${error ? "form-input-error" : ""}`} {...props} />
            {error && (
                <p id={errorId} className="form-error">
                    {error}
                </p>
            )}
        </div>
    );
}

const loadRazorpayScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
    });

export default function CheckoutPage() {
    const { items, clearCart, itemCount } = useCart();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => setMounted(true), []);

    const subtotal = items.reduce((sum, item) => sum + (item.basePrice ?? 0) * item.quantity, 0);
    const hasPricedItems = subtotal > 0;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const company = formData.get("company") as string;
        const message = formData.get("message") as string;

        try {
            if (!hasPricedItems) {
                // Fall back to quote flow via server action for price-on-request items
                const { submitQuoteRequest } = await import("@/app/actions/quote");
                const result = await submitQuoteRequest({ success: false }, formData);
                if (result.success) {
                    trackEvent("quote_request", { form: "checkout_quote" });
                    clearCart();
                    setShowSuccess(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    setFormError(result.error ?? "Failed to submit quote. Please try again.");
                }
                setIsSubmitting(false);
                return;
            }

            // ── Razorpay payment flow ──────────────────────────────────────────
            const orderRes = await orderApi.createOrder({
                items: items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    productSku: item.sku,
                    quantity: item.quantity,
                    unitPrice: item.basePrice ?? 0,
                    totalPrice: (item.basePrice ?? 0) * item.quantity,
                })),
                notes: [company, message].filter(Boolean).join(" | ") || undefined,
            });

            if (!orderRes.success || !orderRes.data) {
                const msg = orderRes.message ?? "Failed to create order";
                if (orderRes.statusCode === 401) {
                    setFormError("Please sign in to complete your purchase.");
                } else {
                    setFormError(msg);
                }
                setIsSubmitting(false);
                return;
            }

            const payRes = await paymentApi.createPaymentOrder(orderRes.data.order.id);
            if (!payRes.success || !payRes.data) {
                setFormError(payRes.message ?? "Failed to initiate payment. Please try again.");
                setIsSubmitting(false);
                return;
            }

            await loadRazorpayScript();

            const rzp = new window.Razorpay({
                key: payRes.data.keyId,
                amount: payRes.data.amount,
                currency: payRes.data.currency,
                order_id: payRes.data.razorpayOrderId,
                name: "Haitech Medical",
                description: "Medical Equipment Purchase",
                prefill: { name, email, contact: phone },
                theme: { color: "#1fb6cd" },
                handler: async (response: Record<string, string>) => {
                    try {
                        const verifyRes = await paymentApi.verifyPayment({
                            orderId: orderRes.data!.order.id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        if (verifyRes.success) {
                            clearCart();
                            setShowSuccess(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                            setFormError("Payment verified but confirmation failed. Please contact support.");
                        }
                    } catch {
                        setFormError("Payment verification failed. Please contact support.");
                    }
                    setIsSubmitting(false);
                },
                modal: {
                    ondismiss: () => setIsSubmitting(false),
                },
            });

            rzp.open();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    /* ── Order Confirmed ── */
    if (showSuccess) {
        return (
            <div className="min-h-[70vh] bg-neutral-50">
                <div className="section container flex flex-col items-center text-center">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
                    </div>
                    <p className="text-[15px] font-medium text-emerald-700">Order Confirmed</p>
                    <h1 className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">Order Placed Successfully!</h1>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
                        {hasPricedItems ? "Payment received. We'll process and ship your order shortly." : "Thank you! We've received your order and will confirm shortly."}
                    </p>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-500">Our team will contact you within 24 hours to confirm availability and arrange delivery.</p>
                    <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link href="/products" className={PILL_PRIMARY}>
                            Continue Shopping
                        </Link>
                        <Link href="/account/orders" className="btn btn-secondary btn-lg">
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Empty cart ── */
    if (mounted && items.length === 0) {
        return (
            <div className="min-h-[70vh] bg-neutral-50">
                <div className="section container flex flex-col items-center text-center">
                    <ShoppingCart className="mb-6 h-12 w-12 text-neutral-400" aria-hidden="true" />
                    <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-4xl">Your cart is empty</h1>
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
                <Link
                    href="/cart"
                    className="focus-visible:outline-primary-500 -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Cart
                </Link>

                <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">Checkout</h1>

                    {/* Step indicator */}
                    <ol className="flex items-center gap-2 text-[13px] font-medium" aria-label="Checkout progress">
                        <li className="flex items-center gap-2 text-neutral-500">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/[0.06]">
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            Cart
                        </li>
                        <li aria-hidden="true" className="h-px w-6 bg-neutral-900/10 sm:w-10" />
                        <li className="flex items-center gap-2 text-neutral-900" aria-current="step">
                            <span className="bg-primary-800 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">2</span>
                            Checkout
                        </li>
                        <li aria-hidden="true" className="h-px w-6 bg-neutral-900/10 sm:w-10" />
                        <li className="flex items-center gap-2 text-neutral-500">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/[0.06] text-xs font-semibold">3</span>
                            Confirmed
                        </li>
                    </ol>
                </div>

                <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
                    {/* ── Left: Delivery form ── */}
                    <div className="min-w-0">
                        <section className={`${SURFACE_CARD} overflow-hidden`}>
                            <div className="px-6 pt-6 md:px-8 md:pt-8">
                                <h2 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">Delivery Details</h2>
                                <p className="mt-1 text-[15px] text-neutral-500">We&apos;ll ship to this address</p>
                            </div>

                            {hasPricedItems ? (
                                <form ref={formRef} onSubmit={handleSubmit} className="px-6 pt-6 pb-6 md:px-8 md:pb-8">
                                    {/* Hidden fields required by the quote flow (cart items, honeypot, timestamp) */}
                                    <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
                                    <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                                        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                                    </div>
                                    <input type="hidden" name="formTimestamp" value={Date.now().toString()} />
                                    {formError && (
                                        <div role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                            {formError}
                                        </div>
                                    )}

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <InputField label="Full Name" icon={User} name="name" type="text" required autoComplete="name" placeholder="Dr. Ranvijay Singh" />
                                        <InputField label="Phone Number" icon={Phone} name="phone" type="tel" required autoComplete="tel" placeholder="+91 9876543210" />
                                        <div className="sm:col-span-2">
                                            <InputField label="Email Address" icon={Mail} name="email" type="email" required autoComplete="email" placeholder="doctor@clinic.com" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <InputField label="Clinic / Practice Name" icon={Building2} name="company" type="text" autoComplete="organization" placeholder="Your Dental Practice" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="checkout-message" className="form-label flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-neutral-500" aria-hidden="true" />
                                                Delivery Address
                                                <span className="text-red-600" aria-hidden="true">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                id="checkout-message"
                                                name="message"
                                                required
                                                rows={3}
                                                autoComplete="street-address"
                                                placeholder="Street address, City, State, PIN code"
                                                className="form-input resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment note */}
                                    <div className="mt-8 rounded-2xl bg-neutral-50 p-5">
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="text-primary-700 mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                                            <div>
                                                <h3 className="text-[15px] font-semibold text-neutral-900">{hasPricedItems ? "Secure Online Payment" : "Payment on Confirmation"}</h3>
                                                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                                                    {hasPricedItems
                                                        ? "You'll be redirected to Razorpay's secure payment page. We accept UPI, cards, net banking, and wallets."
                                                        : "Our team will contact you within 24 hours to confirm your order and arrange payment via bank transfer, UPI, or cheque."}
                                                </p>
                                            </div>
                                        </div>

                                        <ul className="mt-4 flex flex-wrap gap-2">
                                            {(hasPricedItems ? ["UPI / GPay", "Credit Card", "Debit Card", "Net Banking"] : ["Bank Transfer", "UPI / GPay", "Cheque", "Cash on Delivery"]).map(
                                                (method) => {
                                                    const Icon = PAYMENT_METHOD_ICONS[method] ?? CreditCard;
                                                    return (
                                                        <li
                                                            key={method}
                                                            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-700 ring-1 ring-neutral-900/[0.06]"
                                                        >
                                                            <Icon className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
                                                            {method}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>

                                    {/* Submit */}
                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg mt-8 w-full">
                                        {isSubmitting ? (
                                            <>
                                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" aria-hidden="true" />
                                                {hasPricedItems ? "Opening Payment…" : "Placing Order…"}
                                            </>
                                        ) : (
                                            <>
                                                {hasPricedItems ? <CreditCard className="h-4 w-4" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
                                                {hasPricedItems ? "Pay Now" : "Place Order"}
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <QuoteForm
                                    onBack={() => {}}
                                    onSuccess={() => {
                                        setShowSuccess(true);
                                    }}
                                />
                            )}
                        </section>
                    </div>

                    {/* ── Right: Order summary ── */}
                    <aside className="lg:sticky lg:top-24" aria-label="Order summary">
                        <div className={`${SURFACE_CARD} overflow-hidden`}>
                            <div className="px-6 pt-6">
                                <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Order Summary</h2>
                                <p className="mt-0.5 text-[13px] text-neutral-500">
                                    {itemCount} {itemCount === 1 ? "item" : "items"}
                                </p>
                            </div>

                            <ul className="mt-3 max-h-64 divide-y divide-neutral-900/[0.06] overflow-y-auto px-6">
                                {items.map((item) => (
                                    <li key={getCartItemKey(item)} className="flex items-center gap-3 py-3">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                                            {item.image ? (
                                                <img src={item.image} alt={item.productName} className="h-full w-full object-contain p-1.5 mix-blend-multiply" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">—</div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-900">{item.productName}</p>
                                            <p className="text-[13px] text-neutral-500 tabular-nums">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="shrink-0 text-sm font-semibold text-neutral-900 tabular-nums">{item.basePrice ? formatPrice(item.basePrice * item.quantity) : "—"}</p>
                                    </li>
                                ))}
                            </ul>

                            <dl className="mx-6 mt-2 space-y-2.5 border-t border-neutral-900/[0.06] py-5 text-[15px]">
                                <div className="flex items-center justify-between">
                                    <dt className="text-neutral-600">
                                        Price ({itemCount} {itemCount === 1 ? "item" : "items"})
                                    </dt>
                                    <dd className="font-medium text-neutral-900 tabular-nums">{subtotal > 0 ? formatPrice(subtotal) : "—"}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-neutral-600">Delivery Charges</dt>
                                    <dd className="font-medium text-emerald-700">Free</dd>
                                </div>
                                <div className="flex items-baseline justify-between pt-3">
                                    <dt className="text-[17px] font-semibold text-neutral-900">Total Amount</dt>
                                    <dd className="text-xl font-semibold tracking-[-0.01em] text-neutral-900 tabular-nums">{subtotal > 0 ? formatPrice(subtotal) : "—"}</dd>
                                </div>
                                {subtotal > 0 && <p className="text-right text-[13px] text-neutral-500">Inclusive of all taxes</p>}
                            </dl>
                        </div>

                        {/* Trust notes */}
                        <ul className="mt-5 space-y-2.5 px-2">
                            {[
                                { icon: Shield, text: "100% secure & safe checkout" },
                                { icon: Truck, text: "Free delivery on all orders" },
                                { icon: FileText, text: "GST invoice provided" },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-2.5 text-[13px] text-neutral-500">
                                    <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
}
