/**
 * JSON-backed Product Repository
 *
 * Wraps the existing lib/catalog.ts functions behind the IProductRepository interface.
 * When migrating to a backend, create services/api/productRepository.ts instead.
 */

import {
    getAllProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getRelatedProducts,
    getProductAccessories,
    getProductImage,
    getProductPath,
    getProductBreadcrumbs,
    getRandomProductsForEachCategory,
} from "@/lib/catalog";
import type { IProductRepository } from "../interfaces";
import type { Product, Breadcrumb } from "@/types";

export class JsonProductRepository implements IProductRepository {
    getAll(): Product[] {
        return getAllProducts();
    }

    getById(id: number): Product | null {
        return getProductById(id);
    }

    getBySlug(slug: string): Product | null {
        return getProductBySlug(slug);
    }

    getByCategory(categoryId: number): Product[] {
        return getProductsByCategory(categoryId);
    }

    getRelated(product: Product): Product[] {
        return getRelatedProducts(product);
    }

    getAccessories(product: Product): Product[] {
        return getProductAccessories(product);
    }

    getImage(product: Product): string {
        return getProductImage(product);
    }

    getPath(product: Product): string {
        return getProductPath(product);
    }

    getBreadcrumbs(product: Product): Breadcrumb[] {
        return getProductBreadcrumbs(product);
    }

    getRandomForEachCategory(count: number): Product[] {
        return getRandomProductsForEachCategory(count);
    }
}
