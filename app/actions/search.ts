"use server";

import { getAllProducts, getProductPath, getCategoryById } from "@/lib/catalog";

export interface SearchResult {
    type: "product";
    id: number;
    name: string;
    description?: string;
    image?: string;
    path: string;
    categoryName?: string;
    basePrice?: number;
    currency?: string;
}

export async function searchCatalog(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase().trim();
    const products = await getAllProducts();

    const matched = products
        .filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.sku?.toLowerCase().includes(q)
        )
        .slice(0, 10);

    return Promise.all(
        matched.map(async (p) => {
            const category = p.category ? await getCategoryById(p.category) : null;
            return {
                type: "product" as const,
                id: p.id,
                name: p.name,
                description: p.description,
                image: p.defaultImage || p.variants?.[0]?.image,
                path: await getProductPath(p),
                categoryName: category?.name,
                basePrice: p.basePrice,
                currency: p.currency,
            };
        })
    );
}

export async function getTrendingProducts(): Promise<SearchResult[]> {
    const products = await getAllProducts();
    const trending = products
        .filter((p) => p.basePrice && (p.defaultImage || p.variants?.[0]?.image))
        .slice(0, 5);

    return Promise.all(
        trending.map(async (p) => {
            const category = p.category ? await getCategoryById(p.category) : null;
            return {
                type: "product" as const,
                id: p.id,
                name: p.name,
                image: p.defaultImage || p.variants?.[0]?.image,
                path: await getProductPath(p),
                categoryName: category?.name,
                basePrice: p.basePrice,
                currency: p.currency,
            };
        })
    );
}
