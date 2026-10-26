import { notFound } from "next/navigation";
import { getAllStaticPaths, resolvePathToEntity, getCategoryContents, getCategoryBreadcrumbs, getCategoryHeading, getProductPath, getCategoryPath } from "@/lib/catalog";
import { Product, Category } from "@/types";
import ProductPageView, { getProductMetadata } from "@/components/products/ProductPageView";
import { Breadcrumbs } from "@/components/ui";
import { CategoryPageClient } from "@/components/catalog/CategoryPageClient";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";
import { categoryMetaDescription } from "@/lib/product-seo";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";

interface PageProps {
    params: Promise<{ path: string[] }>;
}

export async function generateStaticParams() {
    try {
        const paths = await getAllStaticPaths();
        return paths.map((segments) => ({ path: segments }));
    } catch {
        // If backend is not running at build time, skip SSG — pages render on demand
        return [];
    }
}

/** A category that holds exactly one product renders that product, so it shares the product's canonical. */
async function getSingleProduct(category: Category): Promise<Product | null> {
    const contents = await getCategoryContents(category.id);
    return contents.type === "products" && contents.items.length === 1 ? (contents.items[0] as Product) : null;
}

/**
 * Where a card for a child category should link, always the final URL rather than one that redirects:
 * - a category holding exactly one product renders that product (and canonicalises to it), so the card links to
 *   the product's own URL;
 * - a category with a special page (frames, lights) and no products of its own redirects there (see layout.tsx),
 *   so the card links to that page directly.
 */
async function getChildLinkPath(category: Category): Promise<string> {
    const { type, items } = await getCategoryContents(category.id);
    if (type === "products" && items.length === 1) return getProductPath(items[0] as Product);
    if (category.specialPage && items.length === 0) return category.specialPage;
    return getCategoryPath(category);
}

export async function generateMetadata({ params }: PageProps) {
    const { path } = await params;
    const result = await resolvePathToEntity(path);

    if (!result) {
        return getMetadata("entityNotFound");
    }

    if (result.type === "product") {
        return getProductMetadata(result.entity as Product);
    }

    const category = result.entity as Category;
    const singleProduct = await getSingleProduct(category);
    if (singleProduct) {
        return getProductMetadata(singleProduct);
    }

    const canonical = category.specialPage ?? (await getCategoryPath(category));
    const { items } = await getCategoryContents(category.id);
    const firstPhoto = items.map((item) => ("children" in item ? item.image : item.defaultImage)).find(Boolean);
    return getDynamicMetadata(
        await getCategoryHeading(category),
        categoryMetaDescription(
            category.name,
            category.description,
            items.map((item) => item.name)
        ),
        { path: canonical, image: category.image ?? firstPhoto }
    );
}

export default async function CategoryPage({ params }: PageProps) {
    const { path } = await params;
    const result = await resolvePathToEntity(path);

    if (!result) {
        notFound();
    }

    if (result.type === "product") {
        return <ProductPageView product={result.entity as Product} />;
    }

    const category = result.entity as Category;
    const [breadcrumbs, contents] = await Promise.all([getCategoryBreadcrumbs(category), getCategoryContents(category.id)]);

    // If the category has exactly one product, show product detail directly
    if (contents.type === "products" && contents.items.length === 1) {
        return <ProductPageView product={contents.items[0] as Product} />;
    }

    // Add paths to the initial items
    const initialItemsWithPaths =
        contents.type === "categories"
            ? await Promise.all((contents.items as Category[]).map(async (cat) => ({ ...cat, path: await getChildLinkPath(cat) })))
            : await Promise.all((contents.items as Product[]).map(async (prod) => ({ ...prod, path: await getProductPath(prod) })));

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            <section className="min-h-screen bg-neutral-50/50">
                <div className="container py-8 md:py-12">
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-3xl leading-[1.1] font-semibold tracking-tight text-neutral-900 sm:text-4xl">{await getCategoryHeading(category)}</h1>
                        {/* Admetec requires its logo, linked to admetec.com, under the heading of its category pages: the Admetec category and the ones inside it */}
                        {(await getCategoryPath(category)).split("/")[2] === "admetec" && <AdmetecBrandBadge size="category" className="mt-2" />}
                        {category.description && <p className="mt-3 line-clamp-2 max-w-2xl text-base leading-relaxed text-neutral-500">{category.description}</p>}
                    </div>

                    <CategoryPageClient initialItems={initialItemsWithPaths} initialType={contents.type} />
                </div>
            </section>
        </>
    );
}
