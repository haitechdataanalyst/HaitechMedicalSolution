import { Suspense } from "react";
import { getAllInventoryItems, filterInventory, getInventoryFacets, PAGE_SIZE } from "@/lib/inventory";
import InventoryItemCard from "@/components/catalog/InventoryItemCard";
import InventoryFilters from "@/components/catalog/InventoryFilters";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { EmptyState, PageIntro, RESULT_COUNT, chipClass } from "@/components/catalog/listing";

// Inventory-backed listing that duplicates the catalog pages; kept out of search results.
export const metadata = { title: "Product Catalog", robots: { index: false, follow: true } };

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
        <div className="min-h-screen bg-neutral-50/50">
            <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Catalog", path: "/catalog" }]} />
            <PageIntro
                title="Product Catalog"
                subtitle={`${allItems.length.toLocaleString()} products across ${facets.brands.length} brands`}
            />

            <div className="container pb-16 md:pb-24">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
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
                            <div className="mb-4 flex flex-wrap gap-2">
                                {search && <Chip label={`"${search}"`} href={buildClearUrl(sp, "search")} />}
                                {brands.map((b) => <Chip key={b} label={b} href={buildClearArrayUrl(sp, "brand", b)} />)}
                                {categories.map((c) => <Chip key={c} label={c} href={buildClearArrayUrl(sp, "category", c)} />)}
                                {itemTypes.map((t) => <Chip key={t} label={t} href={buildClearArrayUrl(sp, "type", t)} />)}
                                {inStockOnly && <Chip label="In stock" href={buildClearUrl(sp, "inStock")} />}
                            </div>
                        ) : null}

                        {/* Result count */}
                        <p className={`mb-4 ${RESULT_COUNT}`}>
                            {filteredCount === 0
                                ? "0 results"
                                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredCount)} of ${filteredCount} results`}
                        </p>

                        {/* Grid */}
                        {items.length === 0 ? (
                            <EmptyState title="No products match your filters" body="Try a different search, or remove a filter or two.">
                                <Link href="/catalog" className={chipClass(false)}>
                                    Clear all filters
                                </Link>
                            </EmptyState>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                                {items.map((item, idx) => (
                                    // Use idx suffix to guard against duplicate ItemIDs from Zoho data
                                    <InventoryItemCard key={`${item.ItemID}-${idx}`} item={item} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
                                {currentPage > 1 && (
                                    <Link href={buildPageUrl(currentPage - 1)} className={`${PAGE_LINK} gap-1 px-4 text-neutral-700 hover:bg-white`}>
                                        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
                                    </Link>
                                )}

                                {getPaginationPages(currentPage, totalPages).map((p, i) =>
                                    p === "…" ? (
                                        <span key={`ellipsis-${i}`} className="px-1 text-neutral-500" aria-hidden="true">…</span>
                                    ) : (
                                        <Link
                                            key={p}
                                            href={buildPageUrl(p as number)}
                                            aria-current={p === currentPage ? "page" : undefined}
                                            className={`${PAGE_LINK} min-w-11 px-3 tabular-nums ${
                                                p === currentPage ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                                            }`}
                                        >
                                            {p}
                                        </Link>
                                    )
                                )}

                                {currentPage < totalPages && (
                                    <Link href={buildPageUrl(currentPage + 1)} className={`${PAGE_LINK} gap-1 px-4 text-neutral-700 hover:bg-white`}>
                                        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAGE_LINK =
    "focus-visible:outline-primary-500 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2";

function Chip({ label, href }: { label: string; href: string }) {
    return (
        <Link href={href} aria-label={`Remove filter ${label}`} className={chipClass(true)}>
            {label}
            <X className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
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
