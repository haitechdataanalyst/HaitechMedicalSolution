"use client";

import { useActionState, useState, useEffect } from "react";
import { submitProductQuote, ProductQuoteFormState } from "@/app/actions/productQuote";
import { Input, Textarea, Button, CountrySelect, Modal } from "@/components/ui";
import type { Country } from "@/components/ui/CountrySelect";
import { toast } from "sonner";

const initialState: ProductQuoteFormState = {
    success: false,
};

interface ProductQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productSku: string;
    productId: string;
    selectedVariant?: string;
}

export default function ProductQuoteModal({ isOpen, onClose, productName, productSku, productId, selectedVariant }: ProductQuoteModalProps) {
    const [state, formAction, isPending] = useActionState(submitProductQuote, initialState);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [formTimestamp] = useState<string>(() => Date.now().toString());

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            // Use setTimeout to avoid setState during render
            const timer = setTimeout(() => {
                setSelectedCountry(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close immediately on success — the toast carries the confirmation, so the
    // modal doesn't need to linger open (a delayed close here previously relied
    // on `onClose`'s identity staying stable across the wait, which it isn't).
    useEffect(() => {
        if (state.success) {
            toast.success("Quote Request Sent!", {
                description: `We'll get back to you about ${productName} as soon as possible.`,
                duration: 5000,
            });
            onClose();
        }
    }, [state.success, productName, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request a Quote" size="lg">
            <form action={formAction} className="space-y-6">
                {/* Honeypot field - hidden from users, bots will fill it */}
                <div className="pointer-events-none absolute opacity-0" aria-hidden="true">
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Hidden fields for product information */}
                <input type="hidden" name="formTimestamp" value={formTimestamp} />
                <input type="hidden" name="productName" value={productName} />
                <input type="hidden" name="productSku" value={productSku} />
                <input type="hidden" name="productId" value={productId} />
                {selectedVariant && <input type="hidden" name="selectedVariant" value={selectedVariant} />}

                {/* Error Message */}
                {state.error && !state.fieldErrors && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">{state.error}</div>}

                {/* Product Info Display */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-1 font-medium text-neutral-900">Requesting Quote For:</h4>
                    <p className="text-neutral-700">
                        {productName} <span className="text-neutral-500">(SKU: {productSku})</span>
                    </p>
                    {selectedVariant && <p className="mt-1 text-sm text-neutral-600">Variant: {selectedVariant}</p>}
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input label="Full Name" name="name" type="text" required placeholder="Ranvijay Singh" error={state.fieldErrors?.name} maxLength={100} />

                    <Input label="Email Address" name="email" type="email" required placeholder="ranvijay@example.com" error={state.fieldErrors?.email} maxLength={255} />
                </div>

                {/* Phone & Country Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input label="Phone Number" name="phone" type="tel" required placeholder="+91 9876543210" error={state.fieldErrors?.phone} maxLength={20} />

                    <div className="relative">
                        <CountrySelect
                            label="Country"
                            name="country"
                            required
                            value={selectedCountry?.code}
                            onChange={setSelectedCountry}
                            error={state.fieldErrors?.country}
                            placeholder="Select your country"
                        />
                    </div>
                </div>

                {/* State & Postcode Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input label="State" name="state" type="text" required placeholder="Maharashtra" error={state.fieldErrors?.state} maxLength={100} />

                    <Input label="Postcode" name="postcode" type="text" required placeholder="400086" error={state.fieldErrors?.postcode} maxLength={15} />
                </div>

                <Input label="Subject" name="subject" type="text" required placeholder="Quote request for this product" error={state.fieldErrors?.subject} maxLength={200} />

                <Textarea
                    label="Message"
                    name="message"
                    required
                    placeholder="Please provide any additional details or questions about this product..."
                    rows={5}
                    error={state.fieldErrors?.message}
                    maxLength={5000}
                />

                <div className="flex gap-3">
                    <Button type="submit" size="lg" isLoading={isPending} disabled={isPending} className="flex-1">
                        {isPending ? "Sending..." : "Send Quote Request"}
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
