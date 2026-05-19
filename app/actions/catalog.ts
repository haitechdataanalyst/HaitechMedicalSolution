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
    // Frames category (id 6) — data lives in frames.json, not products.json
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

    // Lights category (id 7) — single destination, auto-navigate via loadNode
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

    const contents = getCategoryContents(categoryId);

    if (contents.type === "categories") {
        const categoriesWithPaths = (contents.items as Category[]).map((cat) => ({
            ...cat,
            path: getCategoryPath(cat),
        }));
        return { type: "categories", items: categoriesWithPaths };
    } else {
        const productsWithPaths = (contents.items as Product[]).map((prod) => ({
            ...prod,
            path: getProductPath(prod),
        }));
        return { type: "products", items: productsWithPaths };
    }
}

export async function getCategoryPathAction(category: Category): Promise<string> {
    return getCategoryPath(category);
}

export async function getProductPathAction(product: Product): Promise<string> {
    return getProductPath(product);
}
