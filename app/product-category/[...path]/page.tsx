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
import { CategoryPageClient } from "./CategoryPageClient";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";

interface PageProps {
    params: Promise<{ path: string[] }>;
}

export async function generateStaticParams() {
    const paths = getAllStaticPaths();
    return paths.map((segments) => ({ path: segments }));
}

export async function generateMetadata({ params }: PageProps) {
    const { path } = await params;
    const result = resolvePathToEntity(path);

    if (!result) {
        return getMetadata("entityNotFound");
    }

    return getDynamicMetadata(result.entity.name, result.entity.description || `Browse ${result.entity.name} at Haitech Medical`);
}

export default async function CategoryPage({ params }: PageProps) {
    const { path } = await params;
    const result = resolvePathToEntity(path);

    if (!result) {
        notFound();
    }

    // If it's a product, show product detail
    if (result.type === "product") {
        const product = result.entity as Product;
        const breadcrumbs = getProductBreadcrumbs(product);
        const relatedProducts = getRelatedProducts(product).map((p) => ({ ...p, path: getProductPath(p) }));
        const accessories = getProductAccessories(product).map((p) => ({ ...p, path: getProductPath(p) }));
        const frames = getAllFrames();
        const headlightCategories = await getHeadlightCategories();

        return (
            <>
                <Breadcrumbs items={breadcrumbs} />
                <ProductDetail product={product} relatedProducts={relatedProducts} accessories={accessories} frames={frames} headlightCategories={headlightCategories} />
            </>
        );
    }

    // If it's a category, show category browser starting from this category
    const category = result.entity as Category;
    const breadcrumbs = getCategoryBreadcrumbs(category);
    const contents = getCategoryContents(category.id);

    // If the category has exactly one product, show product detail directly
    if (contents.type === "products" && contents.items.length === 1) {
        const product = contents.items[0] as Product;
        const productBreadcrumbs = getProductBreadcrumbs(product);
        const relatedProducts = getRelatedProducts(product).map((p) => ({ ...p, path: getProductPath(p) }));
        const accessories = getProductAccessories(product).map((p) => ({ ...p, path: getProductPath(p) }));
        const frames = getAllFrames();
        const headlightCategories = await getHeadlightCategories();

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
            ? (contents.items as Category[]).map((cat) => ({ ...cat, path: getCategoryPath(cat) }))
            : (contents.items as Product[]).map((prod) => ({ ...prod, path: getProductPath(prod) }));

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            <section className="bg-neutral-50/50 min-h-screen">
                <div className="container py-6 md:py-8">
                    {/* Compact category header */}
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
