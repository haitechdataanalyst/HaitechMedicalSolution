"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import ProductQuoteModal from "@/components/products/blocks/ProductQuoteModal";

interface HeadlightCardActionsProps {
    /** Product page for this light. */
    href: string;
    name: string;
    sku: string;
}

/** "View details" + "Request a quote" under a light on the lights page, the same two next steps a loupe card offers. */
export function HeadlightCardActions({ href, name, sku }: HeadlightCardActionsProps) {
    const [quoteOpen, setQuoteOpen] = useState(false);
    // Stable identity — ProductQuoteModal's success effect depends on onClose.
    const closeQuote = useCallback(() => setQuoteOpen(false), []);

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => setQuoteOpen(true)} className="gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Request a Quote
                </Button>
                <Link
                    href={href}
                    className="group focus-visible:outline-primary-500 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-neutral-700 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </div>
            {/* Lights are not rows in the products table, so no productId goes with the quote (see lib/headlight-products.ts). */}
            <ProductQuoteModal isOpen={quoteOpen} onClose={closeQuote} productName={name} productSku={sku} productId="" />
        </>
    );
}
