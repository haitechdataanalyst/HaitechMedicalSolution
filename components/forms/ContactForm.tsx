"use client";

import { useActionState, useState, useEffect } from "react";
import { submitContactForm, ContactFormState } from "@/app/actions/contact";
import { Input, Textarea, Button, CountrySelect } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import type { Country } from "@/components/ui/CountrySelect";

const initialState: ContactFormState = {
    success: false,
};

export default function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [formTimestamp, setFormTimestamp] = useState<string>("");

    // Set form timestamp on mount for bot detection
    useEffect(() => {
        setFormTimestamp(Date.now().toString());
    }, []);

    if (state.success) {
        return (
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon size={32} className="text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6">
            {/* Honeypot field - hidden from users, bots will fill it */}
            <div className="pointer-events-none absolute opacity-0" aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Hidden timestamp for bot detection */}
            <input type="hidden" name="formTimestamp" value={formTimestamp} />

            {/* Error Message */}
            {state.error && !state.fieldErrors && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">{state.error}</div>}

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Full Name" name="name" type="text" required placeholder="John Smith" error={state.fieldErrors?.name} maxLength={100} />

                <Input label="Email Address" name="email" type="email" required placeholder="john@example.com" error={state.fieldErrors?.email} maxLength={255} />
            </div>

            {/* Phone & Postcode Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Phone Number" name="phone" type="tel" required placeholder="+61 400 000 000" error={state.fieldErrors?.phone} maxLength={20} />

                <Input label="Postcode" name="postcode" type="text" required placeholder="2000" error={state.fieldErrors?.postcode} maxLength={15} />
            </div>

            {/* Country Select */}
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

            <Input label="Subject" name="subject" type="text" required placeholder="How can we help?" error={state.fieldErrors?.subject} maxLength={200} />

            <Textarea label="Message" name="message" required placeholder="Your message..." rows={6} error={state.fieldErrors?.message} maxLength={5000} />

            <Button type="submit" size="lg" isLoading={isPending} disabled={isPending}>
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
