"use client";

import { useId, useState, useMemo } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

export interface FAQSection {
    title: string;
    faqs: FAQItem[];
}

/** One tab of questions: a product category (e.g. Dental Loupes), optionally split into titled sections. */
export interface FAQGroup {
    id: string;
    label: string;
    faqs?: FAQItem[];
    sections?: FAQSection[];
}

interface FAQProps {
    groups: FAQGroup[];
    title?: string;
    subtitle?: string;
    /** Defaults to showing search only when the active group has more than SEARCH_THRESHOLD questions. */
    searchable?: boolean;
}

const SEARCH_THRESHOLD = 8;

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    const lines = item.answer.split("\n");
    const uid = useId();
    const buttonId = `${uid}-q`;
    const panelId = `${uid}-a`;
    return (
        <div>
            <h3 className="m-0 text-[length:inherit] font-normal">
                <button
                    id={buttonId}
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group focus-visible:outline-primary-500 flex min-h-14 w-full items-center justify-between gap-4 rounded-lg py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <span className="group-hover:text-primary-800 text-[16px] leading-snug font-medium tracking-[-0.01em] text-neutral-900 transition-colors duration-200 ease-out md:text-[17px]">
                        {item.question}
                    </span>
                    <ChevronDown
                        className={cn("h-5 w-5 shrink-0 text-neutral-500 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out", isOpen && "rotate-180 text-neutral-900")}
                        aria-hidden="true"
                    />
                </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pr-9 pb-5">
                <div className="space-y-2 text-[15px] leading-relaxed text-neutral-600 md:text-base">
                    {lines.map((line, i) =>
                        line === "" ? (
                            <div key={i} className="h-1" />
                        ) : (
                            <p key={i} className={cn(line.startsWith("•") && "pl-3")}>
                                {line}
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

/** A quiet card holding disclosure rows separated by hairlines. */
function FAQList({ items, openId, onToggle }: { items: FAQItem[]; openId: number | null; onToggle: (id: number) => void }) {
    return (
        <div className={`${SURFACE_CARD} divide-y divide-neutral-900/[0.06] px-5 md:px-8`}>
            {items.map((faq) => (
                <AccordionItem key={faq.id} item={faq} isOpen={openId === faq.id} onToggle={() => onToggle(faq.id)} />
            ))}
        </div>
    );
}

export function FAQ({ groups, title = "Frequently Asked Questions", subtitle = "Find answers to common questions about our products and services.", searchable }: FAQProps) {
    const [activeBrandId, setActiveBrandId] = useState(groups[0]?.id ?? "");
    const [openId, setOpenId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const brand = groups.find((b) => b.id === activeBrandId) ?? groups[0];

    const allFaqs = useMemo<FAQItem[]>(() => {
        if (!brand) return [];
        if (brand.faqs) return brand.faqs;
        return brand.sections?.flatMap((s) => s.faqs) ?? [];
    }, [brand]);

    const showSearch = searchable ?? allFaqs.length > SEARCH_THRESHOLD;
    const isSearching = showSearch && searchQuery.trim().length > 0;

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
        <section className="bg-neutral-50 py-16 md:py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center md:mb-10">
                        <h2 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">{title}</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">{subtitle}</p>
                    </div>

                    {/* Group tabs */}
                    {groups.length > 1 && (
                        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" } as CSSProperties}>
                            {groups.map((b) => {
                                const isActive = activeBrandId === b.id;
                                return (
                                    <button
                                        key={b.id}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => handleBrandChange(b.id)}
                                        className={cn(
                                            "focus-visible:outline-primary-500 inline-flex min-h-11 flex-none items-center rounded-full px-5 text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                                            isActive ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-900/[0.08] hover:bg-neutral-100"
                                        )}
                                    >
                                        {b.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Search bar */}
                    {showSearch && (
                        <div className="relative mb-6">
                            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setOpenId(null);
                                }}
                                placeholder="Search questions…"
                                aria-label="Search questions"
                                className="form-input pr-12 pl-11 [&::-webkit-search-cancel-button]:hidden"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="focus-visible:outline-primary-500 absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* FAQ content */}
                    {isSearching ? (
                        filteredFaqs.length > 0 ? (
                            <FAQList items={filteredFaqs} openId={openId} onToggle={handleToggle} />
                        ) : (
                            <div className={`${SURFACE_CARD} px-6 py-12 text-center`}>
                                <p className="text-[15px] text-neutral-600">No results for &ldquo;{searchQuery}&rdquo;</p>
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 mt-2 inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-medium focus-visible:outline-2"
                                >
                                    Clear search
                                </button>
                            </div>
                        )
                    ) : brand?.sections ? (
                        <div className="space-y-8">
                            {brand.sections.map((section, i) => (
                                <div key={i}>
                                    <h3 className="mb-3 px-1 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{section.title}</h3>
                                    <FAQList items={section.faqs} openId={openId} onToggle={handleToggle} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <FAQList items={allFaqs} openId={openId} onToggle={handleToggle} />
                    )}
                </div>
            </div>
        </section>
    );
}
