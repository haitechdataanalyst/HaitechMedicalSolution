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
    getAll(): Promise<Product[]> {
        return getAllProducts();
    }

    getById(id: number): Promise<Product | null> {
        return getProductById(id);
    }

    getBySlug(slug: string): Promise<Product | null> {
        return getProductBySlug(slug);
    }

    getByCategory(categoryId: number): Promise<Product[]> {
        return getProductsByCategory(categoryId);
    }

    getRelated(product: Product): Promise<Product[]> {
        return getRelatedProducts(product);
    }

    getAccessories(product: Product): Promise<Product[]> {
        return getProductAccessories(product);
    }

    getImage(product: Product): string {
        return getProductImage(product);
    }

    getPath(product: Product): Promise<string> {
        return getProductPath(product);
    }

    getBreadcrumbs(product: Product): Promise<Breadcrumb[]> {
        return getProductBreadcrumbs(product);
    }

    getRandomForEachCategory(count: number): Promise<Product[]> {
        return getRandomProductsForEachCategory(count);
    }
}
