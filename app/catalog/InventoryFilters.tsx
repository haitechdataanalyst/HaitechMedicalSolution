"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

type Facet = { label: string; count: number };

interface FilterSidebarProps {
    brands:      Facet[];
    categories:  Facet[];
    itemTypes:   Facet[];
    total:       number;
    filtered:    number;
}

function useFilterParam(key: string): [string[], (val: string) => void, () => void] {
    const router     = useRouter();
    const pathname   = usePathname();
    const params     = useSearchParams();

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
    const [open, setOpen]    = useState(true);
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? facets : facets.slice(0, 8);

    return (
        <div className="border-b border-gray-100 pb-4">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-800"
            >
                {title}
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
                <div className="mt-2 space-y-1">
                    {visible.map(({ label, count }) => (
                        <label key={label} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={selected.includes(label)}
                                onChange={() => toggle(label)}
                                className="accent-indigo-600 h-3.5 w-3.5 rounded"
                            />
                            <span className="flex-1 truncate text-gray-700">{label}</span>
                            <span className="text-xs text-gray-400">{count}</span>
                        </label>
                    ))}
                    {facets.length > 8 && (
                        <button
                            onClick={() => setShowAll((s) => !s)}
                            className="mt-1 text-xs text-indigo-600 hover:underline"
                        >
                            {showAll ? "Show less" : `+${facets.length - 8} more`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function InventoryFilters({ brands, categories, itemTypes, total, filtered }: FilterSidebarProps) {
    const router   = useRouter();
    const pathname = usePathname();
    const params   = useSearchParams();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [, , clearBrands]     = useFilterParam("brand");
    const [, , clearCategories] = useFilterParam("category");
    const [, , clearTypes]      = useFilterParam("type");

    const search    = params.get("search") ?? "";
    const inStock   = params.get("inStock") === "true";
    const sort      = params.get("sort") ?? "name";
    const hasFilters = params.toString().replace(/page=\d+/g, "").replace(/sort=[^&]+/g, "").replace(/&&/g, "").replace(/^&|&$/, "").length > 0;

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
        <div className="flex flex-col gap-4">
            {/* Result count + clear */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{filtered}</span> of {total}
                </span>
                {hasFilters && (
                    <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <X size={12} /> Clear all
                    </button>
                )}
            </div>

            {/* Search */}
            <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Search</label>
                <input
                    type="text"
                    defaultValue={search}
                    placeholder="Name, SKU, category…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setParam("search", (e.target as HTMLInputElement).value || null);
                    }}
                    onChange={(e) => {
                        if (!e.target.value) setParam("search", null);
                    }}
                />
            </div>

            {/* In-stock toggle */}
            <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setParam("inStock", e.target.checked ? "true" : null)}
                    className="accent-indigo-600 h-4 w-4 rounded"
                />
                <span className="font-medium text-gray-700">In stock only</span>
            </label>

            {/* Brand */}
            <FilterSection title="Brand" facets={brands} paramKey="brand" />

            {/* Category */}
            <FilterSection title="Category" facets={categories} paramKey="category" />

            {/* Item Type */}
            <FilterSection title="Item Type" facets={itemTypes} paramKey="type" />

            {/* Sort */}
            <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort by</label>
                <select
                    value={sort}
                    onChange={(e) => setParam("sort", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
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
                    onClick={() => setMobileOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                >
                    <SlidersHorizontal size={15} />
                    Filters {hasFilters && <span className="ml-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs text-white">ON</span>}
                </button>

                {mobileOpen && (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
                        {sidebar}
                    </div>
                )}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-60 shrink-0">
                <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    {sidebar}
                </div>
            </aside>
        </>
    );
}
