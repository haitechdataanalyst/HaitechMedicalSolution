"use client";

import { useState, useEffect, useTransition, useRef, useCallback, useId } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Clock, Package2, ArrowRight, ChevronRight, ZoomIn, Zap, Monitor, Gem, Scissors, Activity } from "lucide-react";
import { searchCatalog, getTrendingProducts, type SearchResult } from "@/app/actions/search";
import { cn, formatPrice } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";

// One consistent treatment for every quick-link category — the icon already
// differentiates them, so color doesn't need to do that job too.
const POPULAR_CATEGORIES = [
    {
        label: "Dental Loupes",
        href: "/product-category/admetec",
        icon: ZoomIn,
        bg: "bg-neutral-50 border-neutral-200",
        text: "text-neutral-700",
        hover: "hover:bg-primary-50 hover:border-primary-200",
    },
    { label: "LED Headlights", href: "/our-headlights", icon: Zap, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    {
        label: "Dental Chairs",
        href: "/product-category/almadent/chairs",
        icon: Monitor,
        bg: "bg-neutral-50 border-neutral-200",
        text: "text-neutral-700",
        hover: "hover:bg-primary-50 hover:border-primary-200",
    },
    { label: "Diamond Burs", href: "/product-category/strauss", icon: Gem, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    { label: "Instruments", href: "/our-instruments", icon: Scissors, bg: "bg-neutral-50 border-neutral-200", text: "text-neutral-700", hover: "hover:bg-primary-50 hover:border-primary-200" },
    {
        label: "Saddle Chairs",
        href: "/product-category/salli",
        icon: Activity,
        bg: "bg-neutral-50 border-neutral-200",
        text: "text-neutral-700",
        hover: "hover:bg-primary-50 hover:border-primary-200",
    },
];

// Shared row/label/footer styles for the search popover.
const GROUP_LABEL = "mb-2 flex items-center gap-1.5 px-1 text-[13px] font-medium text-neutral-500";
// Feedback lands on the press itself (active:), not on release.
const ROW = "flex min-h-11 items-center rounded-xl px-2 transition-colors duration-150 hover:bg-neutral-900/[0.04] active:bg-neutral-900/[0.07]";
const FOOT_CTA =
    "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900/[0.05] text-[15px] font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-900/[0.08]";

// One consistent treatment for every brand — a manufacturer label is
// informational metadata, not a decorative tag (see lib/brand.ts).
const BRAND_STYLES: Record<string, { label: string; bar: string; badge: string }> = {
    admetec: { label: "Admetec", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    almadent: { label: "Almadent", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    medesy: { label: "Medesy", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    salli: { label: "Salli", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
    strauss: { label: "Strauss", bar: "bg-primary-400", badge: "bg-neutral-100 text-neutral-600" },
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
            <mark className="bg-primary-50 text-primary-800 rounded-sm font-semibold">{text.slice(idx, idx + query.trim().length)}</mark>
            {text.slice(idx + query.trim().length)}
        </>
    );
}

// The results list ids the two search inputs name in aria-controls (Header.tsx for the first).
export const HEADER_LIST_ID = "header-search-results";
const MOBILE_LIST_ID = "mobile-search-results";

// ── Desktop dropdown (no input — input lives in Header) ──────────────────────

interface DropdownPanelProps {
    /** id of the results list, the one the owning input names in aria-controls. */
    listId: string;
    query: string;
    onClose: () => void;
    onResultSelect: (term: string) => void;
}

function DropdownPanel({ listId, query, onClose, onResultSelect }: DropdownPanelProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [trending, setTrending] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isPending, startTransition] = useTransition();
    const trendingLoaded = useRef(false);
    // Answers can arrive out of order; only the newest search may fill the list.
    const latestSearch = useRef(0);
    const idPrefix = useId();
    const optionId = (index: number) => `${idPrefix}-option-${index}`;
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
        const search = ++latestSearch.current;
        if (!query.trim()) {
            setResults([]);
            setSelectedIndex(-1);
            return;
        }
        const t = setTimeout(() => {
            startTransition(async () => {
                const res = await searchCatalog(query);
                if (search !== latestSearch.current) return;
                setResults(res);
                setSelectedIndex(-1);
            });
        }, 180);
        return () => clearTimeout(t);
    }, [query]);

    const saveSearch = useCallback(
        (term: string) => {
            if (!term.trim()) return;
            const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
            setRecentSearches(updated);
            try {
                localStorage.setItem("haitech_searches", JSON.stringify(updated));
            } catch {}
        },
        [recentSearches]
    );

    const removeRecent = useCallback(
        (term: string, e: React.MouseEvent) => {
            e.stopPropagation();
            const updated = recentSearches.filter((s) => s !== term);
            setRecentSearches(updated);
            try {
                localStorage.setItem("haitech_searches", JSON.stringify(updated));
            } catch {}
        },
        [recentSearches]
    );

    const handleSelect = useCallback(
        (result: SearchResult) => {
            saveSearch(result.name);
            onResultSelect(result.name);
            router.push(result.path);
            onClose();
        },
        [saveSearch, onResultSelect, router, onClose]
    );

    // The input lives in another component (Header or the mobile overlay), so its keys arrive as window events. Only keys
    // typed into a search input count; Enter on a focused link or button elsewhere must not start a search.
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.isComposing || !(e.target instanceof Element) || !e.target.closest("[data-search-input]")) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, -1));
            }
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

    // The focused search input is outside this component, so the active option is set on it directly. React renders no
    // aria-activedescendant on those inputs, so nothing here is overwritten.
    useEffect(() => {
        const input = document.activeElement;
        if (!(input instanceof HTMLElement) || !input.matches("[data-search-input]")) return;
        if (selectedIndex >= 0 && results[selectedIndex]) input.setAttribute("aria-activedescendant", `${idPrefix}-option-${selectedIndex}`);
        else input.removeAttribute("aria-activedescendant");
    }, [results, selectedIndex, idPrefix]);

    // Keep the keyboard-selected row in view.
    useEffect(() => {
        if (selectedIndex >= 0) document.getElementById(`${idPrefix}-option-${selectedIndex}`)?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex, idPrefix]);

    return (
        <div className="max-h-[72vh] overflow-y-auto overscroll-contain">
            {/* ── Empty / idle state ── */}
            {!hasQuery && (
                <div className="space-y-6 p-4 sm:p-5">
                    {recentSearches.length > 0 && (
                        <section>
                            <h3 className={GROUP_LABEL}>
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Recent searches
                            </h3>
                            <ul className="flex flex-wrap gap-2">
                                {recentSearches.map((s) => (
                                    <li key={s} className="flex items-center rounded-full bg-neutral-900/[0.05] transition-colors hover:bg-neutral-900/[0.08]">
                                        <button type="button" onClick={() => onResultSelect(s)} className="min-h-9 pr-1 pl-3.5 text-sm font-medium text-neutral-800">
                                            {s}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => removeRecent(s, e)}
                                            className="flex h-9 w-8 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900"
                                            aria-label={`Remove ${s} from recent searches`}
                                        >
                                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section>
                        <h3 className={GROUP_LABEL}>Shop by category</h3>
                        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                            {POPULAR_CATEGORIES.map((cat) => (
                                <Link key={cat.href} href={cat.href} onClick={onClose} className={cn(ROW, "group gap-3 text-[15px] font-medium text-neutral-800")}>
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900/[0.05] text-neutral-600">
                                        <cat.icon className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <span className="flex-1 leading-tight">{cat.label}</span>
                                    <ChevronRight className="h-4 w-4 text-neutral-400 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {trending.length > 0 && (
                        <section>
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className={cn(GROUP_LABEL, "mb-0")}>Trending products</h3>
                                <Link href="/products" onClick={onClose} className="text-primary-700 hover:text-primary-800 inline-flex min-h-9 items-center gap-0.5 text-[13px] font-medium">
                                    See all <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                            <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                                {trending.map((product) => (
                                    <Link key={product.id} href={product.path} onClick={onClose} className="group w-[112px] shrink-0 rounded-xl">
                                        <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={84}
                                                    height={84}
                                                    className="object-contain p-2 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <Package2 className="h-8 w-8 text-neutral-300" aria-hidden="true" />
                                            )}
                                        </div>
                                        <p className="group-hover:text-primary-700 line-clamp-2 text-[13px] leading-snug font-medium text-neutral-800 transition-colors">{product.name}</p>
                                        {shouldShowPrice(detectBrandFromPath(product.path)?.label) &&
                                            (product.basePrice ? (
                                                <p className="mt-0.5 text-[13px] font-semibold text-neutral-900 tabular-nums">{formatPrice(product.basePrice, product.currency)}</p>
                                            ) : (
                                                <p className="mt-0.5 text-xs text-neutral-500">On request</p>
                                            ))}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <Link href="/products" onClick={onClose} className={FOOT_CTA}>
                        Browse All Products
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            )}

            {/* ── Results ── */}
            {hasQuery && (
                <div>
                    {results.length > 0 ? (
                        <>
                            <p className="px-5 pt-4 pb-2 text-[13px] text-neutral-500" aria-live="polite">
                                {isPending ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
                            </p>
                            <ul className="px-2" role="listbox" id={listId} aria-label="Search results">
                                {results.map((result, i) => {
                                    const brand = detectBrandFromPath(result.path);
                                    return (
                                        <li key={`${result.type}-${result.id}`} role="presentation">
                                            <Link
                                                href={result.path}
                                                prefetch={false}
                                                role="option"
                                                id={optionId(i)}
                                                aria-selected={selectedIndex === i}
                                                tabIndex={-1}
                                                onClick={() => {
                                                    saveSearch(result.name);
                                                    onResultSelect(result.name);
                                                    onClose();
                                                }}
                                                className={cn(
                                                    "flex min-h-11 w-full items-center gap-3.5 rounded-xl px-3 py-2 text-left transition-colors duration-150 active:bg-neutral-900/[0.07]",
                                                    selectedIndex === i ? "bg-primary-50" : "hover:bg-neutral-900/[0.04]"
                                                )}
                                            >
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                                                    {result.image ? (
                                                        <Image src={result.image} alt={result.name} fill className="object-contain p-1.5 mix-blend-multiply" sizes="56px" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package2 className="h-6 w-6 text-neutral-300" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[15px] font-medium text-neutral-900">
                                                        <HighlightMatch text={result.name} query={query} />
                                                    </p>
                                                    {(brand || result.categoryName) && (
                                                        <p className="mt-0.5 truncate text-[13px] text-neutral-500">{[brand?.label, result.categoryName].filter(Boolean).join(" · ")}</p>
                                                    )}
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    {shouldShowPrice(brand?.label) &&
                                                        (result.basePrice ? (
                                                            <p className="text-sm font-semibold text-neutral-900 tabular-nums">{formatPrice(result.basePrice, result.currency)}</p>
                                                        ) : (
                                                            <p className="text-xs text-neutral-500">On request</p>
                                                        ))}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="p-3 pt-2">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                                    onClick={() => {
                                        saveSearch(query);
                                        onClose();
                                    }}
                                    className={FOOT_CTA}
                                >
                                    See all results for &ldquo;{query}&rdquo;
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </>
                    ) : !isPending ? (
                        <div className="px-5 py-10 text-center">
                            <p className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">No results for &ldquo;{query}&rdquo;</p>
                            <p className="mt-1 mb-5 text-sm text-neutral-500">Try a different term or browse a category</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["Dental Loupes", "LED Headlights", "Dental Chairs", "Diamond Burs"].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => onResultSelect(s)}
                                        className="min-h-9 rounded-full bg-neutral-900/[0.05] px-3.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-900/[0.08]"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12" role="status" aria-label="Searching">
                            <span className="h-5 w-5 rounded-full border-2 border-neutral-300 border-t-neutral-700 motion-safe:animate-spin" />
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
    // The sheet stays in the page, hidden, so it can animate out the way it came in (a component that unmounts on close
    // can only vanish). Its panel loads trending products when it mounts, so that waits for the first open.
    const [hasOpened, setHasOpened] = useState(false);
    const [wasOpen, setWasOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (isOpen && !hasOpened) setHasOpened(true);
    // Each opening starts with an empty field; clearing on open (not on close) keeps the content steady while the sheet fades out.
    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) setQuery("");
    }

    // While open: the page behind does not scroll, focus moves to the field, and goes back to the search button on close.
    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 60);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = "";
            previouslyFocused?.focus?.();
        };
    }, [isOpen]);

    return (
        <div className={cn("fixed inset-0 z-[200] flex flex-col", !isOpen && "pointer-events-none")} role="dialog" aria-modal="true" aria-label="Search" inert={!isOpen}>
            <div
                className={cn("absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-[opacity,visibility] duration-300 ease-out", isOpen ? "visible opacity-100" : "invisible opacity-0")}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={cn(
                    "material-popover pt-safe relative z-10 flex flex-col rounded-t-none rounded-b-3xl transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isOpen ? "visible translate-y-0 opacity-100" : "invisible opacity-0 motion-safe:-translate-y-3"
                )}
                style={{ maxHeight: "90dvh" }}
            >
                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-neutral-900/[0.06] px-4">
                        <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                        <input
                            ref={inputRef}
                            type="text"
                            data-search-input
                            role="combobox"
                            aria-controls={MOBILE_LIST_ID}
                            aria-expanded={isOpen}
                            aria-autocomplete="list"
                            enterKeyHint="search"
                            inputMode="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Escape" && onClose()}
                            placeholder="Search products, brands, categories…"
                            aria-label="Search the catalogue"
                            className="min-w-0 flex-1 bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-500"
                            autoComplete="off"
                            spellCheck={false}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <button type="button" onClick={onClose} className="text-primary-700 min-h-11 shrink-0 rounded-full px-2 text-[15px] font-medium">
                        Cancel
                    </button>
                </div>
                <div className="overflow-y-auto">{hasOpened && <DropdownPanel listId={MOBILE_LIST_ID} query={query} onClose={onClose} onResultSelect={setQuery} />}</div>
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
        <div className="material-popover animate-popover-in absolute top-full right-0 left-0 z-[200] mt-2 origin-top overflow-hidden rounded-3xl bg-white/[0.96] backdrop-blur-2xl backdrop-saturate-150">
            <DropdownPanel listId={HEADER_LIST_ID} query={query} onClose={onClose} onResultSelect={onQueryChange} />
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
