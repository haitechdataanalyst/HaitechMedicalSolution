"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { PILL_SELECT, RESULT_COUNT, SEARCH_INPUT } from "@/components/catalog/listing";

type Facet = { label: string; count: number };

interface FilterSidebarProps {
    brands: Facet[];
    categories: Facet[];
    itemTypes: Facet[];
    total: number;
    filtered: number;
}

const GROUP_TITLE = "text-[15px] font-semibold tracking-[-0.01em] text-neutral-900";

function useFilterParam(key: string): [string[], (val: string) => void, () => void] {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const current = params.getAll(key);

    const toggle = useCallback(
        (val: string) => {
            const next = new URLSearchParams(params.toString());
            next.delete("page");
            const existing = next.getAll(key);
            if (existing.includes(val)) {
                next.delete(key);
                existing.filter((v) => v !== val).forEach((v) => next.append(key, v));
            } else {
                next.append(key, val);
            }
            router.push(`${pathname}?${next.toString()}`);
        },
        [router, pathname, params, key]
    );

    const clear = useCallback(() => {
        const next = new URLSearchParams(params.toString());
        next.delete(key);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    }, [router, pathname, params, key]);

    return [current, toggle, clear];
}

function FilterSection({ title, facets, paramKey }: { title: string; facets: Facet[]; paramKey: string }) {
    const [selected, toggle] = useFilterParam(paramKey);
    const [open, setOpen] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? facets : facets.slice(0, 8);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={cn(GROUP_TITLE, "focus-visible:outline-primary-500 flex min-h-11 w-full items-center justify-between rounded-lg focus-visible:outline-2")}
            >
                {title}
                <ChevronDown className={cn("h-4 w-4 text-neutral-500 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
            </button>

            {open && (
                <div className="mt-1">
                    {visible.map(({ label, count }) => (
                        <label
                            key={label}
                            className="-mx-2 flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm transition-colors duration-200 ease-out hover:bg-neutral-900/[0.03]"
                        >
                            <input type="checkbox" checked={selected.includes(label)} onChange={() => toggle(label)} className="accent-primary-700 h-4 w-4 shrink-0 rounded" />
                            <span className="flex-1 truncate text-neutral-700">{label}</span>
                            <span className="text-[13px] text-neutral-500 tabular-nums">{count}</span>
                        </label>
                    ))}
                    {facets.length > 8 && (
                        <button
                            type="button"
                            onClick={() => setShowAll((s) => !s)}
                            className="text-primary-700 focus-visible:outline-primary-500 -ml-2 min-h-11 rounded-full px-2 text-sm font-medium hover:underline focus-visible:outline-2"
                        >
                            {showAll ? "Show less" : `Show ${facets.length - 8} more`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function InventoryFilters({ brands, categories, itemTypes, total, filtered }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [, , clearBrands] = useFilterParam("brand");
    const [, , clearCategories] = useFilterParam("category");
    const [, , clearTypes] = useFilterParam("type");

    const search = params.get("search") ?? "";
    const inStock = params.get("inStock") === "true";
    const sort = params.get("sort") ?? "name";
    const hasFilters =
        params
            .toString()
            .replace(/page=\d+/g, "")
            .replace(/sort=[^&]+/g, "")
            .replace(/&&/g, "")
            .replace(/^&|&$/, "").length > 0;

    function setParam(key: string, val: string | null) {
        const next = new URLSearchParams(params.toString());
        next.delete("page");
        if (val === null) next.delete(key);
        else next.set(key, val);
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearAll() {
        router.push(pathname);
    }

    const sidebar = (
        <div className="flex flex-col gap-5">
            {/* Result count + clear */}
            <div className="-my-2 flex min-h-11 items-center justify-between">
                <span className={RESULT_COUNT} aria-live="polite">
                    {filtered} of {total}
                </span>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="hover:text-primary-700 focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium text-neutral-600 focus-visible:outline-2"
                    >
                        <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear all
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
                <input
                    type="search"
                    aria-label="Search the catalog"
                    defaultValue={search}
                    placeholder="Name, SKU, category"
                    className={cn(SEARCH_INPUT, "pr-4")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setParam("search", (e.target as HTMLInputElement).value || null);
                    }}
                    onChange={(e) => {
                        if (!e.target.value) setParam("search", null);
                    }}
                />
            </div>

            {/* In-stock toggle */}
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                <input type="checkbox" checked={inStock} onChange={(e) => setParam("inStock", e.target.checked ? "true" : null)} className="accent-primary-700 h-4 w-4 rounded" />
                <span className="font-medium text-neutral-800">In stock only</span>
            </label>

            {/* Brand */}
            <FilterSection title="Brand" facets={brands} paramKey="brand" />

            {/* Category */}
            <FilterSection title="Category" facets={categories} paramKey="category" />

            {/* Item Type */}
            <FilterSection title="Item type" facets={itemTypes} paramKey="type" />

            {/* Sort */}
            <div>
                <label htmlFor="catalog-sort" className={cn(GROUP_TITLE, "mb-2 block")}>
                    Sort by
                </label>
                <select id="catalog-sort" value={sort} onChange={(e) => setParam("sort", e.target.value)} className={cn(PILL_SELECT, "w-full")}>
                    <option value="name">Name (A–Z)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock">Most in Stock</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-expanded={mobileOpen}
                    className="focus-visible:outline-primary-500 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    Filters
                    {hasFilters && (
                        <>
                            <span className="bg-primary-700 h-2 w-2 rounded-full" aria-hidden="true" />
                            <span className="sr-only">(active)</span>
                        </>
                    )}
                </button>

                {mobileOpen && <div className={cn(SURFACE_CARD, "mt-3 p-5")}>{sidebar}</div>}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
                <div className={cn(SURFACE_CARD, "sticky top-24 p-5")}>{sidebar}</div>
            </aside>
        </>
    );
}
