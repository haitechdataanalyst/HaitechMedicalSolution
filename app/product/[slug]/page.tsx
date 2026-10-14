import { notFound, permanentRedirect } from "next/navigation";
import { getAllProducts, getProductBySlug, getProductPath } from "@/lib/catalog";
import ProductPageView, { getProductMetadata } from "@/components/products/ProductPageView";
import { getMetadata } from "@/lib/metadata";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const products = await getAllProducts();
        const paths = await Promise.all(products.map(async (p) => ({ slug: p.slug, path: await getProductPath(p) })));
        return paths.filter((p) => p.path.startsWith("/product/")).map((p) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

// Products that have a category live at their category URL; /product/<slug> for those is a permanent redirect set in
// next.config.ts (no function needed). Only a product with no category is served here, prerendered, and anything
// else is a 404, so this route never renders on demand (each on-demand route is a Vercel function; Hobby allows 12).
export const dynamicParams = false;

// This route is only the home of products with no category. A product that has one lives at its category URL, so
// /product/<slug> permanently redirects there instead of serving the same page twice.
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return product ? getProductMetadata(product) : getMetadata("productNotFound");
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const mainPath = await getProductPath(product);
    if (!mainPath.startsWith("/product/")) permanentRedirect(mainPath);

    return <ProductPageView product={product} />;
}
