import type { MetadataRoute } from "next";
import { getAllCategories, getAllProducts, getCategoryPath, getProductPath } from "@/lib/catalog";
import { HUBS, hubPath } from "@/lib/hubs";
import { absoluteUrl } from "@/lib/metadata";
import { isStoriesPageLive } from "@/lib/customer-stories.server";
import { STORIES_PAGE_PATH } from "@/lib/customer-story-listing";
import { articles } from "@/components/articles";
import { Category, Product } from "@/types";

// Rebuilt hourly so new catalog products appear without a deploy.
export const revalidate = 3600;

// Indexable non-catalog pages. Account, cart, checkout, auth, search,
// dashboard, admin and inventory tools are deliberately absent.
const STATIC_PATHS = [
    "/",
    "/products",
    "/about",
    "/book-demo",
    "/book-loupe-fitting",
    "/our-frames",
    "/our-headlights",
    "/product/admetec",
    "/product/almadent",
    "/product/bondent",
    "/product/medesy",
    "/product/salli",
    "/product/strauss",
    "/support",
    "/support/contact",
    "/support/faq",
    "/support/articles",
    "/support/policies",
    "/support/policies/privacy",
    "/support/policies/terms",
];

/**
 * A category URL is its own canonical page only when it lists several
 * items. Empty ones are skipped, single-product ones render (and canonicalise
 * to) that product, and special-page ones canonicalise to the special page.
 */
function isListingCategory(category: Category, categories: Category[], products: Product[]): boolean {
    if (category.specialPage) return false;
    const childCount = categories.filter((c) => c.parent === category.id).length;
    if (childCount > 0) return true;
    return products.filter((p) => p.category === category.id).length > 1;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

    const categoryPaths = await Promise.all(categories.filter((c) => isListingCategory(c, categories, products)).map((c) => getCategoryPath(c)));
    const productPaths = await Promise.all(products.map((p) => getProductPath(p)));

    const entries: MetadataRoute.Sitemap = [
        ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
        // Listed only once enough approved customer stories exist; before that the page is a 404.
        ...(isStoriesPageLive() ? [{ url: absoluteUrl(STORIES_PAGE_PATH) }] : []),
        ...HUBS.map((hub) => ({ url: absoluteUrl(hubPath(hub)) })),
        ...categoryPaths.map((path) => ({ url: absoluteUrl(path) })),
        ...productPaths.map((path) => ({ url: absoluteUrl(path) })),
        ...articles.map((article) => ({ url: absoluteUrl(`/support/articles/${article.slug}`), lastModified: article.publishedAt })),
    ];

    // One entry per URL even if two catalog rows resolve to the same path.
    const seen = new Set<string>();
    return entries.filter((entry) => (seen.has(entry.url) ? false : (seen.add(entry.url), true)));
}
