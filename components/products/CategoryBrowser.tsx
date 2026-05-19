"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ArrowUpDown, Search, X } from "lucide-react";
import { Category, Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

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
const PLACEHOLDER = "/images/placeholder.jpg";

const BRAND_CATEGORY: Record<string, string> = {
    Admetec: "Loupes · Optics",
    Almadent: "Dental Chairs",
    Medesy: "Instruments",
    Salli: "Ergonomic Seating",
    Strauss: "Burs · Rotary",
};

function SkeletonCard() {
    return (
        <div className="animate-pulse overflow-hidden rounded-xl border border-neutral-100 bg-white">
            <div className="aspect-square bg-neutral-100" />
            <div className="space-y-2 p-3.5">
                <div className="h-4 w-3/4 rounded bg-neutral-100" />
                <div className="h-3 w-1/2 rounded bg-neutral-100" />
                <div className="mt-3 h-7 w-24 rounded-full bg-neutral-100" />
            </div>
        </div>
    );
}

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

function CategoryCard({ category, onClick }: { category: CategoryWithPath; onClick: () => void }) {
    const image = category.image || PLACEHOLDER;
    const cardClass = "group flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_8px_28px_rgba(31,182,205,0.12)] active:translate-y-0";

    return (
        <>
            {/* Desktop / tablet grid card */}
            <button onClick={onClick} className={cn(cardClass, "hidden w-full text-left sm:flex sm:flex-col")}>
                <div className="relative aspect-square overflow-hidden bg-white">
                    <SafeImage
                        src={image}
                        alt={category.name}
                        fill
                        className="mix-blend-multiply object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 33vw, 220px"
                    />
                </div>
                <div className="flex flex-1 flex-col border-t border-neutral-50 px-3.5 py-3.5">
                    <h3 className="mb-3 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-neutral-800">
                        {category.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-all duration-150 group-hover:bg-primary-500 group-hover:text-white">
                        View Range
                        <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                </div>
            </button>

            {/* Mobile list row */}
            <button
                onClick={onClick}
                className="group flex w-full items-center gap-3 border-b border-neutral-100 bg-white px-1 py-3 text-left transition-colors last:border-b-0 active:bg-neutral-50 sm:hidden"
            >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white">
                    <SafeImage
                        src={image}
                        alt={category.name}
                        fill
                        className="mix-blend-multiply object-contain p-2"
                        sizes="64px"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-neutral-800">{category.name}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </button>
        </>
    );
}

function ProductCard({ product }: { product: ProductWithPath }) {
    const image =
        product.defaultImage ||
        product.variants?.[0]?.image ||
        (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") ||
        PLACEHOLDER;
    const path = product.path || `/product/${product.slug}`;

    return (
        <>
            {/* Desktop / tablet grid card */}
            <Link
                href={path}
                className="group hidden flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_8px_28px_rgba(31,182,205,0.12)] active:translate-y-0 sm:flex"
            >
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                    <SafeImage
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 33vw, 220px"
                    />
                </div>
                <div className="flex flex-1 flex-col border-t border-neutral-50 px-3.5 py-3.5">
                    <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-neutral-800">
                        {product.name}
                    </h3>
                    {product.basePrice ? (
                        <span className="mb-2 text-base font-bold text-neutral-900">
                            {formatPrice(product.basePrice, product.currency ?? "INR")}
                        </span>
                    ) : (
                        <span className="mb-2 text-xs text-neutral-400">Price on request</span>
                    )}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-medium text-emerald-600">Free Delivery</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 transition-all duration-150 group-hover:bg-primary-500 group-hover:text-white">
                            View
                            <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                    </div>
                </div>
            </Link>

            {/* Mobile list row */}
            <Link
                href={path}
                className="group flex items-center gap-3 border-b border-neutral-100 bg-white px-1 py-3 transition-colors last:border-b-0 active:bg-neutral-50 sm:hidden"
            >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                    <SafeImage
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-800">{product.name}</p>
                    {product.basePrice ? (
                        <p className="mt-0.5 text-sm font-bold text-neutral-900">
                            {formatPrice(product.basePrice, product.currency ?? "INR")}
                        </p>
                    ) : (
                        <p className="mt-0.5 text-xs text-neutral-400">Price on request</p>
                    )}
                    <p className="mt-0.5 text-[11px] font-medium text-emerald-600">Free Delivery</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </Link>
        </>
    );
}

export default function CategoryBrowser({ initialCategories, fetchCategoryContents }: CategoryBrowserProps) {
    const router = useRouter();
    const cache = useRef<Map<number, { type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[] }>>(new Map());
    const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialized = useRef(false);

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

    useEffect(() => {
        if (!isInitialized.current && initialCategories.length > 0) {
            isInitialized.current = true;
            const first = initialCategories[0];
            setNavStack([{ id: first.id, name: first.name, path: first.path }]);
            loadNode(first.id, first.path);
        }
    }, [initialCategories, loadNode]);

    const handleBrandTabClick = (cat: CategoryWithPath) => {
        if (navStack.length === 1 && navStack[0]?.id === cat.id) return;
        setSortBy("default");
        setSearchQuery("");
        setNavStack([{ id: cat.id, name: cat.name, path: cat.path }]);
        loadNode(cat.id, cat.path);
    };

    const handleSubCategoryClick = (cat: CategoryWithPath) => {
        setSortBy("default");
        setSearchQuery("");
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
        const newStack = navStack.slice(0, -1);
        setNavStack(newStack);
        const parent = newStack[newStack.length - 1];
        loadNode(parent.id, parent.path);
    };

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
    const showControls = content.status === "categories" || content.status === "products" || content.status === "loading";

    return (
        <div className="flex flex-col">

            {/* ── Brand Identity Tabs — desktop ── */}
            <div className="mb-6 hidden gap-3 overflow-x-auto pb-2 scrollbar-none sm:flex">
                {initialCategories.map((cat) => {
                    const isActive = activeBrandId === cat.id;
                    const categoryLabel = BRAND_CATEGORY[cat.name];
                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleBrandTabClick(cat)}
                            className={cn(
                                "relative flex min-w-[110px] flex-1 shrink-0 flex-col items-center gap-2.5 overflow-hidden rounded-2xl border px-4 py-4 text-center transition-all duration-200",
                                isActive
                                    ? "border-primary-300 bg-primary-50 shadow-sm"
                                    : "border-neutral-100 bg-white hover:border-primary-200 hover:bg-neutral-50"
                            )}
                        >
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-primary-500" />
                            )}
                            {cat.image && (
                                <div className="relative h-10 w-16 shrink-0">
                                    <Image src={cat.image} alt={cat.name} fill className="object-contain" sizes="64px" />
                                </div>
                            )}
                            <div className="space-y-0.5">
                                <p className={cn("text-sm font-bold leading-tight", isActive ? "text-primary-700" : "text-neutral-800")}>
                                    {cat.name}
                                </p>
                                {categoryLabel && (
                                    <p className={cn("text-[11px] leading-tight", isActive ? "text-primary-500" : "text-neutral-400")}>
                                        {categoryLabel}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── Brand Pill Tabs — mobile ── */}
            <div className="mb-4 flex flex-wrap justify-center gap-2 sm:hidden">
                {initialCategories.map((cat) => {
                    const isActive = activeBrandId === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => handleBrandTabClick(cat)}
                            className={cn(
                                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-150",
                                isActive
                                    ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                                    : "border-neutral-200 bg-white text-neutral-600 active:bg-neutral-50"
                            )}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* ── Control Bar ── */}
            {showControls && (
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    {/* Back button */}
                    {isDrilledDown && (
                        <button
                            onClick={handleBack}
                            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-600"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {parentName}
                        </button>
                    )}

                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${contentLabel || "products"}...`}
                            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-9 text-sm transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Count + Sort */}
                    <div className="flex shrink-0 items-center gap-3">
                        {content.status !== "loading" && (
                            <span className="text-sm text-neutral-500">
                                <span className="font-bold text-neutral-800">{displayItems.length}</span>{" "}
                                {contentLabel}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5">
                            <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value as SortOption); setVisibleCount(PAGE_SIZE); }}
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            >
                                <option value="default">Featured</option>
                                <option value="name-asc">Name: A–Z</option>
                                {content.status === "products" && (
                                    <>
                                        <option value="price-asc">Price: Low → High</option>
                                        <option value="price-desc">Price: High → Low</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Grid ── */}
            <div className={`transition-opacity duration-150 ${isFading ? "opacity-0" : "opacity-100"}`}>
                {content.status === "idle" && (
                    <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-sm text-neutral-400">
                        Select a brand to browse products
                    </div>
                )}

                {content.status === "loading" && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="hidden sm:block"><SkeletonCard /></div>
                        ))}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={`m${i}`} className="flex animate-pulse items-center gap-3 border-b border-neutral-100 py-3 sm:hidden">
                                <div className="h-16 w-16 shrink-0 rounded-xl bg-neutral-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-3/4 rounded bg-neutral-100" />
                                    <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {content.status === "categories" && displayItems.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-sm text-neutral-400">
                        No categories found{searchQuery ? ` for "${searchQuery}"` : ""}
                    </div>
                )}

                {content.status === "categories" && displayItems.length > 0 && (
                    <div className="rounded-xl border border-neutral-100 bg-white sm:rounded-none sm:border-0 sm:bg-transparent sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {(visibleItems as CategoryWithPath[]).map((cat) => (
                            <CategoryCard key={cat.id} category={cat} onClick={() => handleSubCategoryClick(cat)} />
                        ))}
                    </div>
                )}

                {content.status === "products" && displayItems.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-sm text-neutral-400">
                        No products found{searchQuery ? ` for "${searchQuery}"` : ""}
                    </div>
                )}

                {content.status === "products" && displayItems.length > 0 && (
                    <div className="rounded-xl border border-neutral-100 bg-white sm:rounded-none sm:border-0 sm:bg-transparent sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {(visibleItems as ProductWithPath[]).map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Load More ── */}
            {hasMore && !isFading && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="rounded-full border border-neutral-200 bg-white px-8 py-2.5 text-sm font-semibold text-neutral-700 transition-all duration-150 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
                    >
                        Load More · {remaining} remaining
                    </button>
                </div>
            )}
        </div>
    );
}
