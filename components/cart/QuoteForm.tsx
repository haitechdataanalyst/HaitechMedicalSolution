"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { submitQuoteRequest, QuoteFormState } from "@/app/actions/quote";
import { Input, Textarea, Button } from "@/components/ui";
import { CheckIcon, ArrowBackIcon } from "@/components/icons";
import { toast } from "sonner";

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
            <div className="p-6 text-center">
                <div className="bg-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <CheckIcon size={32} className="text-success" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">Order Placed!</h3>
                <p className="text-muted">We&apos;ve received your order and will confirm via email shortly.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Back Button */}
            <button onClick={onBack} className="text-muted hover:text-foreground mb-4 flex items-center gap-1 text-sm transition-colors">
                <ArrowBackIcon size={16} />
                Back to cart
            </button>

            <p className="text-muted mb-6 text-sm">Enter your details to place the order. We&apos;ll confirm availability and arrange delivery.</p>

            {/* Error Message */}
            {state.error && !state.fieldErrors && <div className="bg-error/10 border-error text-error mb-4 rounded-lg border p-3 text-sm">{state.error}</div>}

            <form action={formAction} className="space-y-4">
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

                <Button type="submit" className="w-full" isLoading={isPending} disabled={isPending}>
                    {isPending ? "Placing Order..." : "Place Order"}
                </Button>
            </form>
        </div>
    );
}
