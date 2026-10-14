import type { Metadata } from "next";
import { Product } from "@/types";
import { getAllFrames, getHeadlightCategories, getProductAccessories, getProductBreadcrumbs, getProductHub, getProductPath, getProductRecommendations, getProductTypeLabel } from "@/lib/catalog";
import { hubPath } from "@/lib/hubs";
import { detectBrand } from "@/lib/brand";
import { shouldShowPrice } from "@/lib/config";
import { getDynamicMetadata } from "@/lib/metadata";
import { productMetaDescription, productPageTitle } from "@/lib/product-seo";
import { faqSchema, productSchema } from "@/lib/structured-data";
import { Breadcrumbs, JsonLd } from "@/components/ui";
import ProductDetail from "./ProductDetail";

/** Page-specific title, description, canonical and share image for one product. */
export async function getProductMetadata(product: Product): Promise<Metadata> {
    const [path, typeLabel] = await Promise.all([getProductPath(product), getProductTypeLabel(product)]);
    // A hand-written SEO entry wins over the generated title/description, and its title is used verbatim.
    const seo = product.contentBlocks.find((b) => b.type === "seo");
    const seoData = seo?.type === "seo" ? seo.data : undefined;
    return getDynamicMetadata(seoData?.title ?? productPageTitle(product, typeLabel), seoData?.description ?? productMetaDescription(product), {
        path,
        image: product.defaultImage ?? product.gallery?.[0],
        absoluteTitle: Boolean(seoData?.title),
    });
}

async function withPaths(products: Product[]): Promise<(Product & { path: string })[]> {
    return Promise.all(products.map(async (p) => ({ ...p, path: await getProductPath(p) })));
}

/** Mirrors ActionsBlock: a price is visible only on an add-to-cart panel for a price-visible brand. */
function isPriceVisible(product: Product, brandName: string): boolean {
    const actions = product.contentBlocks.find((b) => b.type === "actions");
    return actions?.type === "actions" && actions.data.addToCart && shouldShowPrice(brandName);
}

/**
 * Everything a product URL renders — breadcrumbs, schema, detail, related
 * products — shared by /product/[slug] and the /product-category catch-all.
 */
export default async function ProductPageView({ product }: { product: Product }) {
    const [breadcrumbs, recommendations, accessoriesRaw, headlightCategories, path, typeLabel, hub] = await Promise.all([
        getProductBreadcrumbs(product),
        getProductRecommendations(product),
        getProductAccessories(product),
        getHeadlightCategories(),
        getProductPath(product),
        getProductTypeLabel(product),
        getProductHub(product),
    ]);
    const compareHref = hub?.showComparison ? `${hubPath(hub)}#compare-heading` : undefined;
    const [relatedProducts, accessories] = await Promise.all([withPaths(recommendations.items), withPaths(accessoriesRaw)]);

    const brandName = detectBrand(product.sku).name;
    const faqBlock = product.contentBlocks.find((b) => b.type === "faq");
    const faqItems = faqBlock?.type === "faq" ? faqBlock.data.items.filter((item) => item.question && item.answer) : [];

    return (
        <>
            <JsonLd data={productSchema({ product, path, brandName, categoryName: typeLabel, showPrice: isPriceVisible(product, brandName) })} />
            <JsonLd data={faqSchema(faqItems)} />
            <Breadcrumbs items={breadcrumbs} />
            <ProductDetail
                product={product}
                relatedProducts={relatedProducts}
                relatedTitle={recommendations.title}
                accessories={accessories}
                frames={getAllFrames()}
                headlightCategories={headlightCategories}
                compareHref={compareHref}
            />
        </>
    );
}
