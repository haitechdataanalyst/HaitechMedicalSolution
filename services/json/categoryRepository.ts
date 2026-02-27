/**
 * JSON-backed Category Repository
 *
 * Wraps the existing lib/catalog.ts functions behind the ICategoryRepository interface.
 * When migrating to a backend, create services/api/categoryRepository.ts instead.
 */

import {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getTopCategories,
    getChildCategories,
    getCategoryContents,
    getCategoryPath,
    getCategoryBreadcrumbs,
} from "@/lib/catalog";
import type { ICategoryRepository } from "../interfaces";
import type { Category, Product, Breadcrumb } from "@/types";

export class JsonCategoryRepository implements ICategoryRepository {
    getAll(): Category[] {
        return getAllCategories();
    }

    getById(id: number): Category | null {
        return getCategoryById(id);
    }

    getBySlug(slug: string): Category | null {
        return getCategoryBySlug(slug);
    }

    getTopLevel(): Category[] {
        return getTopCategories();
    }

    getChildren(parentId: number): Category[] {
        return getChildCategories(parentId);
    }

    getContents(categoryId: number): { type: "categories" | "products"; items: Category[] | Product[] } {
        return getCategoryContents(categoryId);
    }

    getPath(category: Category): string {
        return getCategoryPath(category);
    }

    getBreadcrumbs(category: Category): Breadcrumb[] {
        return getCategoryBreadcrumbs(category);
    }
}
