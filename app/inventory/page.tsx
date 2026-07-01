"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { inventoryApi, ZohoInventoryItem, InventoryPagination } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    Search, RefreshCw, Package, AlertCircle, CheckCircle2,
    XCircle, Filter, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 24;

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({ qty }: { qty: number }) {
    if (qty > 10) return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> In Stock ({qty})
        </span>
    );
    if (qty > 0) return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            <AlertCircle className="h-3 w-3" /> Low Stock ({qty})
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
            <XCircle className="h-3 w-3" /> Out of Stock
        </span>
    );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <div className="h-40 animate-pulse bg-neutral-100" />
            <div className="flex flex-col gap-2.5 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="mt-2 h-5 w-28 animate-pulse rounded-full bg-neutral-100" />
                <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
            </div>
        </div>
    );
}

// ── Item card ─────────────────────────────────────────────────────────────────
function ItemCard({ item }: { item: ZohoInventoryItem }) {
    return (
        <Link
            href={`/inventory/${encodeURIComponent(item.id)}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md"
        >
            <div className="relative flex h-40 items-center justify-center bg-neutral-50 transition-colors group-hover:bg-neutral-100">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-4" />
                ) : (
                    <Package className="h-10 w-10 text-neutral-200" />
                )}
                {item.status === "inactive" && (
                    <span className="absolute right-2 top-2 rounded-full bg-neutral-800/70 px-2 py-0.5 text-[10px] font-medium text-white">Inactive</span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-4">
                {item.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">{item.category}</span>
                )}
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 group-hover:text-primary-700 transition-colors">
                    {item.name}
                </h3>
                {item.sku && <p className="text-[11px] text-neutral-400">SKU: {item.sku}</p>}

                <div className="mt-auto flex flex-col gap-1.5 pt-2">
                    <StockBadge qty={item.availableForSale} />
                    <div className="flex items-end justify-between">
                        {item.rate > 0 ? (
                            <span className="text-base font-bold text-neutral-900">
                                {formatPrice(item.rate)}
                                {item.unit && <span className="ml-0.5 text-xs font-normal text-neutral-400">/{item.unit}</span>}
                            </span>
                        ) : (
                            <span className="text-sm text-neutral-400">Price on request</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Pagination bar ────────────────────────────────────────────────────────────
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
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-neutral-500">
                Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> items
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pages.map((p, i) =>
                    p === "…" ? (
                        <span key={`e${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-neutral-400">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={cn(
                                "flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-2 text-sm font-semibold transition-colors",
                                p === page
                                    ? "border-primary-500 bg-primary-500 text-white"
                                    : "border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600"
                            )}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
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
        <div className="min-h-screen bg-neutral-50">

            {/* ── Header ── */}
            <div className="border-b border-neutral-100 bg-white">
                <div className="container py-7">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-primary-500">Live · Zoho Inventory</p>
                            <h1 className="mt-0.5 text-2xl font-bold text-neutral-900">Inventory</h1>
                            {cachedAt && !loading && (
                                <p className="mt-0.5 text-xs text-neutral-400">
                                    Last synced: {new Date(cachedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleSync}
                            disabled={syncing || loading}
                            className="flex items-center gap-2 self-start rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-600 disabled:opacity-50 sm:self-auto"
                        >
                            <RefreshCw className={cn("h-4 w-4", (syncing || loading) && "animate-spin")} />
                            {syncing ? "Syncing…" : "Sync from Zoho"}
                        </button>
                    </div>

                    {/* ── Filter bar ── */}
                    <div className="mt-5 flex flex-wrap gap-3">
                        {/* Search */}
                        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 focus-within:border-primary-400 focus-within:bg-white transition-colors">
                            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by name, SKU, description…"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none"
                            />
                            {search && (
                                <button onClick={() => handleSearch("")} className="text-neutral-400 hover:text-neutral-700">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Category */}
                        {categories.length > 0 && (
                            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5">
                                <Filter className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategory(e.target.value)}
                                    className="bg-transparent text-sm text-neutral-700 outline-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        {/* In Stock toggle */}
                        <button
                            onClick={() => handleInStock(!filterInStock)}
                            className={cn(
                                "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                                filterInStock
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-emerald-200 hover:text-emerald-700"
                            )}
                        >
                            {filterInStock ? <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> In Stock Only</span> : "In Stock Only"}
                        </button>

                        {/* Clear */}
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2.5 text-sm text-neutral-500 hover:border-red-200 hover:text-red-500 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container py-8">
                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        <div>
                            <p className="text-sm font-semibold text-red-700">Failed to load inventory</p>
                            <p className="mt-0.5 text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results count */}
                {!loading && pagination && !error && (
                    <p className="mb-4 text-sm text-neutral-500">
                        {pagination.total === 0
                            ? "No items found"
                            : <>Showing <strong>{(pagination.page - 1) * pagination.perPage + 1}–{Math.min(pagination.page * pagination.perPage, pagination.total)}</strong> of <strong>{pagination.total}</strong> items</>}
                    </p>
                )}

                {/* Skeleton grid */}
                {loading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: PER_PAGE }).map((_, i) => (
                            <div key={i} style={{ animationDelay: `${i * 30}ms` }}>
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                )}

                {/* Items grid */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {items.map((item) => <ItemCard key={item.id} item={item} />)}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && items.length === 0 && (
                    <div className="flex flex-col items-center py-24 text-center">
                        <Package className="mb-4 h-16 w-16 text-neutral-200" />
                        <h3 className="text-base font-semibold text-neutral-700">No items found</h3>
                        <p className="mt-1 text-sm text-neutral-400">
                            {hasFilters ? "Try adjusting your filters." : "No inventory items are available yet."}
                        </p>
                        {hasFilters && (
                            <button onClick={clearFilters} className="mt-4 rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
                                Clear Filters
                            </button>
                        )}
                    </div>
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
        <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
            <InventoryContent />
        </Suspense>
    );
}
