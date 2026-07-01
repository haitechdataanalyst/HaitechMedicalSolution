import { notFound } from "next/navigation";
import {
    getAllStaticPaths,
    resolvePathToEntity,
    getCategoryContents,
    getCategoryBreadcrumbs,
    getProductBreadcrumbs,
    getProductPath,
    getCategoryPath,
    getRelatedProducts,
    getProductAccessories,
    getAllFrames,
    getHeadlightCategories,
} from "@/lib/catalog";
import { Product, Category } from "@/types";
import { ProductDetail } from "@/components/products";
import { Breadcrumbs } from "@/components/ui";
import { CategoryPageClient } from "@/components/catalog/CategoryPageClient";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";

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

export async function generateMetadata({ params }: PageProps) {
    const { path } = await params;
    const result = await resolvePathToEntity(path);

    if (!result) {
        return getMetadata("entityNotFound");
    }

    return getDynamicMetadata(result.entity.name, result.entity.description || `Browse ${result.entity.name} at Haitech Medical`);
}

export default async function CategoryPage({ params }: PageProps) {
    const { path } = await params;
    const result = await resolvePathToEntity(path);

    if (!result) {
        notFound();
    }

    // If it's a product, show product detail
    if (result.type === "product") {
        const product = result.entity as Product;
        const [breadcrumbs, relatedRaw, accessoriesRaw, frames, headlightCategories] = await Promise.all([
            getProductBreadcrumbs(product),
            getRelatedProducts(product),
            getProductAccessories(product),
            Promise.resolve(getAllFrames()),
            getHeadlightCategories(),
        ]);
        const relatedProducts = await Promise.all(
            relatedRaw.map(async (p) => ({ ...p, path: await getProductPath(p) }))
        );
        const accessories = await Promise.all(
            accessoriesRaw.map(async (p) => ({ ...p, path: await getProductPath(p) }))
        );

        return (
            <>
                <Breadcrumbs items={breadcrumbs} />
                <ProductDetail product={product} relatedProducts={relatedProducts} accessories={accessories} frames={frames} headlightCategories={headlightCategories} />
            </>
        );
    }

    // If it's a category, show category browser
    const category = result.entity as Category;
    const [breadcrumbs, contents] = await Promise.all([
        getCategoryBreadcrumbs(category),
        getCategoryContents(category.id),
    ]);

    // If the category has exactly one product, show product detail directly
    if (contents.type === "products" && contents.items.length === 1) {
        const product = contents.items[0] as Product;
        const [productBreadcrumbs, relatedRaw, accessoriesRaw, frames, headlightCategories] = await Promise.all([
            getProductBreadcrumbs(product),
            getRelatedProducts(product),
            getProductAccessories(product),
            Promise.resolve(getAllFrames()),
            getHeadlightCategories(),
        ]);
        const relatedProducts = await Promise.all(
            relatedRaw.map(async (p) => ({ ...p, path: await getProductPath(p) }))
        );
        const accessories = await Promise.all(
            accessoriesRaw.map(async (p) => ({ ...p, path: await getProductPath(p) }))
        );

        return (
            <>
                <Breadcrumbs items={productBreadcrumbs} />
                <ProductDetail product={product} relatedProducts={relatedProducts} accessories={accessories} frames={frames} headlightCategories={headlightCategories} />
            </>
        );
    }

    // Add paths to the initial items
    const initialItemsWithPaths =
        contents.type === "categories"
            ? await Promise.all(
                (contents.items as Category[]).map(async (cat) => ({ ...cat, path: await getCategoryPath(cat) }))
              )
            : await Promise.all(
                (contents.items as Product[]).map(async (prod) => ({ ...prod, path: await getProductPath(prod) }))
              );

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            <section className="bg-neutral-50/50 min-h-screen">
                <div className="container py-6 md:py-8">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">{category.name}</h1>
                        {category.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{category.description}</p>
                        )}
                    </div>

                    <CategoryPageClient initialItems={initialItemsWithPaths} initialType={contents.type} />
                </div>
            </section>
        </>
    );
}
