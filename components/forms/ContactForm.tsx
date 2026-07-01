"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { submitContactForm, ContactFormState } from "@/app/actions/contact";
import { Input, Textarea, Button, CountrySelect } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import type { Country } from "@/components/ui/CountrySelect";
import { toast } from "sonner";

const initialState: ContactFormState = {
    success: false,
};

export default function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [formTimestamp, setFormTimestamp] = useState<string>("");
    const [messageLength, setMessageLength] = useState(0);
    const MESSAGE_MAX = 5000;

    useEffect(() => {
        setFormTimestamp(Date.now().toString());
    }, []);

    useEffect(() => {
        if (state.success) {
            toast.success("Message Sent!", {
                description: "We'll get back to you within 24 hours.",
                duration: 5000,
            });
        }
    }, [state.success]);

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
            <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon size={32} className="text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Message Sent!</h3>
                <p className="text-neutral-600">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6">
            {/* Honeypot — must stay empty; bots fill it, browsers won't (non-semantic name) */}
            <div className="pointer-events-none absolute opacity-0" aria-hidden="true">
                <input type="text" name="_h_check" tabIndex={-1} autoComplete="new-password" aria-hidden="true" />
            </div>

            {/* Hidden timestamp for bot detection */}
            <input type="hidden" name="formTimestamp" value={formTimestamp} />

            {/* Error Message */}
            {state.error && !state.fieldErrors && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">{state.error}</div>}

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Full Name" name="name" type="text" required placeholder="Dr. Jane Smith" error={state.fieldErrors?.name} maxLength={100} />
                <Input label="Email Address" name="email" type="email" required placeholder="you@example.com" error={state.fieldErrors?.email} maxLength={255} />
            </div>

            {/* Phone & Postcode Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Phone Number" name="phone" type="tel" required placeholder="+1 555 0123" error={state.fieldErrors?.phone} maxLength={20} />

                <Input label="Postcode" name="postcode" type="text" placeholder="Optional" error={state.fieldErrors?.postcode} maxLength={15} />
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

            <div>
                <Textarea label="Message" name="message" required placeholder="Describe how we can help you — product questions, quote requests, etc." rows={6} error={state.fieldErrors?.message} maxLength={MESSAGE_MAX} onChange={(e) => setMessageLength(e.target.value.length)} />
                <p className={`mt-1.5 text-right text-xs ${messageLength > MESSAGE_MAX * 0.9 ? "text-amber-600" : "text-neutral-400"}`}>
                    {messageLength} / {MESSAGE_MAX.toLocaleString()}
                </p>
            </div>

            <Button type="submit" size="lg" isLoading={isPending} disabled={isPending}>
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
