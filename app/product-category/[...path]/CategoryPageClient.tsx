"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryWithPath, ProductWithPath } from "@/components/products";
import { formatPrice, cn } from "@/lib/utils";
import { ArrowRight, Search, X, Heart } from "lucide-react";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { COMMERCE_ENABLED } from "@/lib/config";

interface CategoryPageClientProps {
    initialItems: CategoryWithPath[] | ProductWithPath[];
    initialType: "categories" | "products";
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const PAGE_SIZE = 16;
const PLACEHOLDER = "/images/placeholder.jpg";

function SafeImage({ src, alt, ...props }: React.ComponentProps<typeof Image>) {
    const [imgSrc, setImgSrc] = useState((src as string) || PLACEHOLDER);
    return <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(PLACEHOLDER)} />;
}

function CategoryCard({ category }: { category: CategoryWithPath }) {
    const href = category.path || category.specialPage || `/product-category/${category.slug}`;
    const image = category.image || PLACEHOLDER;
    return (
        <Link
            href={href}
            className="group flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-200 hover:border-neutral-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
            <div className="relative aspect-square overflow-hidden bg-white">
                <SafeImage
                    src={image}
                    alt={category.name}
                    fill
                    className="mix-blend-multiply object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 220px"
                />
            </div>
            <div className="flex flex-1 flex-col border-t border-neutral-50 px-3.5 py-3.5">
                <h3 className="mb-3 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-neutral-800">
                    {category.name}
                </h3>
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-all duration-150 group-hover:bg-primary-500 group-hover:text-white">
                    View Range
                    <ArrowRight className="h-3 w-3" />
                </span>
            </div>
        </Link>
    );
}

function ProductCard({ product }: { product: ProductWithPath }) {
    const { toggle, isWished } = useWishlist();
    const wished = isWished(String(product.id));
    const image =
        product.defaultImage ||
        product.variants?.[0]?.image ||
        (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") ||
        PLACEHOLDER;
    const path = product.path || `/product/${product.slug}`;
    return (
        <Link
            href={path}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-200 hover:border-neutral-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
            <div className="relative aspect-square overflow-hidden bg-white">
                <SafeImage
                    src={image}
                    alt={product.name}
                    fill
                    className="mix-blend-multiply object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 220px"
                />
                {/* Wishlist heart */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(String(product.id)); }}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                    className={cn(
                        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-150",
                        wished
                            ? "border-rose-200 bg-rose-50 text-rose-500"
                            : "border-neutral-200 bg-white/90 text-neutral-300 opacity-0 group-hover:opacity-100 hover:border-rose-200 hover:text-rose-400"
                    )}
                >
                    <Heart className={cn("h-3.5 w-3.5 transition-all", wished && "fill-current text-rose-500")} />
                </button>
            </div>
            <div className="flex flex-1 flex-col border-t border-neutral-50 px-3.5 py-3.5">
                <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-neutral-800">
                    {product.name}
                </h3>
                {COMMERCE_ENABLED && (product.basePrice ? (
                    <p className="mb-2 text-base font-bold text-neutral-900">
                        {formatPrice(product.basePrice, product.currency ?? "INR")}
                    </p>
                ) : (
                    <p className="mb-2 text-xs text-neutral-400">Price on request</p>
                ))}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-emerald-600">Free Delivery</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 transition-all duration-150 group-hover:bg-primary-500 group-hover:text-white">
                        View
                        <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function RadioOption({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="group flex cursor-pointer items-center gap-2.5">
            <div
                className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors",
                    checked ? "border-primary-500 bg-primary-500" : "border-neutral-300 group-hover:border-primary-400"
                )}
            >
                {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
            </div>
            <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
            <span className={cn("text-sm", checked ? "font-semibold text-primary-700" : "text-neutral-600 group-hover:text-neutral-800")}>
                {label}
            </span>
        </label>
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

    const visibleItems = displayItems.slice(0, visibleCount);
    const hasMore = visibleCount < displayItems.length;
    const remaining = displayItems.length - visibleCount;
    const contentLabel = initialType === "categories" ? "categories" : "products";

    const resetCount = () => setVisibleCount(PAGE_SIZE);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: "default", label: "Featured" },
        { value: "name-asc", label: "Name: A–Z" },
        ...(COMMERCE_ENABLED && initialType === "products"
            ? [
                  { value: "price-asc" as SortOption, label: "Price: Low → High" },
                  { value: "price-desc" as SortOption, label: "Price: High → Low" },
              ]
            : []),
    ];

    if (initialType === "products" && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
                    <svg className="h-10 w-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-800">Products Coming Soon</h3>
                <p className="mb-6 max-w-sm text-sm text-neutral-500">
                    We&apos;re updating our catalogue for this category. Contact us for availability.
                </p>
                <a
                    href="/support/contact"
                    className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    Contact Us
                </a>
            </div>
        );
    }

    return (
        <div className="flex gap-6 lg:gap-8">
            {/* ── Sidebar ── */}
            <aside className="hidden w-52 shrink-0 lg:block">
                <div className="sticky top-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white">
                    {/* Sort */}
                    <div className="border-b border-neutral-100 p-5">
                        <p className="mb-3.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                            Sort by
                        </p>
                        <div className="space-y-2.5">
                            {sortOptions.map((opt) => (
                                <RadioOption
                                    key={opt.value}
                                    label={opt.label}
                                    checked={sortBy === opt.value}
                                    onChange={() => { setSortBy(opt.value); resetCount(); }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Price filter */}
                    {COMMERCE_ENABLED && hasPriceRange && (
                        <div className="p-5">
                            <p className="mb-3.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                Price
                            </p>
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
                                className="w-full accent-primary-600"
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-neutral-400">{formatPrice(priceMin, "INR")}</span>
                                <span className="text-xs font-semibold text-primary-700">
                                    ≤ {formatPrice(maxPrice ?? priceMax, "INR")}
                                </span>
                            </div>
                            {maxPrice !== null && (
                                <button
                                    onClick={() => { setMaxPrice(null); resetCount(); }}
                                    className="mt-2 text-[11px] text-neutral-400 transition-colors hover:text-primary-600"
                                >
                                    Clear ×
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="min-w-0 flex-1">
                {/* Results bar */}
                <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); resetCount(); }}
                            placeholder={`Search ${contentLabel}...`}
                            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-9 text-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(""); resetCount(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <span className="shrink-0 text-sm text-neutral-500">
                        <span className="font-bold text-neutral-800">{displayItems.length}</span> {contentLabel}
                    </span>

                    {/* Mobile sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value as SortOption); resetCount(); }}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 focus:border-primary-300 focus:outline-none lg:hidden"
                    >
                        {sortOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Empty state */}
                {displayItems.length === 0 && (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-sm text-neutral-400">
                        No {contentLabel} found{searchQuery ? ` for "${searchQuery}"` : ""}
                    </div>
                )}

                {/* Grid */}
                {displayItems.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                        {initialType === "categories"
                            ? (visibleItems as CategoryWithPath[]).map((cat) => (
                                  <CategoryCard key={cat.id} category={cat} />
                              ))
                            : (visibleItems as ProductWithPath[]).map((prod) => (
                                  <ProductCard key={prod.id} product={prod} />
                              ))}
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                            className="rounded-full border border-neutral-200 bg-white px-8 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
                        >
                            Load More · {remaining} remaining
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
