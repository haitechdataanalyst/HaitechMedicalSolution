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
import { cn, formatPrice } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";

// One consistent treatment for every quick-link category — the icon already
// differentiates them, so color doesn't need to do that job too.
const POPULAR_CATEGORIES = [
    { label: "Dental Loupes", href: "/product-category/admetec", icon: ZoomIn, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "LED Headlights", href: "/our-headlights", icon: Zap, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "Dental Chairs", href: "/product-category/almadent/chairs", icon: Monitor, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "Diamond Burs", href: "/product-category/strauss", icon: Gem, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "Instruments", href: "/our-instruments", icon: Scissors, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "Saddle Chairs", href: "/product-category/salli", icon: Activity, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
];

// One consistent treatment for every brand — a manufacturer label is
// informational metadata, not a decorative tag (see lib/brand.ts).
const BRAND_STYLES: Record<string, { label: string; bar: string; badge: string }> = {
    admetec:  { label: "Admetec",  bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    almadent: { label: "Almadent", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    medesy:   { label: "Medesy",   bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    salli:    { label: "Salli",    bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    strauss:  { label: "Strauss",  bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
};

function detectBrandFromPath(path: string) {
    const lower = path.toLowerCase();
    for (const key of Object.keys(BRAND_STYLES)) {
        if (lower.includes(key)) return BRAND_STYLES[key];
    }
    return null;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-primary-100 text-primary-800 rounded px-0.5 not-italic font-bold">
                {text.slice(idx, idx + query.trim().length)}
            </mark>
            {text.slice(idx + query.trim().length)}
        </>
    );
}

// ── Desktop dropdown (no input — input lives in Header) ──────────────────────

interface DropdownPanelProps {
    query: string;
    onClose: () => void;
    onResultSelect: (term: string) => void;
}

function DropdownPanel({ query, onClose, onResultSelect }: DropdownPanelProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [trending, setTrending] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isPending, startTransition] = useTransition();
    const trendingLoaded = useRef(false);
    const router = useRouter();

    // Load recents once
    useEffect(() => {
        try {
            const stored = localStorage.getItem("haitech_searches");
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch {}
    }, []);

    // Load trending once
    useEffect(() => {
        if (trendingLoaded.current) return;
        trendingLoaded.current = true;
        startTransition(async () => {
            const products = await getTrendingProducts();
            setTrending(products);
        });
    }, []);

    // Live search
    useEffect(() => {
        if (!query.trim()) { setResults([]); setSelectedIndex(-1); return; }
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
        onResultSelect(result.name);
        router.push(result.path);
        onClose();
    }, [saveSearch, onResultSelect, router, onClose]);

    // Expose keyboard nav to parent via window event — Header's input fires keydown
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
            if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)); }
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
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selectedIndex, results, query, handleSelect, saveSearch, router, onClose]);

    const hasQuery = query.trim().length > 0;

    return (
        <div className="max-h-[72vh] overflow-y-auto">
            {/* ── Empty / idle state ── */}
            {!hasQuery && (
                <div className="space-y-5 p-5">
                    {recentSearches.length > 0 && (
                        <div>
                            <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                <Clock className="h-3 w-3" /> Recent Searches
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((s) => (
                                    <div
                                        key={s}
                                        onClick={() => onResultSelect(s)}
                                        className="group flex cursor-pointer items-center gap-1 rounded-full border border-neutral-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-neutral-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                    >
                                        <span>{s}</span>
                                        <button
                                            onClick={(e) => removeRecent(s, e)}
                                            className="rounded-full p-0.5 text-neutral-300 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                            <TrendingUp className="h-3 w-3" /> Shop by Category
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {POPULAR_CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.href}
                                    href={cat.href}
                                    onClick={onClose}
                                    className={cn("group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-all duration-150", cat.bg, cat.text, cat.hover)}
                                >
                                    <cat.icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 leading-tight">{cat.label}</span>
                                    <ChevronRight className="h-3.5 w-3.5 opacity-30 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-70" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {trending.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    <Flame className="h-3 w-3 text-orange-500" /> Trending Products
                                </p>
                                <Link href="/products" onClick={onClose} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary-600 hover:text-primary-700">
                                    See all <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {trending.map((product) => (
                                    <Link key={product.id} href={product.path} onClick={onClose} className="group w-[108px] shrink-0">
                                        <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 transition-all group-hover:border-neutral-200 group-hover:shadow-sm">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.name} width={84} height={84} className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.04]" />
                                            ) : (
                                                <Package2 className="h-8 w-8 text-neutral-300" />
                                            )}
                                        </div>
                                        <p className="line-clamp-2 text-xs font-medium leading-snug text-neutral-700 transition-colors group-hover:text-primary-700">{product.name}</p>
                                        {shouldShowPrice(detectBrandFromPath(product.path)?.label) && (product.basePrice ? (
                                            <p className="mt-0.5 text-xs font-bold text-neutral-900">{formatPrice(product.basePrice, product.currency)}</p>
                                        ) : (
                                            <p className="mt-0.5 text-[11px] text-neutral-400">On request</p>
                                        ))}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

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

            {/* ── Results ── */}
            {hasQuery && (
                <div>
                    {results.length > 0 ? (
                        <>
                            <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-2.5">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    {isPending ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
                                </p>
                            </div>
                            <ul className="divide-y divide-neutral-50">
                                {results.map((result, i) => (
                                    <li key={`${result.type}-${result.id}`}>
                                        <button
                                            onClick={() => handleSelect(result)}
                                            className={cn(
                                                "relative flex w-full items-center gap-4 px-5 py-3 text-left transition-all duration-100",
                                                selectedIndex === i ? "bg-primary-50" : "hover:bg-neutral-50"
                                            )}
                                        >
                                            {(() => {
                                                const brand = detectBrandFromPath(result.path);
                                                return brand ? <span className={cn("absolute left-0 top-0 h-full w-1 rounded-r-full", brand.bar)} /> : null;
                                            })()}
                                            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm">
                                                {result.image ? (
                                                    <Image src={result.image} alt={result.name} fill className="object-contain p-2" sizes="72px" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-neutral-50">
                                                        <Package2 className="h-7 w-7 text-neutral-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-neutral-900">
                                                    <HighlightMatch text={result.name} query={query} />
                                                </p>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                    {(() => {
                                                        const brand = detectBrandFromPath(result.path);
                                                        return brand ? (
                                                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold", brand.badge)}>
                                                                {brand.label}
                                                            </span>
                                                        ) : null;
                                                    })()}
                                                    {result.categoryName && (
                                                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                                                            {result.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                {shouldShowPrice(detectBrandFromPath(result.path)?.label) && (result.basePrice ? (
                                                    <p className="font-bold text-neutral-900">{formatPrice(result.basePrice, result.currency)}</p>
                                                ) : (
                                                    <p className="text-xs text-neutral-400">On request</p>
                                                ))}
                                                <ArrowRight className={cn("ml-auto mt-1 h-4 w-4", selectedIndex === i ? "text-primary-400" : "text-neutral-300")} />
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
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
                        <div className="px-5 py-10 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                                <Package2 className="h-8 w-8 text-neutral-300" />
                            </div>
                            <p className="mb-1 font-semibold text-neutral-700">No results for &ldquo;{query}&rdquo;</p>
                            <p className="mb-5 text-sm text-neutral-400">Try a different term or browse a category</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["Dental Loupes", "LED Headlights", "Dental Chairs", "Diamond Burs"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onResultSelect(s)}
                                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Mobile overlay (full-screen, self-contained input) ───────────────────────

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 60);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex flex-col bg-white shadow-2xl" style={{ maxHeight: "90dvh" }}>
                {/* Input bar */}
                <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5">
                    <Search className="h-5 w-5 shrink-0 text-primary-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && onClose()}
                        placeholder="Search products, brands, categories…"
                        className="flex-1 bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 outline-none"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        onClick={query ? () => setQuery("") : onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <DropdownPanel query={query} onClose={onClose} onResultSelect={setQuery} />
                </div>
            </div>
        </div>
    );
}

// ── Public exports ───────────────────────────────────────────────────────────

// Dropdown panel — rendered inside a `position: relative` container in Header
interface GlobalSearchDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    onQueryChange: (q: string) => void;
}

export function GlobalSearchDropdown({ isOpen, onClose, query, onQueryChange }: GlobalSearchDropdownProps) {
    if (!isOpen) return null;
    return (
        <div className="absolute top-full left-0 right-0 z-[200] mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-top-2 duration-150">
            <DropdownPanel query={query} onClose={onClose} onResultSelect={onQueryChange} />
        </div>
    );
}

// Mobile overlay — rendered at root level
export function GlobalSearchMobile({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return <MobileSearchOverlay isOpen={isOpen} onClose={onClose} />;
}

// Legacy export so any other import of GlobalSearch doesn't break
export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return <MobileSearchOverlay isOpen={isOpen} onClose={onClose} />;
}
