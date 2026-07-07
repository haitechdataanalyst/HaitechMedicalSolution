"use client";

import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    faqs: FAQItem[];
}

interface FAQBrand {
    id: string;
    label: string;
    faqs?: FAQItem[];
    sections?: FAQSection[];
}

interface FAQProps {
    brands: FAQBrand[];
    title?: string;
    subtitle?: string;
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    const lines = item.answer.split("\n");
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
                    <div className="space-y-1.5 pb-5 leading-relaxed text-neutral-600">
                        {lines.map((line, i) =>
                            line === "" ? (
                                <div key={i} className="h-1" />
                            ) : (
                                <p key={i} className={cn("text-sm leading-relaxed", line.startsWith("• ") && "pl-3")}>
                                    {line}
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FAQ({ brands, title = "Frequently Asked Questions", subtitle = "Find answers to common questions about our products and services." }: FAQProps) {
    const [activeBrandId, setActiveBrandId] = useState(brands[0]?.id ?? "");
    const [openId, setOpenId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const brand = brands.find((b) => b.id === activeBrandId) ?? brands[0];

    const allFaqs = useMemo<FAQItem[]>(() => {
        if (!brand) return [];
        if (brand.faqs) return brand.faqs;
        return brand.sections?.flatMap((s) => s.faqs) ?? [];
    }, [brand]);

    const isSearching = searchQuery.trim().length > 0;

    const filteredFaqs = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return allFaqs;
        return allFaqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }, [allFaqs, searchQuery]);

    const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

    const handleBrandChange = (id: string) => {
        setActiveBrandId(id);
        setOpenId(null);
        setSearchQuery("");
    };

    return (
        <section className="bg-neutral-50 py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center">
                        <h2 className="heading-2 mb-3">{title}</h2>
                        <p className="text-neutral-600">{subtitle}</p>
                    </div>

                    {/* Brand tabs */}
                    {brands.length > 1 && (
                        <div
                            className="mb-6 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: "none" } as CSSProperties}
                        >
                            {brands.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => handleBrandChange(b.id)}
                                    className={cn(
                                        "flex-none rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                                        activeBrandId === b.id
                                            ? "bg-primary-500 text-white shadow-md"
                                            : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:text-primary-600"
                                    )}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search bar */}
                    <div className="relative mb-6">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setOpenId(null); }}
                            placeholder="Search questions…"
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-11 pr-11 text-sm text-neutral-800 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* FAQ content */}
                    {isSearching ? (
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
                    ) : brand?.sections ? (
                        <div className="space-y-6">
                            {brand.sections.map((section, i) => (
                                <div key={i}>
                                    <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">{section.title}</h3>
                                    <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-2 shadow-sm md:px-8">
                                        {section.faqs.map((faq) => (
                                            <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-2 shadow-sm md:px-8">
                            {allFaqs.map((faq) => (
                                <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
