/**
 * JSON-LD builders. Every field comes from data the page already shows —
 * no ratings, reviews, availability or prices are ever synthesised. Pure
 * functions (no fs/catalog imports) so client components can use them too.
 */
import siteConfig from "@/data/site-config.json";
import { Breadcrumb, Product } from "@/types";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/metadata";

type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const LOGO_PATH = "/haitech_medical_logo.png";

export function organizationSchema(): JsonLd {
    const { company } = siteConfig;
    const address = {
        "@type": "PostalAddress",
        streetAddress: company.address.street,
        addressLocality: company.address.city,
        addressRegion: company.address.state,
        postalCode: company.address.postcode,
        addressCountry: "IN",
    };

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: SITE_NAME,
                url: SITE_URL,
                logo: absoluteUrl(LOGO_PATH),
                email: company.email,
                telephone: company.phone,
                address,
            },
            {
                "@type": "LocalBusiness",
                "@id": `${SITE_URL}/#mumbai-office`,
                name: SITE_NAME,
                url: SITE_URL,
                image: absoluteUrl(LOGO_PATH),
                email: company.email,
                telephone: company.phone,
                address,
                parentOrganization: { "@id": ORGANIZATION_ID },
            },
        ],
    };
}

/** The site itself, published by the same Organization as the rest of the graph. No search action: /search is disallowed in robots.txt. */
export function websiteSchema(): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-IN",
        publisher: { "@id": ORGANIZATION_ID },
    };
}

export function breadcrumbSchema(items: Breadcrumb[]): JsonLd | null {
    const crumbs = items.filter((item) => item.path);
    if (crumbs.length < 2) return null;
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export interface ProductSchemaInput {
    product: Product;
    path: string;
    brandName: string;
    categoryName?: string;
    /** Only true when the price is actually visible on the page. */
    showPrice: boolean;
}

function productImages(product: Product): string[] {
    const hero = product.contentBlocks.find((b) => b.type === "hero");
    const heroImages = hero?.type === "hero" ? [hero.data.primaryImage, ...(hero.data.gallery ?? [])] : [];
    const all = [product.defaultImage, ...(product.gallery ?? []), ...heroImages].filter((src): src is string => Boolean(src));
    return [...new Set(all)].slice(0, 6).map((src) => absoluteUrl(src));
}

export function productSchema({ product, path, brandName, categoryName, showPrice }: ProductSchemaInput): JsonLd {
    const description = product.contentBlocks.find((b) => b.type === "description");
    const info = product.contentBlocks.find((b) => b.type === "info");
    const manufacturer = info?.type === "info" ? info.data.manufacturer : undefined;
    const images = productImages(product);
    const url = absoluteUrl(path);
    const hasVisibleInrPrice = showPrice && typeof product.basePrice === "number" && product.basePrice > 0 && (product.currency ?? "INR") === "INR";

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        url,
        ...(product.sku ? { sku: product.sku } : {}),
        ...(images.length ? { image: images } : {}),
        description: (description?.type === "description" ? description.data.primary : undefined) ?? product.description ?? product.name,
        brand: { "@type": "Brand", name: brandName },
        ...(manufacturer ? { manufacturer: { "@type": "Organization", name: manufacturer } } : {}),
        ...(categoryName ? { category: categoryName } : {}),
        ...(hasVisibleInrPrice
            ? {
                  offers: {
                      "@type": "Offer",
                      url,
                      price: product.basePrice,
                      priceCurrency: "INR",
                      seller: { "@id": ORGANIZATION_ID },
                  },
              }
            : {}),
    };
}

export interface FaqEntry {
    question: string;
    answer: string;
}

export function faqSchema(entries: FaqEntry[]): JsonLd | null {
    if (entries.length === 0) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries.map((entry) => ({
            "@type": "Question",
            name: entry.question,
            acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
    };
}

export interface ArticleSchemaInput {
    title: string;
    description: string;
    path: string;
    publishedAt: string;
    author: string;
    image?: string;
}

export function articleSchema({ title, description, path, publishedAt, author, image }: ArticleSchemaInput): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        datePublished: publishedAt,
        author: { "@type": "Person", name: author },
        publisher: { "@id": ORGANIZATION_ID, "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) } },
        ...(image ? { image: absoluteUrl(image) } : {}),
    };
}
