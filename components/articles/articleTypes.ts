import { ReactNode } from "react";

export interface ArticleData {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: ReactNode;
    publishedAt: string;
    author: string;
    readTime: string;
    imageSrc?: string;
    imageAlt?: string;
    publishedTime?: string;
    views?: number;
    /** 40–80 word direct answer to the article's main question, shown in a box under the title. */
    summary?: string;
    /** Only when the article genuinely answers these questions; rendered visibly and as FAQPage schema. */
    faqs?: Array<{ question: string; answer: string }>;
    /** Extra internal links (product pages, hubs) beyond the automatic hub and sibling-guide links. */
    relatedLinks?: Array<{ label: string; href: string }>;
}
