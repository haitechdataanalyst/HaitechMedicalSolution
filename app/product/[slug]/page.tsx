import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getProductBreadcrumbs, getProductPath, getRelatedProducts, getProductAccessories, getAllFrames, getHeadlightCategories } from "@/lib/catalog";
import { ProductDetail } from "@/components/products";
import { Breadcrumbs } from "@/components/ui";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const products = await getAllProducts();
        const paths = await Promise.all(
            products.map(async (p) => ({ slug: p.slug, path: await getProductPath(p) }))
        );
        return paths
            .filter((p) => p.path.startsWith("/product/"))
            .map((p) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return getMetadata("productNotFound");
    }

    return getDynamicMetadata(product.name, product.description || `View ${product.name} at Haitech Medical`);
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const [breadcrumbs, relatedRaw, accessoriesRaw, headlightCategories] = await Promise.all([
        getProductBreadcrumbs(product),
        getRelatedProducts(product),
        getProductAccessories(product),
        getHeadlightCategories(),
    ]);

    const frames = getAllFrames();

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
