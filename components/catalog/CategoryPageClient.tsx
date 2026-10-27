"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryWithPath, ProductWithPath } from "@/components/products";
import { formatPrice, cn } from "@/lib/utils";
import { ArrowRight, Search, X, Heart } from "lucide-react";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { shouldShowPrice } from "@/lib/config";
import { detectBrand } from "@/lib/brand";
import { isCatalogueProductId } from "@/lib/headlight-products";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import BalancedGrid from "./BalancedGrid";

interface CategoryPageClientProps {
    initialItems: CategoryWithPath[] | ProductWithPath[];
    initialType: "categories" | "products";
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const PAGE_SIZE = 16;
const PLACEHOLDER = "/images/site/placeholder.svg";

function SafeImage({ src, alt, ...props }: React.ComponentProps<typeof Image>) {
    const [imgSrc, setImgSrc] = useState((src as string) || PLACEHOLDER);
    return <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(PLACEHOLDER)} />;
}

// Card material + hover/press motion are shared with the home page (components/ui/surfaces).
const CARD_CLASS = `${INTERACTIVE_CARD} p-2`;
const CARD_MEDIA = "relative aspect-square overflow-hidden rounded-xl bg-neutral-50";
const CARD_IMAGE = "mix-blend-multiply object-contain p-6 transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]";
const CARD_SIZES = "(max-width: 1024px) 50vw, 360px";

function CardLink({ label }: { label: string }) {
    return (
        <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium">
            {label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
    );
}

function CategoryCard({ category }: { category: CategoryWithPath }) {
    const href = category.path || category.specialPage || `/product-category/${category.slug}`;
    const image = category.image || PLACEHOLDER;
    return (
        <Link href={href} className={CARD_CLASS}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className={CARD_MEDIA}>
                <SafeImage src={image} alt={category.name} fill className={CARD_IMAGE} sizes={CARD_SIZES} />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                <h2 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{category.name}</h2>
                <CardLink label="View range" />
            </div>
        </Link>
    );
}

function ProductCard({ product }: { product: ProductWithPath }) {
    const { toggle, isWished } = useWishlist();
    const wished = isWished(String(product.id));
    const brand = detectBrand(product.sku);
    const image = product.defaultImage || product.variants?.[0]?.image || (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") || PLACEHOLDER;
    const path = product.path || `/product/${product.slug}`;
    return (
        <Link href={path} className={CARD_CLASS}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className={CARD_MEDIA}>
                <SafeImage src={image} alt={product.name} fill className={CARD_IMAGE} sizes={CARD_SIZES} />
            </div>
            {/* 44px hit area around a 32px visual. Always visible on touch; revealed on hover only where hover exists. */}
            {isCatalogueProductId(product.id) && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(String(product.id));
                    }}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-pressed={wished}
                    className={cn(
                        "focus-visible:outline-primary-500 absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full transition-opacity duration-200 ease-out focus-visible:opacity-100 focus-visible:outline-2",
                        !wished && "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                    )}
                >
                    <span
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full shadow-[0_1px_3px_rgba(15,23,42,0.12)]",
                            wished ? "bg-rose-50 text-rose-500" : "bg-white/90 text-neutral-400 hover:text-rose-500"
                        )}
                    >
                        <Heart className={cn("h-4 w-4", wished && "fill-current")} />
                    </span>
                </button>
            )}
            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                <h2 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{product.name}</h2>
                {/* Fixed height (2 lines at leading-relaxed) so cards stay aligned in a row regardless of copy length */}
                <p className="mt-1 line-clamp-2 h-[3.25em] text-[13px] leading-relaxed text-neutral-500">{product.description}</p>
                {shouldShowPrice(brand.name) &&
                    (product.basePrice ? (
                        <p className="mt-2 text-base font-semibold text-neutral-900 tabular-nums">{formatPrice(product.basePrice, product.currency ?? "INR")}</p>
                    ) : (
                        <p className="mt-2 text-[13px] text-neutral-500">Price on request</p>
                    ))}
                <div className="mt-auto flex items-end justify-between">
                    <CardLink label="View" />
                    <span className="pb-px text-xs font-medium text-emerald-700">Free Delivery</span>
                </div>
            </div>
        </Link>
    );
}

// Two choices get an inline segmented control next to the search it affects; longer lists fall back to a select.
const SEGMENTED_MAX_OPTIONS = 2;

function SortControl({ options, value, onChange }: { options: { value: SortOption; label: string }[]; value: SortOption; onChange: (value: SortOption) => void }) {
    if (options.length > SEGMENTED_MAX_OPTIONS) {
        return (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                aria-label="Sort by"
                className="focus-visible:ring-primary-500 h-12 rounded-full bg-white px-4 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] focus:outline-none focus-visible:ring-2"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        );
    }
    return (
        <div role="radiogroup" aria-label="Sort by" className="flex h-12 shrink-0 rounded-full bg-neutral-900/[0.05] p-0.5">
            {options.map((o) => {
                const isActive = value === o.value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(o.value)}
                        className={cn(
                            "focus-visible:outline-primary-500 rounded-full px-4 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-2",
                            isActive ? "bg-white text-neutral-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)]" : "text-neutral-500 hover:text-neutral-800"
                        )}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

export function CategoryPageClient({ initialItems, initialType }: CategoryPageClientProps) {
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [searchQuery, setSearchQuery] = useState("");
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const products = initialType === "products" ? (initialItems as ProductWithPath[]) : [];
    const categories = initialType === "categories" ? (initialItems as CategoryWithPath[]) : [];

    const allPrices = products.filter((p) => p.basePrice).map((p) => p.basePrice!);
    const priceMin = allPrices.length > 0 ? Math.min(...allPrices) : 0;
    const priceMax = allPrices.length > 0 ? Math.max(...allPrices) : 0;
    const hasPriceRange = priceMax > priceMin && allPrices.length > 1;
    const pageShowsPrice = products.some((p) => shouldShowPrice(detectBrand(p.sku).name));

    const displayItems = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (initialType === "categories") {
            let items = [...categories];
            if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
            if (sortBy === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
            return items;
        }
        let items = [...products];
        if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
        if (maxPrice !== null) items = items.filter((p) => !p.basePrice || p.basePrice <= maxPrice);
        if (sortBy === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "price-asc") items.sort((a, b) => (a.basePrice ?? Infinity) - (b.basePrice ?? Infinity));
        if (sortBy === "price-desc") items.sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
        return items;
    }, [initialType, categories, products, sortBy, searchQuery, maxPrice]);

    const hasMore = visibleCount < displayItems.length;
    const remaining = displayItems.length - visibleCount;
    const contentLabel = initialType === "categories" ? "categories" : "products";

    const resetCount = () => setVisibleCount(PAGE_SIZE);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: "default", label: "Featured" },
        { value: "name-asc", label: "Name: A–Z" },
        ...(pageShowsPrice && initialType === "products"
            ? [
                  { value: "price-asc" as SortOption, label: "Price: Low → High" },
                  { value: "price-desc" as SortOption, label: "Price: High → Low" },
              ]
            : []),
    ];

    if (initialType === "products" && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary-50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <svg className="text-primary-400 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                </div>
                <h2 className="mb-2 text-lg font-semibold text-neutral-800">Products Coming Soon</h2>
                <p className="mb-6 max-w-sm text-sm text-neutral-500">We&apos;re updating our catalogue for this category. Contact us for availability.</p>
                <Link href="/support/contact" className="bg-primary-600 hover:bg-primary-700 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors">
                    Contact Us
                </Link>
            </div>
        );
    }

    return (
        <div className="flex gap-6 lg:gap-8">
            {/* ── Sidebar: only earns its space when there is a price range to filter ── */}
            {hasPriceRange && (
                <aside className="hidden w-56 shrink-0 lg:block">
                    <div className="sticky top-4 rounded-2xl bg-white ring-1 ring-neutral-900/[0.05]">
                        <div className="p-5">
                            <p className="mb-3 text-xs font-semibold text-neutral-500">Price</p>
                            <input
                                type="range"
                                min={priceMin}
                                max={priceMax}
                                step={Math.max(1, Math.round((priceMax - priceMin) / 20))}
                                value={maxPrice ?? priceMax}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setMaxPrice(v === priceMax ? null : v);
                                    resetCount();
                                }}
                                className="accent-primary-600 w-full"
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-neutral-500 tabular-nums">{formatPrice(priceMin, "INR")}</span>
                                <span className="text-primary-700 text-xs font-semibold tabular-nums">≤ {formatPrice(maxPrice ?? priceMax, "INR")}</span>
                            </div>
                            {maxPrice !== null && (
                                <button
                                    onClick={() => {
                                        setMaxPrice(null);
                                        resetCount();
                                    }}
                                    className="hover:text-primary-700 mt-1 -ml-2 min-h-11 rounded-full px-2 text-xs font-medium text-neutral-500 transition-colors"
                                >
                                    Clear price filter
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            )}

            {/* ── Main content ── */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-0 flex-1 basis-60">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                resetCount();
                            }}
                            placeholder={`Search ${contentLabel}`}
                            aria-label={`Search ${contentLabel}`}
                            className="focus-visible:ring-primary-500 h-12 w-full rounded-full bg-white pr-12 pl-11 text-[15px] text-neutral-900 ring-1 ring-neutral-900/[0.08] transition-shadow placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 [&::-webkit-search-cancel-button]:hidden"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    resetCount();
                                }}
                                aria-label="Clear search"
                                className="focus-visible:outline-primary-500 absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 focus-visible:outline-2"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <SortControl
                        options={sortOptions}
                        value={sortBy}
                        onChange={(v) => {
                            setSortBy(v);
                            resetCount();
                        }}
                    />
                </div>

                <p className="mt-5 mb-4 text-[13px] text-neutral-500 tabular-nums" aria-live="polite">
                    {displayItems.length} {contentLabel}
                </p>

                {displayItems.length === 0 && (
                    <div className="flex h-40 items-center justify-center rounded-2xl bg-white text-sm text-neutral-500 ring-1 ring-neutral-900/[0.05]">
                        No {contentLabel} found{searchQuery ? ` for "${searchQuery}"` : ""}
                    </div>
                )}

                {/* Every card is in the HTML so each product link is crawlable; "Load More" only reveals the rest. */}
                {displayItems.length > 0 && (
                    <BalancedGrid layout={hasPriceRange ? "dense" : "wide"} visibleCount={visibleCount}>
                        {displayItems.map((item) =>
                            initialType === "categories" ? <CategoryCard key={item.id} category={item as CategoryWithPath} /> : <ProductCard key={item.id} product={item as ProductWithPath} />
                        )}
                    </BalancedGrid>
                )}

                {hasMore && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            className="hover:text-primary-700 focus-visible:outline-primary-500 min-h-11 rounded-full bg-white px-8 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-transform duration-100 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                        >
                            Load More · {remaining} remaining
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
