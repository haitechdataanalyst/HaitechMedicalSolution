"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
        setEmail("");
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {submitted ? (
                <p className="text-sm font-medium text-primary-400">
                    Thanks for subscribing — we&apos;ll be in touch!
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white placeholder-navy-400 outline-none transition-colors focus:border-primary-400 focus:bg-white/12"
                    />
                    <button
                        type="submit"
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-400"
                    >
                        Subscribe
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </form>
            )}
        </div>
    );
}
