"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQProps {
    faqs: FAQItem[];
    title?: string;
    subtitle?: string;
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-neutral-100 last:border-b-0">
            <button onClick={onToggle} className="group flex w-full items-center justify-between py-5 text-left transition-colors" aria-expanded={isOpen}>
                <span className={cn("pr-4 text-base font-medium transition-colors", isOpen ? "text-primary-600" : "text-neutral-900 group-hover:text-primary-600")}>{item.question}</span>
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300", isOpen ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-500")}>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300 ease-in-out", isOpen && "rotate-180")} />
                </div>
            </button>
            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <p className="pb-5 leading-relaxed text-neutral-600">{item.answer}</p>
                </div>
            </div>
        </div>
    );
}

export function FAQ({ faqs, title = "Frequently Asked Questions", subtitle = "Find answers to common questions about our products and services." }: FAQProps) {
    const [openId, setOpenId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return faqs;
        return faqs.filter(
            (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        );
    }, [faqs, searchQuery]);

    const handleToggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="bg-neutral-50 py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center">
                        <h2 className="heading-2 mb-3">{title}</h2>
                        <p className="text-neutral-600">{subtitle}</p>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-6">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setOpenId(null); }}
                            placeholder="Search questions…"
                            className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-11 text-sm text-neutral-800 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-2 shadow-sm md:px-8">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq) => (
                                <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
                            ))
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm font-medium text-neutral-500">No results for &ldquo;{searchQuery}&rdquo;</p>
                                <button onClick={() => setSearchQuery("")} className="mt-2 text-xs text-primary-600 hover:underline">Clear search</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
