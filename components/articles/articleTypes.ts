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
}