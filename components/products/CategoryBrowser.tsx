"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category, Product } from "@/types";

// Extended types with path included
export interface CategoryWithPath extends Category {
    path?: string;
}

export interface ProductWithPath extends Product {
    path?: string;
}

interface CategoryItemProps {
    category: CategoryWithPath;
    isExpanded: boolean;
    level: number;
    onCategoryExpand: (categoryId: number, level: number) => void;
}

interface ProductItemProps {
    product: ProductWithPath;
}

interface CategoryBrowserProps {
    initialCategories: CategoryWithPath[];
    fetchCategoryContents: (categoryId: number) => Promise<{ type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[] }>;
}

function ProductItem({ product }: ProductItemProps) {
    const productImage =
        product.defaultImage ||
        (product.variants && product.variants.length > 0 ? product.variants[0].image : "") ||
        (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") ||
        "/images/placeholder.jpg";
    const productPath = product.path || `/product/${product.slug}`;

    return (
        <Link href={productPath} className="group flex flex-col items-center p-4 text-center transition-transform hover:scale-105">
            <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full transition-shadow sm:h-28 sm:w-28 md:h-32 md:w-32">
                <Image src={productImage} alt={product.name} fill className="object-contain p-2" sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px" />
            </div>
            <span className="group-hover:text-primary-600 line-clamp-2 max-w-30 text-sm font-medium text-gray-700 transition-colors">{product.name}</span>
        </Link>
    );
}

function CategoryItem({ category, isExpanded, level, onCategoryExpand }: CategoryItemProps) {
    const categoryImage = category.image || "/images/placeholder.jpg";

    // If category has a special page, render as a Link instead of a button
    if (category.specialPage) {
        return (
            <Link href={category.specialPage} className="group flex flex-col items-center p-4 text-center transition-all hover:scale-105">
                <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full transition-all sm:h-28 sm:w-28 md:h-32 md:w-32">
                    <Image src={categoryImage} alt={category.name} fill className="cursor-pointer object-contain" sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px" />
                </div>
                <span className="group-hover:text-primary-600 line-clamp-2 max-w-30 text-sm font-medium text-gray-700 transition-colors">{category.name}</span>
            </Link>
        );
    }

    return (
        <button onClick={() => onCategoryExpand(category.id, level)} className={`group flex flex-col items-center p-4 text-center transition-all ${isExpanded ? "scale-105" : "hover:scale-105"}`}>
            <div className={`relative mb-3 h-24 w-24 overflow-hidden rounded-full transition-all sm:h-28 sm:w-28 md:h-32 md:w-32 ${isExpanded ? "ring-primary-500 shadow-md ring-2" : ""}`}>
                <Image src={categoryImage} alt={category.name} fill className="cursor-pointer object-contain" sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px" />
            </div>
            <span className={`line-clamp-2 max-w-30 text-sm font-medium transition-colors ${isExpanded ? "text-primary-600" : "group-hover:text-primary-600 text-gray-700"}`}>{category.name}</span>
        </button>
    );
}

interface LevelSectionProps {
    title: string;
    items: CategoryWithPath[] | ProductWithPath[];
    type: "categories" | "products";
    level: number;
    onCategoryExpand: (categoryId: number, level: number) => void;
    levelExpanded: Map<number, number>;
}

function LevelSection({ title, items, type, level, onCategoryExpand, levelExpanded }: LevelSectionProps) {
    const expandedCategoryId = levelExpanded.get(level);

    return (
        <div className="w-full">
            {/* Section Header with divider lines */}
            <div className="my-6 flex items-center gap-4 sm:my-8">
                <div className="h-px flex-1 bg-gray-200" />
                <h2 className="px-4 text-xl font-light whitespace-nowrap text-gray-600 sm:text-2xl">{title}</h2>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Items Grid */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
                {type === "categories"
                    ? (items as CategoryWithPath[]).map((category) => (
                          <CategoryItem key={category.id} category={category} isExpanded={expandedCategoryId === category.id} level={level} onCategoryExpand={onCategoryExpand} />
                      ))
                    : (items as ProductWithPath[]).map((product) => <ProductItem key={product.id} product={product} />)}
            </div>
        </div>
    );
}

export default function CategoryBrowser({ initialCategories, fetchCategoryContents }: CategoryBrowserProps) {
    // Track expanded category at each level: Map<level, categoryId>
    const [levelExpanded, setLevelExpanded] = useState<Map<number, number>>(new Map());
    // Track fetched contents: Map<categoryId, contents>
    const [expandedMap, setExpandedMap] = useState<Map<number, { type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[] }>>(new Map());
    // Track loading state
    const [loading, setLoading] = useState<number | null>(null);

    const handleCategoryExpand = async (categoryId: number, level: number) => {
        const currentExpanded = levelExpanded.get(level);

        // If clicking the same category, collapse it and all children
        if (currentExpanded === categoryId) {
            const newLevelExpanded = new Map(levelExpanded);
            // Remove this level and all deeper levels
            for (const [l] of newLevelExpanded) {
                if (l >= level) {
                    newLevelExpanded.delete(l);
                }
            }
            setLevelExpanded(newLevelExpanded);
            return;
        }

        // Expand new category, collapse deeper levels
        const newLevelExpanded = new Map(levelExpanded);
        // Remove all deeper levels
        for (const [l] of newLevelExpanded) {
            if (l >= level) {
                newLevelExpanded.delete(l);
            }
        }
        newLevelExpanded.set(level, categoryId);
        setLevelExpanded(newLevelExpanded);

        // Fetch contents if not already cached
        if (!expandedMap.has(categoryId)) {
            setLoading(categoryId);
            try {
                const contents = await fetchCategoryContents(categoryId);
                setExpandedMap(new Map(expandedMap).set(categoryId, contents));
            } catch (error) {
                console.error("Failed to fetch category contents:", error);
            }
            setLoading(null);
        }
    };

    // Build the hierarchy to display
    const displayLevels: Array<{ title: string; type: "categories" | "products"; items: CategoryWithPath[] | ProductWithPath[]; level: number }> = [];

    // Level 0: Top categories (Products)
    displayLevels.push({
        title: "",
        type: "categories",
        items: initialCategories,
        level: 0,
    });

    // Add expanded levels
    let currentLevel = 0;
    while (levelExpanded.has(currentLevel)) {
        const expandedCategoryId = levelExpanded.get(currentLevel)!;
        const contents = expandedMap.get(expandedCategoryId);

        if (contents && contents.items.length > 0) {
            // Find the expanded category name for the section title
            let categoryName = "Items";
            // Search in previous levels' categories only
            for (const levelData of displayLevels) {
                if (levelData.type === "categories") {
                    const found = (levelData.items as CategoryWithPath[]).find((cat) => cat.id === expandedCategoryId);
                    if (found) {
                        categoryName = found.name;
                        break;
                    }
                }
            }

            displayLevels.push({
                title: categoryName,
                type: contents.type,
                items: contents.items,
                level: currentLevel + 1,
            });
        }
        currentLevel++;
    }

    return (
        <div className="w-full">
            {displayLevels.map((levelData) => (
                <LevelSection
                    key={`${levelData.level}-${levelData.title}`}
                    title={levelData.title}
                    items={levelData.items}
                    type={levelData.type}
                    level={levelData.level}
                    onCategoryExpand={handleCategoryExpand}
                    levelExpanded={levelExpanded}
                />
            ))}

            {/* Loading indicator */}
            {loading !== null && (
                <div className="flex justify-center py-8">
                    <div className="border-primary-600 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                </div>
            )}
        </div>
    );
}
