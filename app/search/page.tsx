import Link from "next/link";
import Image from "next/image";
import { Search, Package2, ArrowRight, SlidersHorizontal, ChevronRight } from "lucide-react";
import { getAllProducts, getCategoryById, getProductPath, getTopCategories } from "@/lib/catalog";
import { SearchBar } from "@/components/search/SearchBar";
import { SortSelect } from "@/components/search/SortSelect";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    return {
        title: q ? `Search: "${q}" — Haitech Medical` : "Search Products — Haitech Medical",
        description: "Search dental and medical equipment from Admetec, Almadent, Medesy, Salli, and Strauss.",
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "", category: catFilter, sort = "relevance" } = await searchParams;
    const query = q.trim().toLowerCase();

    const [allProducts, topCategories] = await Promise.all([
        getAllProducts(),
        getTopCategories(),
    ]);

    // Filter products
    const matchingProducts = query.length >= 2
        ? allProducts.filter((p) =>
            p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query)
        )
        : allProducts;

    // Apply category filter
    let filteredProducts = catFilter
        ? matchingProducts.filter((p) => {
            // Sync check against already-loaded categories via closure
            return String(p.category) === catFilter;
        })
        : matchingProducts;

    // Apply sort
    if (sort === "name-asc") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
    }

    // Build category filter chips from matching products
    const [allCats] = await Promise.all([
        Promise.all(matchingProducts.map((p) => p.category ? getCategoryById(p.category) : Promise.resolve(null)))
    ]);

    const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
    for (let i = 0; i < matchingProducts.length; i++) {
        const cat = allCats[i];
        if (cat) {
            const existing = categoryMap.get(cat.slug);
            if (existing) existing.count++;
            else categoryMap.set(cat.slug, { name: cat.name, slug: cat.slug, count: 1 });
        }
    }
    const categoryFilters = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

    // For category-filtered display, also re-filter using slug if catFilter is a slug
    const catFilteredProducts = catFilter
        ? matchingProducts.filter((p) => {
            const catInfo = p.category ? categoryMap.get(Array.from(categoryMap.keys()).find(k => {
                const entry = categoryMap.get(k);
                return entry && String(p.category) === catFilter || k === catFilter;
            }) ?? "") : null;
            // Simpler: filter by category ID string match OR slug
            const catEntry = Array.from(categoryMap.entries()).find(([slug]) => slug === catFilter);
            if (!catEntry) return String(p.category) === catFilter;
            const catId = allCats[matchingProducts.indexOf(p)]?.id;
            return catId !== undefined && String(catId) === catFilter ||
                   allCats[matchingProducts.indexOf(p)]?.slug === catFilter;
        })
        : filteredProducts;

    // Build product paths
    const productsWithPaths = await Promise.all(
        (catFilter ? catFilteredProducts : filteredProducts).map(async (product) => ({
            ...product,
            path: await getProductPath(product),
            catName: allCats[allProducts.indexOf(product)]?.name,
        }))
    );

    const buildHref = (params: Record<string, string | undefined>) => {
        const base: Record<string, string> = {};
        if (q) base.q = q;
        if (catFilter) base.category = catFilter;
        if (sort && sort !== "relevance") base.sort = sort;
        Object.assign(base, params);
        Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
        const qs = new URLSearchParams(base).toString();
        return `/search${qs ? `?${qs}` : ""}`;
    };

    return (
        <>
            {/* Search Header */}
            <section className="border-b border-neutral-100 bg-white">
                <div className="container py-10 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <p className="mb-3 text-sm font-medium text-neutral-400 tracking-wide">
                            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                            <ChevronRight className="inline h-3.5 w-3.5 mx-1" />
                            Search
                        </p>
                        <h1 className="heading-2 mb-5 text-neutral-900">
                            {q
                                ? <>Results for <span className="text-primary-600">&ldquo;{q}&rdquo;</span></>
                                : "Browse All Products"
                            }
                        </h1>
                        <SearchBar initialQuery={q} />
                    </div>
                </div>
            </section>

            <section className="section bg-neutral-50/50">
                <div className="container">
                    {/* Filters + Sort row */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {categoryFilters.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 mr-1">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Filter:
                                </span>
                                <Link
                                    href={buildHref({ category: undefined })}
                                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                                        !catFilter
                                            ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                                            : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                    }`}
                                >
                                    All <span className="ml-0.5 opacity-70">({matchingProducts.length})</span>
                                </Link>
                                {categoryFilters.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={buildHref({ category: cat.slug })}
                                        className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                                            catFilter === cat.slug
                                                ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                                                : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                        }`}
                                    >
                                        {cat.name} <span className="ml-0.5 opacity-70">({cat.count})</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <SortSelect currentSort={sort} q={q} category={catFilter} />
                    </div>

                    {/* Results count */}
                    <div className="mb-5">
                        <p className="text-sm text-neutral-500">
                            {productsWithPaths.length === 0
                                ? "No products found"
                                : `Showing ${productsWithPaths.length} product${productsWithPaths.length !== 1 ? "s" : ""}`
                                    + (catFilter ? ` in ${categoryMap.get(catFilter)?.name ?? catFilter}` : "")
                            }
                        </p>
                    </div>

                    {/* Product grid */}
                    {productsWithPaths.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {productsWithPaths.map((product) => {
                                const image = product.defaultImage || product.variants?.[0]?.image;
                                return (
                                    <Link
                                        key={product.id}
                                        href={product.path}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:border-primary-100 hover:shadow-lg"
                                    >
                                        <div className="relative h-44 w-full overflow-hidden bg-neutral-50">
                                            {image ? (
                                                <Image
                                                    src={image}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package2 className="h-12 w-12 text-neutral-200" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            {product.catName && (
                                                <span className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary-500">
                                                    {product.catName}
                                                </span>
                                            )}
                                            <h3 className="mb-1.5 text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">
                                                    {product.description}
                                                </p>
                                            )}
                                            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                                                View details
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-20 text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
                                <Package2 className="h-10 w-10 text-neutral-300" />
                            </div>
                            <h2 className="heading-3 mb-2 text-neutral-800">
                                {q ? `No results for "${q}"` : "No products available"}
                            </h2>
                            <p className="mb-8 max-w-sm text-neutral-500">
                                Try different keywords, or browse our full product range below.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {topCategories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={cat.specialPage || `/product-category/${cat.slug}`}
                                        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
