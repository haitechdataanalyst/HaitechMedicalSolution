"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Search, X, Clock, TrendingUp, Package2, ArrowRight,
    ChevronRight, Flame, ZoomIn, Zap, Monitor, Gem, Scissors, Activity,
} from "lucide-react";
import { searchCatalog, getTrendingProducts, type SearchResult } from "@/app/actions/search";
import { cn } from "@/lib/utils";

const POPULAR_CATEGORIES = [
    {
        label: "Dental Loupes",
        href: "/product-category/admetec",
        icon: ZoomIn,
        bg: "bg-teal-50 border-teal-100",
        text: "text-teal-700",
        hover: "hover:bg-teal-100 hover:border-teal-300",
    },
    {
        label: "LED Headlights",
        href: "/our-headlights",
        icon: Zap,
        bg: "bg-amber-50 border-amber-100",
        text: "text-amber-700",
        hover: "hover:bg-amber-100 hover:border-amber-300",
    },
    {
        label: "Dental Chairs",
        href: "/product-category/almadent/chairs",
        icon: Monitor,
        bg: "bg-blue-50 border-blue-100",
        text: "text-blue-700",
        hover: "hover:bg-blue-100 hover:border-blue-300",
    },
    {
        label: "Diamond Burs",
        href: "/product-category/strauss",
        icon: Gem,
        bg: "bg-violet-50 border-violet-100",
        text: "text-violet-700",
        hover: "hover:bg-violet-100 hover:border-violet-300",
    },
    {
        label: "Instruments",
        href: "/our-instruments",
        icon: Scissors,
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        hover: "hover:bg-emerald-100 hover:border-emerald-300",
    },
    {
        label: "Saddle Chairs",
        href: "/product-category/salli",
        icon: Activity,
        bg: "bg-rose-50 border-rose-100",
        text: "text-rose-700",
        hover: "hover:bg-rose-100 hover:border-rose-300",
    },
];

function formatINR(amount: number, currency = "INR") {
    if (currency === "INR") {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    }
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [trending, setTrending] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);
    const trendingLoaded = useRef(false);
    const router = useRouter();

    // Load recents
    useEffect(() => {
        try {
            const stored = localStorage.getItem("haitech_searches");
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch {}
    }, []);

    // Reset + focus + load trending on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(-1);
            setTimeout(() => inputRef.current?.focus(), 60);

            if (!trendingLoaded.current) {
                trendingLoaded.current = true;
                startTransition(async () => {
                    const products = await getTrendingProducts();
                    setTrending(products);
                });
            }
        }
    }, [isOpen]);

    // Live search with debounce
    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const t = setTimeout(() => {
            startTransition(async () => {
                const res = await searchCatalog(query);
                setResults(res);
                setSelectedIndex(-1);
            });
        }, 180);
        return () => clearTimeout(t);
    }, [query]);

    const saveSearch = useCallback((term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        try { localStorage.setItem("haitech_searches", JSON.stringify(updated)); } catch {}
    }, [recentSearches]);

    const removeRecent = useCallback((term: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = recentSearches.filter((s) => s !== term);
        setRecentSearches(updated);
        try { localStorage.setItem("haitech_searches", JSON.stringify(updated)); } catch {}
    }, [recentSearches]);

    const handleSelect = useCallback((result: SearchResult) => {
        saveSearch(result.name);
        router.push(result.path);
        onClose();
    }, [saveSearch, router, onClose]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") { onClose(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
        if (e.key === "Enter") {
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            } else if (query.trim()) {
                saveSearch(query);
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    const hasQuery = query.trim().length > 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[5vh] sm:pt-[7vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* ── Unified search card ── */}
            <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-top-3 duration-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)]">

                {/* Input bar */}
                <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3.5">
                    <Search className="h-5 w-5 shrink-0 text-primary-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search loupes, headlights, chairs, instruments…"
                        className="flex-1 bg-transparent py-0.5 text-base text-neutral-900 placeholder:text-neutral-400 outline-none"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <div className="flex items-center gap-2">
                        {isPending && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
                        )}
                        <button
                            onClick={query ? () => setQuery("") : onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                            aria-label={query ? "Clear" : "Close"}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable results area ── */}
                <div className="max-h-[68vh] overflow-y-auto">

                    {/* ── Empty state ── */}
                    {!hasQuery && (
                        <div className="space-y-5 p-5">

                            {/* Recent searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                        <Clock className="h-3 w-3" />
                                        Recent Searches
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((s) => (
                                            <div
                                                key={s}
                                                onClick={() => setQuery(s)}
                                                className="group flex cursor-pointer items-center gap-1 rounded-full border border-neutral-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-neutral-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                            >
                                                <span>{s}</span>
                                                <button
                                                    onClick={(e) => removeRecent(s, e)}
                                                    className="rounded-full p-0.5 text-neutral-300 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
                                                    aria-label="Remove"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category grid */}
                            <div>
                                <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    <TrendingUp className="h-3 w-3" />
                                    Shop by Category
                                </p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {POPULAR_CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.href}
                                            href={cat.href}
                                            onClick={onClose}
                                            className={cn(
                                                "group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-all duration-150",
                                                cat.bg, cat.text, cat.hover
                                            )}
                                        >
                                            <cat.icon className="h-4 w-4 shrink-0" />
                                            <span className="flex-1 leading-tight">{cat.label}</span>
                                            <ChevronRight className="h-3.5 w-3.5 opacity-30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-70" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Trending products */}
                            {trending.length > 0 && (
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                            <Flame className="h-3 w-3 text-orange-500" />
                                            Trending Products
                                        </p>
                                        <Link
                                            href="/products"
                                            onClick={onClose}
                                            className="flex items-center gap-0.5 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                                        >
                                            See all <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                                        {trending.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.path}
                                                onClick={onClose}
                                                className="group w-[108px] shrink-0"
                                            >
                                                <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 transition-all group-hover:border-neutral-200 group-hover:shadow-sm">
                                                    {product.image ? (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            width={84}
                                                            height={84}
                                                            className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.04]"
                                                        />
                                                    ) : (
                                                        <Package2 className="h-8 w-8 text-neutral-300" />
                                                    )}
                                                </div>
                                                <p className="line-clamp-2 text-xs font-medium leading-snug text-neutral-700 transition-colors group-hover:text-primary-700">
                                                    {product.name}
                                                </p>
                                                {product.basePrice ? (
                                                    <p className="mt-0.5 text-xs font-bold text-neutral-900">
                                                        {formatINR(product.basePrice, product.currency)}
                                                    </p>
                                                ) : (
                                                    <p className="mt-0.5 text-[11px] text-neutral-400">On request</p>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Browse all — prominent primary CTA */}
                            <Link
                                href="/products"
                                onClick={onClose}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-bold text-white shadow-[0_2px_10px_-2px_rgb(31_182_205/0.4)] transition-all hover:bg-primary-600 hover:shadow-md"
                            >
                                <Package2 className="h-4 w-4" />
                                Browse All Products
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* ── Search results ── */}
                    {hasQuery && (
                        <div>
                            {results.length > 0 ? (
                                <>
                                    {/* Results count bar */}
                                    <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-2.5">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                            {results.length} Result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                                        </p>
                                    </div>

                                    {/* Product rows */}
                                    <ul className="divide-y divide-neutral-50">
                                        {results.map((result, i) => (
                                            <li key={`${result.type}-${result.id}`}>
                                                <button
                                                    onClick={() => handleSelect(result)}
                                                    className={cn(
                                                        "flex w-full items-center gap-4 border-l-2 px-5 py-3.5 text-left transition-all duration-100",
                                                        selectedIndex === i
                                                            ? "border-primary-500 bg-primary-50"
                                                            : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                                                    )}
                                                >
                                                    {/* Product image */}
                                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white">
                                                        {result.image ? (
                                                            <Image
                                                                src={result.image}
                                                                alt={result.name}
                                                                fill
                                                                className="object-contain p-1.5"
                                                                sizes="56px"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-neutral-50">
                                                                <Package2 className="h-6 w-6 text-neutral-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Name + category badge */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-semibold text-neutral-900">
                                                            {result.name}
                                                        </p>
                                                        {result.categoryName && (
                                                            <span className="mt-1 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                                                                {result.categoryName}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Price + arrow */}
                                                    <div className="shrink-0 text-right">
                                                        {result.basePrice ? (
                                                            <p className="font-bold text-neutral-900">
                                                                {formatINR(result.basePrice, result.currency)}
                                                            </p>
                                                        ) : (
                                                            <p className="text-xs text-neutral-400">On request</p>
                                                        )}
                                                        <ArrowRight className="ml-auto mt-1 h-4 w-4 text-neutral-300" />
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* See all results */}
                                    <div className="border-t border-neutral-100 p-4">
                                        <Link
                                            href={`/search?q=${encodeURIComponent(query.trim())}`}
                                            onClick={() => { saveSearch(query); onClose(); }}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-bold text-white shadow-[0_2px_10px_-2px_rgb(31_182_205/0.4)] transition-all hover:bg-primary-600"
                                        >
                                            <Search className="h-4 w-4" />
                                            See all results for &ldquo;{query}&rdquo;
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </>
                            ) : !isPending ? (
                                /* No results */
                                <div className="px-5 py-10 text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                                        <Package2 className="h-8 w-8 text-neutral-300" />
                                    </div>
                                    <p className="mb-1 font-semibold text-neutral-700">
                                        No results for &ldquo;{query}&rdquo;
                                    </p>
                                    <p className="mb-5 text-sm text-neutral-400">
                                        Try a different term or browse a category
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {["Dental Loupes", "LED Headlights", "Dental Chairs", "Diamond Burs"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setQuery(s)}
                                                className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
