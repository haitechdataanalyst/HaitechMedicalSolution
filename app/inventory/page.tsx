"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { inventoryApi, ZohoInventoryItem, InventoryPagination } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    Search, RefreshCw, Package, AlertCircle, CheckCircle2,
    XCircle, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import {
    CardSkeleton, EmptyState, LISTING_GRID, PAGE_SUBTITLE, PAGE_TITLE, PILL_SELECT, RESULT_COUNT, SEARCH_INPUT, chipClass,
} from "@/components/catalog/listing";
import { cloudinaryUrl } from "@/lib/cloudinary-loader";

const PER_PAGE = 24;

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ qty }: { qty: number }) {
    if (qty > 10) return (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> In Stock ({qty})
        </span>
    );
    if (qty > 0) return (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> Low Stock ({qty})
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-red-700">
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" /> Out of Stock
        </span>
    );
}

// ── Item card ─────────────────────────────────────────────────────────────────
function ItemCard({ item }: { item: ZohoInventoryItem }) {
    return (
        <Link href={`/inventory/${encodeURIComponent(item.id)}`} className={`${INTERACTIVE_CARD} p-2`}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                {item.image ? (
                    <img src={cloudinaryUrl(item.image, 512)} alt={item.name} className="h-full w-full object-contain p-6 mix-blend-multiply" />
                ) : (
                    <Package className="h-10 w-10 text-neutral-300" aria-hidden="true" />
                )}
                {item.status === "inactive" && (
                    <span className="absolute top-2 right-2 rounded-full bg-neutral-900/75 px-2.5 py-1 text-xs font-medium text-white">Inactive</span>
                )}
            </div>

            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                {item.category && <span className="mb-1 text-[13px] text-neutral-500">{item.category}</span>}
                <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.name}</h3>

                <div className="mt-auto flex flex-col gap-1 pt-3">
                    {item.rate > 0 ? (
                        <span className="text-base font-semibold text-neutral-900 tabular-nums">
                            {formatPrice(item.rate)}
                            {item.unit && <span className="ml-0.5 text-[13px] font-normal text-neutral-500">/{item.unit}</span>}
                        </span>
                    ) : (
                        <span className="text-[13px] text-neutral-500">Price on request</span>
                    )}
                    <StockBadge qty={item.availableForSale} />
                </div>
            </div>
        </Link>
    );
}

// ── Pagination bar ────────────────────────────────────────────────────────────
const PAGE_BUTTON =
    "focus-visible:outline-primary-500 flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

function Pagination({ pagination, onPage }: { pagination: InventoryPagination; onPage: (p: number) => void }) {
    const { page, totalPages, total, perPage } = pagination;
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    // Build visible page numbers with ellipsis
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
    }

    return (
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className={RESULT_COUNT}>
                Showing {from}–{to} of {total} items
            </p>
            <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className={cn(PAGE_BUTTON, "text-neutral-700 hover:bg-white")}
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                {pages.map((p, i) =>
                    p === "…" ? (
                        <span key={`e${i}`} className="flex h-11 w-6 items-center justify-center text-sm text-neutral-500" aria-hidden="true">…</span>
                    ) : (
                        <button
                            type="button"
                            key={p}
                            onClick={() => onPage(p as number)}
                            aria-current={p === page ? "page" : undefined}
                            className={cn(PAGE_BUTTON, p === page ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white")}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className={cn(PAGE_BUTTON, "text-neutral-700 hover:bg-white")}
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </nav>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function InventoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [items, setItems] = useState<ZohoInventoryItem[]>([]);
    const [pagination, setPagination] = useState<InventoryPagination | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [cachedAt, setCachedAt] = useState<string | null>(null);

    // Filters — initialise from URL
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [filterInStock, setFilterInStock] = useState(searchParams.get("inStock") === "true");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
    const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));

    const searchDebounce = useRef<NodeJS.Timeout | null>(null);

    const load = useCallback(async (opts: {
        page?: number; search?: string; category?: string; inStock?: boolean; refresh?: boolean;
    } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await inventoryApi.getItems({
                page: opts.page ?? page,
                perPage: PER_PAGE,
                search: opts.search ?? search,
                category: opts.category ?? selectedCategory,
                inStock: opts.inStock ?? filterInStock,
                refresh: opts.refresh,
            });
            if (res.success && res.data) {
                setItems(res.data.items);
                setPagination(res.data.pagination);
                setCategories(res.data.categories);
                setCachedAt(res.data.cachedAt);
            } else {
                setError(res.message || "Failed to load inventory");
            }
        } catch {
            setError("Could not reach the inventory service. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [page, search, selectedCategory, filterInStock]);

    // Initial load
    useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL with state
    const pushUrl = useCallback((updates: Record<string, string | number | boolean | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v === undefined || v === "" || v === false) params.delete(k);
            else params.set(k, String(v));
        });
        router.push(`/inventory?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
        if (searchDebounce.current) clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(() => {
            load({ page: 1, search: val });
            pushUrl({ search: val, page: 1 });
        }, 350);
    };

    const handleCategory = (val: string) => {
        setSelectedCategory(val);
        setPage(1);
        load({ page: 1, category: val });
        pushUrl({ category: val, page: 1 });
    };

    const handleInStock = (val: boolean) => {
        setFilterInStock(val);
        setPage(1);
        load({ page: 1, inStock: val });
        pushUrl({ inStock: val, page: 1 });
    };

    const handlePage = (p: number) => {
        setPage(p);
        load({ page: p });
        pushUrl({ page: p });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSync = async () => {
        setSyncing(true);
        await load({ refresh: true });
        setSyncing(false);
    };

    const clearFilters = () => {
        setSearch(""); setSelectedCategory(""); setFilterInStock(false); setPage(1);
        load({ page: 1, search: "", category: "", inStock: false });
        pushUrl({ page: 1 });
    };

    const hasFilters = search || selectedCategory || filterInStock;


    return (
        <div className="min-h-screen bg-neutral-50/50">

            {/* ── Header ── */}
            <header className="container pt-10 pb-8 md:pt-16 md:pb-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className={PAGE_TITLE}>Inventory</h1>
                        <p className={PAGE_SUBTITLE}>
                            Live from Zoho Inventory.
                            {cachedAt && !loading && <> Last synced {new Date(cachedAt).toLocaleString()}.</>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncing || loading}
                        className="focus-visible:outline-primary-500 inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-transform duration-200 ease-out hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 motion-safe:active:scale-[0.97] sm:self-auto"
                    >
                        <RefreshCw className={cn("h-4 w-4", (syncing || loading) && "motion-safe:animate-spin")} aria-hidden="true" />
                        {syncing ? "Syncing…" : "Sync from Zoho"}
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <div className="container pb-16 md:pb-24">
                {/* ── Toolbar ── */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-0 flex-1 basis-60">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Search by name or description"
                            aria-label="Search inventory"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={SEARCH_INPUT}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => handleSearch("")}
                                aria-label="Clear search"
                                className="focus-visible:outline-primary-500 absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800 focus-visible:outline-2"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    {categories.length > 0 && (
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategory(e.target.value)}
                            aria-label="Category"
                            className={cn(PILL_SELECT, "max-w-full cursor-pointer")}
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    )}

                    <button
                        type="button"
                        onClick={() => handleInStock(!filterInStock)}
                        aria-pressed={filterInStock}
                        className={cn(chipClass(filterInStock), "h-12")}
                    >
                        {filterInStock && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                        In Stock Only
                    </button>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="hover:text-primary-700 focus-visible:outline-primary-500 inline-flex h-12 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-neutral-600 focus-visible:outline-2"
                        >
                            <X className="h-4 w-4" aria-hidden="true" /> Clear
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 p-5 ring-1 ring-red-900/[0.08]">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                        <div>
                            <p className="text-[15px] font-semibold text-red-800">Failed to load inventory</p>
                            <p className="mt-0.5 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results count */}
                <p className={cn("mt-5 mb-4 min-h-5", RESULT_COUNT)} aria-live="polite">
                    {!loading && pagination && !error && (
                        pagination.total === 0
                            ? "No items found"
                            : `Showing ${(pagination.page - 1) * pagination.perPage + 1}–${Math.min(pagination.page * pagination.perPage, pagination.total)} of ${pagination.total} items`
                    )}
                </p>

                {/* Skeleton grid */}
                {loading && (
                    <div className={LISTING_GRID} aria-hidden="true">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="motion-safe:animate-pulse">
                                <CardSkeleton />
                            </div>
                        ))}
                    </div>
                )}

                {/* Items grid */}
                {!loading && items.length > 0 && (
                    <div className={LISTING_GRID}>
                        {items.map((item) => <ItemCard key={item.id} item={item} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && items.length === 0 && (
                    <EmptyState
                        title="No items found"
                        body={hasFilters ? "Try adjusting your filters." : "No inventory items are available yet."}
                    >
                        {hasFilters && (
                            <button type="button" onClick={clearFilters} className={chipClass(false)}>
                                Clear Filters
                            </button>
                        )}
                    </EmptyState>
                )}

                {/* Pagination */}
                {!loading && pagination && pagination.totalPages > 1 && (
                    <Pagination pagination={pagination} onPage={handlePage} />
                )}
            </div>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-50/50" />}>
            <InventoryContent />
        </Suspense>
    );
}
