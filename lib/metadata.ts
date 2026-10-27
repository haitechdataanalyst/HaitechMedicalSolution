import type { Metadata } from "next";

/**
 * Canonical production origin. Canonicals, the sitemap, Open Graph URLs and
 * JSON-LD all resolve against this, so preview and local builds still point
 * search engines at the live site. Must match the Sitemap line in
 * public/robots.txt.
 */
export const SITE_URL = "https://medical.haitech-group.com";
export const SITE_NAME = "Haitech Medical Solutions";
const OG_LOCALE = "en_IN";
const DESCRIPTION_MAX = 160;

/** Absolute URL for a site path ("/about" -> "https://…/about"). */
export function absoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
}

interface StaticMetadataEntry {
    title: string;
    description: string;
    /** The page's own canonical route. Not-found entries have none: a 404 must never declare a canonical. */
    path?: string;
    noindex?: boolean;
}

const staticMetadataMap = {
    about: {
        title: "About Us",
        description: "Learn about Haitech Medical Solutions - your trusted partner for premium dental and medical equipment in India. Discover our mission, vision, and dedicated team.",
        path: "/about",
    },
    products: {
        title: "Dental Equipment & Brands",
        description:
            "Browse dental loupes, dental chairs, saddle chairs, endodontic equipment, CBCT imaging, diamond burs and surgical instruments from Admetec, Almadent, Salli, Bondent, Strauss and Medesy.",
        path: "/products",
    },
    ourFrames: {
        title: "Our Frames",
        description:
            "Discover our premium frame collection for Admetec loupes. Available in multiple styles including Blues, Indie, Jazz, Soul, and Swing - each with a variety of colors to match your personality.",
        path: "/our-frames",
    },
    ourHeadlights: {
        title: "Our Headlights",
        description:
            "Discover our premium LED headlights for dental loupes. Choose from wireless Butterfly EVO series or reliable wired Orchid headlights. High-quality, ultra-lightweight, and designed for optimal illumination.",
        path: "/our-headlights",
    },
    ourInstruments: {
        title: "Medesy Surgical Instruments",
        description:
            "Discover our premium Italian surgical instruments from Medesy. Professional-grade elevators, forceps, periosteal elevators, and scissors. Made in Italy with surgical-grade stainless steel.",
        path: "/product-category/medesy",
    },
    support: {
        title: "Support",
        description: "Get help from Haitech Medical. Contact us or browse frequently asked questions.",
        path: "/support",
    },
    supportContact: {
        title: "Contact Us",
        description: "Get in touch with Haitech Medical. We're here to help with all your medical and dental equipment needs.",
        path: "/support/contact",
    },
    supportFaq: {
        title: "Help Center",
        description: "Find answers to frequently asked questions, browse guides, and get help with Haitech Medical products.",
        path: "/support/faq",
    },
    supportPolicies: {
        title: "Policies",
        description: "Read the Haitech Medical privacy policy and the terms and conditions that apply to quote requests, orders and use of this website.",
        path: "/support/policies",
    },
    supportPrivacy: {
        title: "Privacy Policy",
        description: "Learn how Haitech Medical collects, uses, and protects your personal information.",
        path: "/support/policies/privacy",
    },
    supportTerms: {
        title: "Terms & Conditions",
        description: "The terms and conditions that apply to using the Haitech Medical website, requesting quotes and placing orders.",
        path: "/support/policies/terms",
    },
    supportArticles: {
        title: "Articles",
        description: "Guides and articles on choosing, using and caring for dental loupes, headlights and other dental equipment.",
        path: "/support/articles",
    },
    bookDemo: {
        title: "Book a Product Demo",
        description: "Request a demonstration of a dental chair, CBCT, endodontic system, loupes or other equipment supplied by Haitech Medical in India.",
        path: "/book-demo",
    },
    bookLoupeFitting: {
        title: "Book a Loupe Fitting",
        description: "Book a dental loupe fitting with Haitech Medical. Your working distance and posture are assessed before you choose Admetec loupes.",
        path: "/book-loupe-fitting",
    },
    productNotFound: {
        title: "Product Not Found",
        description: "The requested product could not be found.",
        noindex: true,
    },
    articleNotFound: {
        title: "Article Not Found",
        description: "The requested support article could not be found.",
        noindex: true,
    },
    entityNotFound: {
        title: "Not Found",
        description: "The requested page could not be found.",
        noindex: true,
    },
} satisfies Record<string, StaticMetadataEntry>;

export type MetadataKey = keyof typeof staticMetadataMap;

export interface MetadataOptions {
    /** Canonical route for this page. Omit only for pages that must not declare one. */
    path?: string;
    /** Absolute or site-relative image used for social previews. */
    image?: string;
    /** "article" for blog posts; defaults to "website". */
    type?: "website" | "article";
    noindex?: boolean;
    /** Use the title exactly as given, without the root "| Haitech Medical" template. */
    absoluteTitle?: boolean;
}

function clampDescription(description?: string): string | undefined {
    if (!description) return undefined;
    const clean = description.replace(/\s+/g, " ").trim();
    if (clean.length <= DESCRIPTION_MAX) return clean;
    return clean.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "") + "…";
}

/** Branded 1200x630 card (public/brand/haitech/og-default.png) for pages that have no image of their own. */
const DEFAULT_SHARE_IMAGE = { url: "/brand/haitech/og-default.png", width: 1200, height: 630, alt: `${SITE_NAME} — premium medical and dental equipment in India` };

function buildMetadata(title: string, rawDescription: string | undefined, options: MetadataOptions = {}): Metadata {
    const description = clampDescription(rawDescription);
    // metadataBase (root layout) turns these site-relative URLs into absolute ones.
    const shareImage = options.image ? { url: options.image, alt: title } : DEFAULT_SHARE_IMAGE;
    const images = [shareImage];

    return {
        title: options.absoluteTitle ? { absolute: title } : title,
        ...(description ? { description } : {}),
        ...(options.path ? { alternates: { canonical: options.path } } : {}),
        ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
        openGraph: {
            title,
            ...(description ? { description } : {}),
            type: options.type ?? "website",
            siteName: SITE_NAME,
            locale: OG_LOCALE,
            ...(options.path ? { url: options.path } : {}),
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            ...(description ? { description } : {}),
            images: images.map(({ url, alt }) => ({ url, alt })),
        },
    };
}

export function getMetadata(key: MetadataKey): Metadata {
    const entry: StaticMetadataEntry = staticMetadataMap[key];
    return buildMetadata(entry.title, entry.description, { path: entry.path, noindex: entry.noindex });
}

export function getDynamicMetadata(title: string, description?: string, options: MetadataOptions = {}): Metadata {
    return buildMetadata(title, description, options);
}
