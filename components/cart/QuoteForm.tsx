"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { submitQuoteRequest, QuoteFormState } from "@/app/actions/quote";
import { Input, Textarea, Button } from "@/components/ui";
import { CheckIcon, ArrowBackIcon } from "@/components/icons";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

interface QuoteFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

const initialState: QuoteFormState = {
    success: false,
};

export default function QuoteForm({ onBack, onSuccess }: QuoteFormProps) {
    const { items, clearCart } = useCart();
    const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state.success) {
            trackEvent("quote_request", { form: "cart_quote" });
            setShowSuccess(true);
            clearCart();
            toast.success("Order Placed!", {
                description: "We'll confirm your order via email shortly.",
                duration: 5000,
            });
            const timer = setTimeout(() => {
                onSuccess();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, clearCart, onSuccess]);

    useEffect(() => {
        if (state.error && !state.fieldErrors) {
            toast.error("Could not place order", {
                description: state.error,
                duration: 4000,
            });
        }
    }, [state.error, state.fieldErrors]);

    if (showSuccess) {
        return (
            <div className="px-6 py-12 text-center md:px-8" role="status">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                    <CheckIcon size={30} className="text-emerald-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">Order Placed!</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">We&apos;ve received your order and will confirm via email shortly.</p>
            </div>
        );
    }

    return (
        <div className="px-6 pt-4 pb-6 md:px-8 md:pb-8">
            {/* Back Button */}
            <button
                type="button"
                onClick={onBack}
                className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
                <ArrowBackIcon size={16} aria-hidden="true" />
                Back to cart
            </button>

            <p className="mb-6 text-[15px] leading-relaxed text-neutral-600">Enter your details to place the order. We&apos;ll confirm availability and arrange delivery.</p>

            {/* Error Message */}
            {state.error && !state.fieldErrors && <div role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">{state.error}</div>}

            <form action={formAction} className="space-y-5">
                {/* Hidden cart items */}
                <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

                {/* Anti-spam: honeypot field (hidden from users, bots fill it in) */}
                <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                {/* Anti-spam: timestamp for timing-based bot detection */}
                <input type="hidden" name="formTimestamp" value={Date.now().toString()} />

                <Input label="Full Name" name="name" type="text" required placeholder="Ranvijay Singh" error={state.fieldErrors?.name} />

                <Input label="Email Address" name="email" type="email" required placeholder="ranvijay@example.com" error={state.fieldErrors?.email} />

                <Input label="Phone Number" name="phone" type="tel" required placeholder="+91 9876543210" error={state.fieldErrors?.phone} />

                <Input label="Clinic / Practice Name" name="company" type="text" placeholder="Your Dental Practice" error={state.fieldErrors?.company} />

                <Textarea label="Delivery Address" name="message" placeholder="Street, City, State, PIN" error={state.fieldErrors?.message} />

                <Button type="submit" size="lg" className="mt-3 w-full" isLoading={isPending} disabled={isPending}>
                    {isPending ? "Placing Order..." : "Place Order"}
                </Button>
            </form>
        </div>
    );
}
