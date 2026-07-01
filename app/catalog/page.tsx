import { Suspense } from "react";
import { getAllInventoryItems, filterInventory, getInventoryFacets, PAGE_SIZE } from "@/lib/inventory";
import InventoryItemCard from "@/components/catalog/InventoryItemCard";
import InventoryFilters from "@/components/catalog/InventoryFilters";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";

export const metadata = { title: "Product Catalog | Haitech Medical" };

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseArray(val: string | string[] | undefined): string[] {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
}

export default async function CatalogPage({ searchParams }: PageProps) {
    const sp = await searchParams;

    const search      = typeof sp.search === "string" ? sp.search : undefined;
    const brands      = parseArray(sp.brand);
    const categories  = parseArray(sp.category);
    const itemTypes   = parseArray(sp.type);
    const inStockOnly = sp.inStock === "true";
    const sort        = (sp.sort as "name" | "price-asc" | "price-desc" | "stock") ?? "name";
    const page        = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1") || 1);

    const allItems = getAllInventoryItems();
    const facets   = getInventoryFacets(allItems);

    const { items, total, totalPages, page: currentPage } = filterInventory(allItems, {
        search, brands, categories, itemTypes, inStockOnly, sort, page,
    });

    const filteredCount = filterInventory(allItems, { search, brands, categories, itemTypes, inStockOnly, sort }).total;

    function buildPageUrl(p: number) {
        const params = new URLSearchParams();
        if (search)          params.set("search", search);
        if (inStockOnly)     params.set("inStock", "true");
        if (sort !== "name") params.set("sort", sort);
        brands.forEach((b)     => params.append("brand", b));
        categories.forEach((c) => params.append("category", c));
        itemTypes.forEach((t)  => params.append("type", t));
        params.set("page", String(p));
        return `/catalog?${params.toString()}`;
    }

    return (
        <main className="min-h-screen bg-neutral-50/50">
            {/* Page header */}
            <div className="border-b border-neutral-100 bg-white">
                <div className="container py-10 md:py-14">
                    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Catalog", path: "/catalog" }]} />
                    <div className="mt-4 max-w-xl">
                        <span className="label-tag label-tag-primary mb-4 inline-flex">Full Inventory</span>
                        <h1 className="heading-2 text-neutral-900">Product Catalog</h1>
                        <p className="mt-2 text-sm text-neutral-500">
                            {allItems.length.toLocaleString()} products across {facets.brands.length} brands
                        </p>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* Filters sidebar */}
                    <Suspense>
                        <InventoryFilters
                            brands={facets.brands}
                            categories={facets.categories}
                            itemTypes={facets.itemTypes}
                            total={allItems.length}
                            filtered={filteredCount}
                        />
                    </Suspense>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                        {/* Active filter chips */}
                        {(brands.length || categories.length || itemTypes.length || search || inStockOnly) ? (
                            <div className="mb-5 flex flex-wrap gap-2">
                                {search && <Chip label={`"${search}"`} href={buildClearUrl(sp, "search")} />}
                                {brands.map((b) => <Chip key={b} label={b} href={buildClearArrayUrl(sp, "brand", b)} />)}
                                {categories.map((c) => <Chip key={c} label={c} href={buildClearArrayUrl(sp, "category", c)} />)}
                                {itemTypes.map((t) => <Chip key={t} label={t} href={buildClearArrayUrl(sp, "type", t)} />)}
                                {inStockOnly && <Chip label="In stock" href={buildClearUrl(sp, "inStock")} />}
                            </div>
                        ) : null}

                        {/* Result count */}
                        <p className="mb-5 text-sm text-neutral-500">
                            Showing{" "}
                            <span className="font-semibold text-neutral-800">
                                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredCount)}
                            </span>{" "}
                            of <span className="font-semibold text-neutral-800">{filteredCount}</span> results
                        </p>

                        {/* Grid */}
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-24 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <p className="text-base font-semibold text-neutral-700">No products match your filters</p>
                                <p className="mt-1 text-sm text-neutral-400">Try adjusting your search or removing some filters</p>
                                <Link href="/catalog" className="text-primary-600 hover:text-primary-700 mt-4 text-sm font-medium">
                                    Clear all filters
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {items.map((item, idx) => (
                                    // Use idx suffix to guard against duplicate ItemIDs from Zoho data
                                    <InventoryItemCard key={`${item.ItemID}-${idx}`} item={item} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                {currentPage > 1 && (
                                    <Link
                                        href={buildPageUrl(currentPage - 1)}
                                        className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-300"
                                    >
                                        <ChevronLeft size={14} /> Prev
                                    </Link>
                                )}

                                {getPaginationPages(currentPage, totalPages).map((p, i) =>
                                    p === "…" ? (
                                        <span key={`ellipsis-${i}`} className="px-1 text-neutral-400">…</span>
                                    ) : (
                                        <Link
                                            key={p}
                                            href={buildPageUrl(p as number)}
                                            className={`min-w-[38px] rounded-full border px-3 py-2 text-center text-sm font-medium transition-colors ${
                                                p === currentPage
                                                    ? "border-primary-500 bg-primary-500 text-white"
                                                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                                            }`}
                                        >
                                            {p}
                                        </Link>
                                    )
                                )}

                                {currentPage < totalPages && (
                                    <Link
                                        href={buildPageUrl(currentPage + 1)}
                                        className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-300"
                                    >
                                        Next <ChevronRight size={14} />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Chip({ label, href }: { label: string; href: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
        >
            {label} <span className="ml-0.5 text-primary-400">×</span>
        </Link>
    );
}

function buildClearUrl(sp: Record<string, string | string[] | undefined>, key: string): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
        if (k === key || k === "page") continue;
        if (Array.isArray(v)) v.forEach((val) => params.append(k, val));
        else if (v) params.set(k, v);
    }
    return `/catalog?${params.toString()}`;
}

function buildClearArrayUrl(sp: Record<string, string | string[] | undefined>, key: string, remove: string): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
        if (k === "page") continue;
        if (k === key) {
            const vals = Array.isArray(v) ? v : v ? [v] : [];
            vals.filter((val) => val !== remove).forEach((val) => params.append(k, val));
        } else {
            if (Array.isArray(v)) v.forEach((val) => params.append(k, val));
            else if (v) params.set(k, v);
        }
    }
    return `/catalog?${params.toString()}`;
}

function getPaginationPages(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (current > 3) pages.push("…");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
    if (current < total - 2) pages.push("…");
    pages.push(total);
    return pages;
}
