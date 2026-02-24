import type { Metadata } from "next";

const staticMetadataMap = {
    about: {
        title: "About Us",
        description: "Learn about Haitech Medical Solutions - your trusted partner for premium dental and medical equipment in India. Discover our mission, vision, and dedicated team.",
    },
    products: {
        title: "Products",
        description: "Browse our range of premium medical and dental equipment including loupes, LED headlights, and accessories.",
    },
    ourFrames: {
        title: "Our Frames",
        description:
            "Discover our premium frame collection for Admetec loupes. Available in multiple styles including Blues, Indie, Jazz, Soul, and Swing - each with a variety of colors to match your personality.",
    },
    ourHeadlights: {
        title: "Our Headlights",
        description:
            "Discover our premium LED headlights for dental loupes. Choose from wireless Butterfly EVO series or reliable wired Orchid headlights. High-quality, ultra-lightweight, and designed for optimal illumination.",
    },
    ourInstruments: {
        title: "Medesy Surgical Instruments",
        description:
            "Discover our premium Italian surgical instruments from Medesy. Professional-grade elevators, forceps, periosteal elevators, and scissors. Made in Italy with surgical-grade stainless steel.",
    },
    support: {
        title: "Support",
        description: "Get help from Haitech Medical. Contact us or browse frequently asked questions.",
    },
    supportContact: {
        title: "Contact Us",
        description: "Get in touch with Haitech Medical. We're here to help with all your medical and dental equipment needs.",
    },
    supportFaq: {
        title: "Help Center",
        description: "Find answers to frequently asked questions, browse guides, and get help with Haitech Medical products.",
    },
    supportPolicies: {
        title: "Policies",
        description: "Review our privacy policy and other important information.",
    },
    supportPrivacy: {
        title: "Privacy Policy",
        description: "Learn how Haitech Medical collects, uses, and protects your personal information.",
    },
    supportArticles: {
        title: "Articles",
        description: "Browse our knowledge base of articles about dental loupes, lights, and medical equipment.",
    },
    productNotFound: {
        title: "Product Not Found",
        description: "The requested product could not be found.",
    },
    articleNotFound: {
        title: "Article Not Found",
        description: "The requested support article could not be found.",
    },
    entityNotFound: {
        title: "Not Found",
        description: "The requested page could not be found.",
    },
} as const;

export type MetadataKey = keyof typeof staticMetadataMap;

function buildMetadata(title: string, description?: string): Metadata {
    return {
        title,
        ...(description ? { description } : {}),
        openGraph: {
            title,
            ...(description ? { description } : {}),
            type: "website",
            siteName: "Haitech Medical Solutions",
        },
        twitter: {
            card: "summary_large_image",
            title,
            ...(description ? { description } : {}),
        },
    };
}

export function getMetadata(key: MetadataKey): Metadata {
    const { title, description } = staticMetadataMap[key];
    return buildMetadata(title, description);
}

export function getDynamicMetadata(title: string, description?: string): Metadata {
    return buildMetadata(title, description);
}
