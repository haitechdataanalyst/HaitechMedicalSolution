"use server";

import { getCategoryContents, getCategoryPath, getProductPath, getAllFrames } from "@/lib/catalog";
import { Category, Product } from "@/types";

export interface CategoryWithPath extends Category {
    path: string;
}

export interface ProductWithPath extends Product {
    path: string;
}

export async function fetchCategoryContentsAction(categoryId: number): Promise<{
    type: "categories" | "products";
    items: CategoryWithPath[] | ProductWithPath[];
}> {
    // Frames category (id 6) — data lives in frames.json, not the products table
    if (categoryId === 6) {
        const frames = getAllFrames();
        const items: ProductWithPath[] = frames.map((frame, i) => ({
            id: 6000 + i,
            slug: frame.id,
            name: frame.name,
            category: 6,
            order: i,
            sku: frame.id,
            contentBlocks: [],
            defaultImage: frame.image,
            path: "/our-frames",
        }));
        return { type: "products", items };
    }

    // Lights category (id 7) — single destination page
    if (categoryId === 7) {
        const item: ProductWithPath = {
            id: 7000,
            slug: "our-headlights",
            name: "LED Headlights",
            category: 7,
            order: 0,
            sku: "our-headlights",
            contentBlocks: [],
            path: "/our-headlights",
        };
        return { type: "products", items: [item] };
    }

    const contents = await getCategoryContents(categoryId);

    if (contents.type === "categories") {
        const categoriesWithPaths = await Promise.all(
            (contents.items as Category[]).map(async (cat) => ({
                ...cat,
                path: await getCategoryPath(cat),
            }))
        );
        return { type: "categories", items: categoriesWithPaths };
    } else {
        const productsWithPaths = await Promise.all(
            (contents.items as Product[]).map(async (prod) => ({
                ...prod,
                path: await getProductPath(prod),
            }))
        );
        return { type: "products", items: productsWithPaths };
    }
}

export async function getCategoryPathAction(category: Category): Promise<string> {
    return getCategoryPath(category);
}

export async function getProductPathAction(product: Product): Promise<string> {
    return getProductPath(product);
}
