"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Search, X } from "lucide-react";
import { Category, Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { shouldShowPrice } from "@/lib/config";
import BalancedGrid from "@/components/catalog/BalancedGrid";
import { detectBrand } from "@/lib/brand";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, SURFACE_CARD } from "@/components/ui/surfaces";
import { CardSkeleton, PILL_SELECT, RESULT_COUNT, SEARCH_INPUT } from "@/components/catalog/listing";

export interface CategoryWithPath extends Category {
    path?: string;
}

export interface ProductWithPath extends Product {
    path?: string;
}

export interface CategoryBrowserProps {
    initialCategories: CategoryWithPath[];
    fetchCategoryContents: (categoryId: number) => Promise<{ type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[] }>;
}

type ContentState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "categories"; items: CategoryWithPath[] }
    | { status: "products"; items: ProductWithPath[] };

type NavEntry = { id: number; name: string; path?: string };
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const PAGE_SIZE = 12;
// Search and sort only earn their space on longer lists; a handful of categories needs neither.
const SEARCH_SORT_MIN_ITEMS = 8;
const PLACEHOLDER = "/images/placeholder.jpg";

const BRAND_CATEGORY: Record<string, string> = {
    Admetec: "Loupes · Optics",
    Almadent: "Dental Chairs",
    Medesy: "Instruments",
    Salli: "Ergonomic Seating",
    Strauss: "Burs · Rotary",
};

// Same card material and grid as components/catalog/CategoryPageClient.
const CARD_CLASS = `${INTERACTIVE_CARD} p-2`;
const CARD_MEDIA = "relative aspect-square overflow-hidden rounded-xl bg-neutral-50";
const CARD_IMAGE = "mix-blend-multiply object-contain p-6 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]";
const CARD_SIZES = "(max-width: 1024px) 50vw, 300px";
const GRID = "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4";
const EMPTY = `${SURFACE_CARD} flex h-40 items-center justify-center px-6 text-center text-sm text-neutral-500`;

function SafeImage({ src, alt, ...props }: React.ComponentProps<typeof Image>) {
    const [imgSrc, setImgSrc] = useState((src as string) || PLACEHOLDER);
    useEffect(() => { setImgSrc((src as string) || PLACEHOLDER); }, [src]);
    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(PLACEHOLDER)}
        />
    );
}

function CardLink({ label }: { label: string }) {
    return (
        <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium">
            {label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
    );
}

function CategoryCard({ category, onClick }: { category: CategoryWithPath; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={cn(CARD_CLASS, "w-full text-left")}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className={CARD_MEDIA}>
                <SafeImage src={category.image || PLACEHOLDER} alt={category.name} fill className={CARD_IMAGE} sizes={CARD_SIZES} />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{category.name}</h3>
                <CardLink label="View range" />
            </div>
        </button>
    );
}

function ProductCard({ product }: { product: ProductWithPath }) {
    const image =
        product.defaultImage ||
        product.variants?.[0]?.image ||
        (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") ||
        PLACEHOLDER;
    const path = product.path || `/product/${product.slug}`;
    const showPrice = shouldShowPrice(detectBrand(product.sku).name);

    return (
        <Link href={path} className={CARD_CLASS}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className={CARD_MEDIA}>
                <SafeImage src={image} alt={product.name} fill className={CARD_IMAGE} sizes={CARD_SIZES} />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{product.name}</h3>
                {showPrice && (product.basePrice ? (
                    <p className="mt-2 text-base font-semibold text-neutral-900 tabular-nums">
                        {formatPrice(product.basePrice, product.currency ?? "INR")}
                    </p>
                ) : (
                    <p className="mt-2 text-[13px] text-neutral-500">Price on request</p>
                ))}
                <div className="mt-auto flex items-end justify-between gap-2">
                    <CardLink label="View" />
                    <span className="pb-px text-xs font-medium text-emerald-700">Free Delivery</span>
                </div>
            </div>
        </Link>
    );
}

export default function CategoryBrowser({ initialCategories, fetchCategoryContents }: CategoryBrowserProps) {
    const router = useRouter();
    const cache = useRef<Map<number, { type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[] }>>(new Map());
    const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const scrollToResults = useRef(false);

    const [navStack, setNavStack] = useState<NavEntry[]>([]);
    const [content, setContent] = useState<ContentState>({ status: "idle" });
    const [isFading, setIsFading] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
    }, []);

    const transitionTo = useCallback((newContent: ContentState) => {
        if (fadeTimer.current) clearTimeout(fadeTimer.current);
        setIsFading(true);
        fadeTimer.current = setTimeout(() => {
            setContent(newContent);
            setVisibleCount(PAGE_SIZE);
            setIsFading(false);
        }, 150);
    }, []);

    const loadNode = useCallback(
        async (nodeId: number, nodePath?: string) => {
            const cached = cache.current.get(nodeId);
            if (cached) {
                if (cached.type === "products" && cached.items.length === 1) {
                    const item = cached.items[0] as ProductWithPath;
                    router.push(nodePath || item.path || `/product/${item.slug}`);
                    return;
                }
                transitionTo(
                    cached.type === "categories"
                        ? { status: "categories", items: cached.items as CategoryWithPath[] }
                        : { status: "products", items: cached.items as ProductWithPath[] }
                );
                return;
            }

            transitionTo({ status: "loading" });

            try {
                const result = await fetchCategoryContents(nodeId);
                cache.current.set(nodeId, result);

                if (result.type === "products" && result.items.length === 1) {
                    const item = result.items[0] as ProductWithPath;
                    router.push(nodePath || item.path || `/product/${item.slug}`);
                    return;
                }

                transitionTo(
                    result.type === "categories"
                        ? { status: "categories", items: result.items as CategoryWithPath[] }
                        : { status: "products", items: result.items as ProductWithPath[] }
                );
            } catch {
                transitionTo({ status: "idle" });
            }
        },
        [fetchCategoryContents, router, transitionTo]
    );

    const handleBrandTabClick = (cat: CategoryWithPath) => {
        if (navStack.length === 1 && navStack[0]?.id === cat.id) return;
        setSortBy("default");
        setSearchQuery("");
        scrollToResults.current = true;
        setNavStack([{ id: cat.id, name: cat.name, path: cat.path }]);
        loadNode(cat.id, cat.path);
    };

    const handleSubCategoryClick = (cat: CategoryWithPath) => {
        setSortBy("default");
        setSearchQuery("");
        scrollToResults.current = true;
        setNavStack((prev) => {
            const base = prev.length > 0 ? [prev[0]] : [];
            return [...base, { id: cat.id, name: cat.name, path: cat.path }];
        });
        loadNode(cat.id, cat.path);
    };

    const handleBack = () => {
        if (navStack.length <= 1) return;
        setSortBy("default");
        setSearchQuery("");
        scrollToResults.current = true;
        const newStack = navStack.slice(0, -1);
        setNavStack(newStack);
        const parent = newStack[newStack.length - 1];
        loadNode(parent.id, parent.path);
    };

    // After the visitor picks a brand or category, bring the results into view (instantly under reduced motion).
    useEffect(() => {
        if (!scrollToResults.current || content.status === "idle") return;
        scrollToResults.current = false;
        const header = resultsRef.current;
        if (!header) return;
        const { top } = header.getBoundingClientRect();
        if (top >= 0 && top < window.innerHeight * 0.45) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        header.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, [content]);

    const displayItems = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        if (content.status === "categories") {
            let items = [...content.items];
            if (sortBy === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
            if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
            return items;
        }
        if (content.status === "products") {
            let items = [...content.items] as ProductWithPath[];
            if (sortBy === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
            if (sortBy === "price-asc") items.sort((a, b) => (a.basePrice ?? Infinity) - (b.basePrice ?? Infinity));
            if (sortBy === "price-desc") items.sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
            if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
            return items;
        }
        return [];
    }, [content, sortBy, searchQuery]);

    const visibleItems = displayItems.slice(0, visibleCount);
    const hasMore = visibleCount < displayItems.length;
    const remaining = displayItems.length - visibleCount;

    const activeBrandId = navStack[0]?.id ?? null;
    const isDrilledDown = navStack.length > 1;
    const parentName = isDrilledDown ? navStack[navStack.length - 2]?.name : null;
    const contentLabel = content.status === "categories" ? "categories" : content.status === "products" ? "products" : "";

    const activeNode = navStack[navStack.length - 1] ?? null;
    const hasResults = content.status === "categories" || content.status === "products";
    const showSearchSort = hasResults && content.items.length > SEARCH_SORT_MIN_ITEMS;

    const showPriceSort = content.status === "products" && content.items.some((p) => shouldShowPrice(detectBrand(p.sku).name));

    return (
        <div className="flex flex-col">

            {/* ── Brand tiles: logos on every screen size ── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6" role="group" aria-label="Brands">
                {initialCategories.map((cat) => {
                    const isActive = activeBrandId === cat.id;
                    const categoryLabel = BRAND_CATEGORY[cat.name];
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleBrandTabClick(cat)}
                            aria-pressed={isActive}
                            className={cn(
                                "focus-visible:outline-primary-500 flex min-h-11 min-w-0 flex-col items-center gap-2 rounded-2xl bg-white px-2 py-4 text-center transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.985] sm:gap-3 sm:px-4 sm:py-5",
                                isActive ? "ring-primary-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-2" : "ring-1 ring-neutral-900/[0.06] hover:ring-neutral-900/[0.14]"
                            )}
                        >
                            {cat.image && (
                                <div className="relative h-8 w-16 shrink-0 sm:h-10 sm:w-20">
                                    <Image src={cat.image} alt="" fill className="object-contain" sizes="80px" />
                                </div>
                            )}
                            <div className="space-y-0.5">
                                <p className={cn("text-[13px] leading-tight font-semibold tracking-[-0.01em] sm:text-[15px]", isActive ? "text-primary-800" : "text-neutral-900")}>{cat.name}</p>
                                {categoryLabel && <p className="hidden text-[13px] leading-tight text-neutral-500 sm:block">{categoryLabel}</p>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── Results header: where you are, how many, and (only for long lists) search + sort ── */}
            {content.status !== "idle" && (
                <div ref={resultsRef} className="mt-10 flex scroll-mt-24 flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {isDrilledDown && (
                            <button
                                type="button"
                                onClick={handleBack}
                                aria-label={`Back to ${parentName}`}
                                className="focus-visible:outline-primary-500 hover:text-primary-700 inline-flex h-11 shrink-0 items-center gap-1 rounded-full bg-white pr-4 pl-3 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                {parentName}
                            </button>
                        )}
                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold tracking-[-0.02em] text-neutral-900">{activeNode?.name}</h3>
                            <p className={cn("min-h-5", RESULT_COUNT)} aria-live="polite">
                                {content.status !== "loading" && `${displayItems.length} ${contentLabel}`}
                            </p>
                        </div>
                    </div>

                    {showSearchSort && (
                        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                            <div className="relative min-w-0 flex-1 basis-56 sm:w-64 sm:flex-none">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${contentLabel}`}
                                    aria-label={`Search ${contentLabel}`}
                                    className={SEARCH_INPUT}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                        className="focus-visible:outline-primary-500 absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800 focus-visible:outline-2"
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value as SortOption);
                                    setVisibleCount(PAGE_SIZE);
                                }}
                                aria-label="Sort by"
                                className={PILL_SELECT}
                            >
                                <option value="default">Featured</option>
                                <option value="name-asc">Name: A–Z</option>
                                {showPriceSort && (
                                    <>
                                        <option value="price-asc">Price: Low → High</option>
                                        <option value="price-desc">Price: High → Low</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* ── Grid ── */}
            <div className={cn("transition-opacity duration-150", content.status !== "idle" && "mt-6", isFading ? "opacity-0" : "opacity-100")}>

                {content.status === "loading" && (
                    <div className={cn(GRID, "motion-safe:animate-pulse")} aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {content.status === "categories" && displayItems.length === 0 && (
                    <div className={EMPTY}>No categories found{searchQuery ? ` for "${searchQuery}"` : ""}</div>
                )}

                {content.status === "categories" && displayItems.length > 0 && (
                    <BalancedGrid>
                        {(visibleItems as CategoryWithPath[]).map((cat) => (
                            <CategoryCard key={cat.id} category={cat} onClick={() => handleSubCategoryClick(cat)} />
                        ))}
                    </BalancedGrid>
                )}

                {content.status === "products" && displayItems.length === 0 && (
                    <div className={EMPTY}>No products found{searchQuery ? ` for "${searchQuery}"` : ""}</div>
                )}

                {content.status === "products" && displayItems.length > 0 && (
                    <BalancedGrid>
                        {(visibleItems as ProductWithPath[]).map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </BalancedGrid>
                )}
            </div>

            {/* ── Load More ── */}
            {hasMore && !isFading && (
                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="hover:text-primary-700 focus-visible:outline-primary-500 min-h-11 rounded-full bg-white px-8 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-transform duration-100 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                    >
                        Load More · {remaining} remaining
                    </button>
                </div>
            )}
        </div>
    );
}
