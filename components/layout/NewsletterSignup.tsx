"use client";

import { useState } from "react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
        setEmail("");
    };

    if (submitted) {
        return (
            <p className="text-primary-800 text-sm font-medium" role="status">
                Thanks for subscribing — we&apos;ll be in touch!
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
                Email address
            </label>
            <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="focus:ring-primary-500 h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-base text-neutral-900 ring-1 ring-neutral-900/[0.1] transition-shadow duration-200 ease-out outline-none placeholder:text-neutral-500 focus:ring-2 sm:text-[15px]"
            />
            <button
                type="submit"
                className="bg-primary-800 hover:bg-primary-900 focus-visible:outline-primary-500 h-11 shrink-0 rounded-full px-5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
            >
                Subscribe
            </button>
        </form>
    );
}
