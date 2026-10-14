import { notFound } from "next/navigation";
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

// The canonical is the product's category URL when it has one, so this
// fallback route never competes with it as a duplicate.
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

    return <ProductPageView product={product} />;
}
