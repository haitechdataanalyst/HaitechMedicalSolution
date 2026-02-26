"use client";

import { useActionState, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { submitQuoteRequest, QuoteFormState } from "@/app/actions/quote";
import { Input, Textarea, Button } from "@/components/ui";
import { CheckIcon, ArrowBackIcon } from "@/components/icons";

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
            // Delay before closing to show success message
            const timer = setTimeout(() => {
                onSuccess();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, clearCart, onSuccess]);

    if (showSuccess) {
        return (
            <div className="p-6 text-center">
                <div className="bg-primary-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <CheckIcon size={32} className="text-success" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">Quote Request Sent!</h3>
                <p className="text-muted">We&apos;ll be in touch shortly with your quote.</p>
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

            <p className="text-muted mb-6 text-sm">Fill in your details below and we&apos;ll send you a detailed quote for your selected items.</p>

            {/* Error Message */}
            {state.error && !state.fieldErrors && <div className="bg-error/10 border-error text-error mb-4 rounded-lg border p-3 text-sm">{state.error}</div>}

            <form action={formAction} className="space-y-4">
                {/* Hidden cart items */}
                <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

                <Input label="Full Name" name="name" type="text" required placeholder="Ranvijay Singh" error={state.fieldErrors?.name} />

                <Input label="Email Address" name="email" type="email" required placeholder="ranvijay@example.com" error={state.fieldErrors?.email} />

                <Input label="Phone Number" name="phone" type="tel" required placeholder="+91 9876543210" error={state.fieldErrors?.phone} />

                <Input label="Company (Optional)" name="company" type="text" placeholder="Your Dental Practice" error={state.fieldErrors?.company} />

                <Textarea label="Additional Notes (Optional)" name="message" placeholder="Any special requirements or questions..." error={state.fieldErrors?.message} />

                <Button type="submit" className="w-full" isLoading={isPending} disabled={isPending}>
                    {isPending ? "Sending..." : "Submit Quote Request"}
                </Button>
            </form>
        </div>
    );
}
