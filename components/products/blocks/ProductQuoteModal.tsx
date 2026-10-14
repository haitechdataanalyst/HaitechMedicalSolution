"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { submitProductQuote, ProductQuoteFormState } from "@/app/actions/productQuote";
import { Input, Textarea, Button, CountrySelect, Select, Modal } from "@/components/ui";
import type { Country } from "@/components/ui/CountrySelect";
import { INDIAN_STATES } from "@/lib/indian-states";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

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
    const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    const validatePhone = (value: string, country: Country | null) => {
        if (!value || !country) {
            setPhoneError(undefined);
            return;
        }
        setPhoneError(isValidPhoneNumber(value, country.code as CountryCode) ? undefined : `Enter a valid phone number for ${country.name}`);
    };

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            // Use setTimeout to avoid setState during render
            const timer = setTimeout(() => {
                setSelectedCountry(null);
                setPhoneError(undefined);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close immediately on success — the toast carries the confirmation, so the
    // modal doesn't need to linger open (a delayed close here previously relied
    // on `onClose`'s identity staying stable across the wait, which it isn't).
    // Guarded by object identity (not the `.success` boolean) because this
    // component stays mounted across opens: comparing the boolean alone either
    // re-fires the toast whenever `onClose`'s identity changes on an unrelated
    // re-render, or — if that's fixed — misses a second real success in the same
    // session because `true === true` looks like "nothing changed" to React.
    const prevStateRef = useRef(state);
    useEffect(() => {
        const isNewState = state !== prevStateRef.current;
        prevStateRef.current = state;
        if (isNewState && state.success) {
            trackEvent("quote_request", { form: "product_quote", item_id: productSku, item_name: productName });
            toast.success("Quote Request Sent!", {
                description: `We'll get back to you about ${productName} as soon as possible.`,
                duration: 5000,
            });
            onClose();
        }
    }, [state, productName, productSku, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request a Quote" size="lg">
            <form action={formAction} className="space-y-5">
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
                {state.error && !state.fieldErrors && (
                    <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-700">
                        {state.error}
                    </div>
                )}

                {/* Product Info Display */}
                <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
                    <p className="text-[13px] text-neutral-500">Requesting quote for</p>
                    <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{productName}</p>
                    <p className="mt-0.5 text-[13px] text-neutral-500">
                        SKU {productSku}
                        {selectedVariant && <> · {selectedVariant}</>}
                    </p>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input label="Full Name" name="name" type="text" required placeholder="Ranvijay Singh" error={state.fieldErrors?.name} maxLength={100} />

                    <Input label="Email Address" name="email" type="email" required placeholder="ranvijay@example.com" error={state.fieldErrors?.email} maxLength={255} />
                </div>

                {/* Phone & Country Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                        ref={phoneInputRef}
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        error={phoneError || state.fieldErrors?.phone}
                        maxLength={20}
                        onBlur={(e) => validatePhone(e.target.value, selectedCountry)}
                    />

                    <div className="relative">
                        <CountrySelect
                            label="Country"
                            name="country"
                            required
                            value={selectedCountry?.code}
                            onChange={(country) => {
                                setSelectedCountry(country);
                                validatePhone(phoneInputRef.current?.value ?? "", country);
                            }}
                            error={state.fieldErrors?.country}
                            placeholder="Select your country"
                        />
                    </div>
                </div>

                {/* State & Postcode Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {selectedCountry?.code === "IN" ? (
                        <Select label="State" name="state" required options={INDIAN_STATES} error={state.fieldErrors?.state} />
                    ) : (
                        <Input label="State" name="state" type="text" required placeholder="Maharashtra" error={state.fieldErrors?.state} maxLength={100} />
                    )}

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

                <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
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
