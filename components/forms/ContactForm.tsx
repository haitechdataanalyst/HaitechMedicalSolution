"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { submitContactForm, ContactFormState } from "@/app/actions/contact";
import { Input, Textarea, Button, CountrySelect, Select } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import type { Country } from "@/components/ui/CountrySelect";
import { INDIAN_STATES } from "@/lib/indian-states";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const initialState: ContactFormState = {
    success: false,
};

interface ContactFormProps {
    /** Pre-filled, editable subject — tells the sales team what kind of request this is. */
    defaultSubject?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    submitLabel?: string;
    successTitle?: string;
    successMessage?: string;
    /** Reported to GA4 as generate_lead { form }. */
    formName?: string;
}

export default function ContactForm({
    defaultSubject,
    messageLabel = "Message",
    messagePlaceholder = "Describe how we can help you — product questions, quote requests, etc.",
    submitLabel = "Send Message",
    successTitle = "Message Sent!",
    successMessage = "Thank you for reaching out. We'll get back to you as soon as possible.",
    formName = "contact",
}: ContactFormProps = {}) {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [formTimestamp, setFormTimestamp] = useState<string>("");
    const [messageLength, setMessageLength] = useState(0);
    const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const MESSAGE_MAX = 5000;

    const validatePhone = (value: string, country: Country | null) => {
        if (!value || !country) {
            setPhoneError(undefined);
            return;
        }
        setPhoneError(isValidPhoneNumber(value, country.code as CountryCode) ? undefined : `Enter a valid phone number for ${country.name}`);
    };

    useEffect(() => {
        setFormTimestamp(Date.now().toString());
    }, []);

    useEffect(() => {
        if (state.success) {
            trackEvent("generate_lead", { form: formName });
            toast.success(successTitle, {
                description: "We'll get back to you within 24 hours.",
                duration: 5000,
            });
        }
    }, [state.success, formName, successTitle]);

    useEffect(() => {
        if (state.error && !state.fieldErrors) {
            toast.error("Couldn't send message", {
                description: state.error,
                duration: 4000,
            });
        }
    }, [state.error, state.fieldErrors]);

    if (state.success) {
        return (
            <div role="status" className="rounded-2xl bg-primary-50/60 px-6 py-12 text-center md:px-10 md:py-14">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-white">
                    <CheckIcon size={24} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-neutral-900">{successTitle}</h3>
                <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-neutral-600">{successMessage}</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-5">
            {/* Honeypot — must stay empty; bots fill it, browsers won't (non-semantic name) */}
            <div className="pointer-events-none absolute opacity-0" aria-hidden="true">
                <input type="text" name="_h_check" tabIndex={-1} autoComplete="new-password" aria-hidden="true" />
            </div>

            {/* Hidden timestamp for bot detection */}
            <input type="hidden" name="formTimestamp" value={formTimestamp} />

            {/* Error Message */}
            {state.error && !state.fieldErrors && (
                <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-700">
                    {state.error}
                </div>
            )}

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input label="Full Name" name="name" type="text" required placeholder="Dr. Jane Smith" error={state.fieldErrors?.name} maxLength={100} />
                <Input label="Email Address" name="email" type="email" required placeholder="you@example.com" error={state.fieldErrors?.email} maxLength={255} />
            </div>

            {/* Phone & Country Row */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                    ref={phoneInputRef}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+1 555 0123"
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
                    <Select label="State" name="state" options={INDIAN_STATES} error={state.fieldErrors?.state} />
                ) : (
                    <Input label="State" name="state" type="text" placeholder="Optional" error={state.fieldErrors?.state} maxLength={100} />
                )}

                <Input label="Postcode" name="postcode" type="text" placeholder="Optional" error={state.fieldErrors?.postcode} maxLength={15} />
            </div>

            <Input label="Subject" name="subject" type="text" required placeholder="How can we help?" defaultValue={defaultSubject} error={state.fieldErrors?.subject} maxLength={200} />

            <div>
                <Textarea
                    label={messageLabel}
                    name="message"
                    required
                    placeholder={messagePlaceholder}
                    rows={6}
                    error={state.fieldErrors?.message}
                    maxLength={MESSAGE_MAX}
                    onChange={(e) => setMessageLength(e.target.value.length)}
                />
                <p className={`mt-1.5 text-right text-[13px] tabular-nums ${messageLength > MESSAGE_MAX * 0.9 ? "text-amber-700" : "text-neutral-500"}`}>
                    {messageLength} / {MESSAGE_MAX.toLocaleString()}
                </p>
            </div>

            <Button type="submit" size="lg" isLoading={isPending} disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Sending..." : submitLabel}
            </Button>
        </form>
    );
}
