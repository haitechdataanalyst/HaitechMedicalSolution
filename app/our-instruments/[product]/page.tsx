import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProductAccessories, getAllFrames, getHeadlightCategories } from "@/lib/catalog";
import { ProductDetail } from "@/components/products";
import { Breadcrumbs } from "@/components/ui";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";
import { getMedesyProductBreadcrumbs } from "@/lib/breadcrumbs";

interface PageProps {
    params: Promise<{ product: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { product: productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product) {
        return getMetadata("productNotFound");
    }

    return getDynamicMetadata(`${product.name} — Medesy Instruments`, product.description || `View ${product.name} at Haitech Medical`);
}

export default async function MedesyProductPage({ params }: PageProps) {
    const { product: productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product) {
        notFound();
    }

    const [relatedRaw, accessoriesRaw, headlightCategories] = await Promise.all([
        getRelatedProducts(product),
        getProductAccessories(product),
        getHeadlightCategories(),
    ]);

    const frames = getAllFrames();
    const breadcrumbs = getMedesyProductBreadcrumbs(product.name, productSlug);

    const relatedProducts = await Promise.all(
        relatedRaw.map(async (p) => ({ ...p, path: `/our-instruments/${p.slug}` }))
    );
    const accessories = await Promise.all(
        accessoriesRaw.map(async (p) => ({ ...p, path: `/our-instruments/${p.slug}` }))
    );

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <ProductDetail
                product={product}
                relatedProducts={relatedProducts}
                accessories={accessories}
                frames={frames}
                headlightCategories={headlightCategories}
            />
        </>
    );
}
