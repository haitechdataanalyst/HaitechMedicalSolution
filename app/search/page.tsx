import Link from "next/link";
import Image from "next/image";
import { Package2, ArrowRight, ChevronRight } from "lucide-react";
import { getAllProducts, getCategoryById, getProductPath, getTopCategories } from "@/lib/catalog";
import { SearchBar } from "@/components/search/SearchBar";
import { SortSelect } from "@/components/search/SortSelect";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import { EmptyState, LISTING_GRID, PAGE_TITLE, RESULT_COUNT, chipClass } from "@/components/catalog/listing";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    return {
        title: q ? `Search: "${q}"` : "Search Products",
        // Internal result pages are thin and endless; keep them out of the index.
        robots: { index: false, follow: true },
        description: "Search dental and medical equipment from Admetec, Almadent, Medesy, Salli, and Strauss.",
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "", category: catFilter, sort = "relevance" } = await searchParams;
    const query = q.trim().toLowerCase();

    const [allProducts, topCategories] = await Promise.all([getAllProducts(), getTopCategories()]);

    // Filter products
    const matchingProducts =
        query.length >= 2 ? allProducts.filter((p) => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query) || p.sku?.toLowerCase().includes(query)) : allProducts;

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
    const [allCats] = await Promise.all([Promise.all(matchingProducts.map((p) => (p.category ? getCategoryById(p.category) : Promise.resolve(null))))]);

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
              const catInfo = p.category
                  ? categoryMap.get(
                        Array.from(categoryMap.keys()).find((k) => {
                            const entry = categoryMap.get(k);
                            return (entry && String(p.category) === catFilter) || k === catFilter;
                        }) ?? ""
                    )
                  : null;
              // Simpler: filter by category ID string match OR slug
              const catEntry = Array.from(categoryMap.entries()).find(([slug]) => slug === catFilter);
              if (!catEntry) return String(p.category) === catFilter;
              const catId = allCats[matchingProducts.indexOf(p)]?.id;
              return (catId !== undefined && String(catId) === catFilter) || allCats[matchingProducts.indexOf(p)]?.slug === catFilter;
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
        <div className="min-h-screen bg-neutral-50/50">
            {/* Search Header */}
            <header className="container pt-6 pb-8 md:pb-10">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <Link href="/" className="hover:text-primary-700 inline-flex min-h-11 items-center transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span aria-current="page" className="font-medium text-neutral-800">
                        Search
                    </span>
                </nav>
                <h1 className={`${PAGE_TITLE} mt-8 md:mt-12`}>
                    {q ? (
                        <>
                            Results for <span className="text-primary-700">&ldquo;{q}&rdquo;</span>
                        </>
                    ) : (
                        "Browse All Products"
                    )}
                </h1>
                <div className="mt-6 max-w-2xl">
                    <SearchBar initialQuery={q} />
                </div>
            </header>

            <section className="container pb-16 md:pb-24">
                {/* Filters + Sort row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {categoryFilters.length > 1 && (
                        <nav aria-label="Filter by category" className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                            <Link href={buildHref({ category: undefined })} aria-current={!catFilter ? "true" : undefined} className={chipClass(!catFilter)}>
                                All <span className="tabular-nums opacity-75">{matchingProducts.length}</span>
                            </Link>
                            {categoryFilters.map((cat) => (
                                <Link key={cat.slug} href={buildHref({ category: cat.slug })} aria-current={catFilter === cat.slug ? "true" : undefined} className={chipClass(catFilter === cat.slug)}>
                                    {cat.name} <span className="tabular-nums opacity-75">{cat.count}</span>
                                </Link>
                            ))}
                        </nav>
                    )}
                    <div className="sm:ml-auto">
                        <SortSelect currentSort={sort} q={q} category={catFilter} />
                    </div>
                </div>

                {/* Results count */}
                <p className={`mt-5 mb-4 ${RESULT_COUNT}`}>
                    {productsWithPaths.length === 0
                        ? "No products found"
                        : `Showing ${productsWithPaths.length} product${productsWithPaths.length !== 1 ? "s" : ""}` + (catFilter ? ` in ${categoryMap.get(catFilter)?.name ?? catFilter}` : "")}
                </p>

                {/* Product grid */}
                {productsWithPaths.length > 0 ? (
                    <div className={LISTING_GRID}>
                        {productsWithPaths.map((product) => {
                            const image = product.defaultImage || product.variants?.[0]?.image;
                            return (
                                <Link key={product.id} href={product.path} className={`${INTERACTIVE_CARD} p-2`}>
                                    <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 1024px) 50vw, 300px"
                                                className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package2 className="h-10 w-10 text-neutral-300" aria-hidden="true" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                                        {product.catName && <span className="mb-1 text-[13px] text-neutral-500">{product.catName}</span>}
                                        <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{product.name}</h3>
                                        {product.description && <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">{product.description}</p>}
                                        <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium">
                                            View details
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState title={q ? `No results for "${q}"` : "No products available"} body="Try different keywords, or browse our full product range below.">
                        {topCategories.map((cat) => (
                            <Link key={cat.id} href={cat.specialPage || `/product-category/${cat.slug}`} className={chipClass(false)}>
                                {cat.name}
                            </Link>
                        ))}
                    </EmptyState>
                )}
            </section>
        </div>
    );
}
