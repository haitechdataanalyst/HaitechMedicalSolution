/**
 * Repository Interfaces
 *
 * These interfaces define the data access contract for the application.
 * Currently implemented by JSON file-based repositories (services/json/).
 * When a backend/database is introduced, create new implementations
 * (e.g., services/api/) that satisfy the same interfaces.
 *
 * To switch data sources, update the re-exports in services/index.ts.
 */

import {
    Product,
    Category,
    Breadcrumb,
    Frame,
    HeadlightsData,
    HeadlightCategory,
    MedesyData,
    MedesyCategory,
} from "@/types";

// ------------------------------------------------------------------
// Product Repository
// ------------------------------------------------------------------

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product | null>;
    getBySlug(slug: string): Promise<Product | null>;
    getByCategory(categoryId: number): Promise<Product[]>;
    getRelated(product: Product): Promise<Product[]>;
    getAccessories(product: Product): Promise<Product[]>;
    getImage(product: Product): string;
    getPath(product: Product): Promise<string>;
    getBreadcrumbs(product: Product): Promise<Breadcrumb[]>;
    getRandomForEachCategory(count: number): Promise<Product[]>;
}

// ------------------------------------------------------------------
// Category Repository
// ------------------------------------------------------------------

export interface ICategoryRepository {
    getAll(): Promise<Category[]>;
    getById(id: number): Promise<Category | null>;
    getBySlug(slug: string): Promise<Category | null>;
    getTopLevel(): Promise<Category[]>;
    getChildren(parentId: number): Promise<Category[]>;
    getContents(categoryId: number): Promise<{ type: "categories" | "products"; items: Category[] | Product[] }>;
    getPath(category: Category): Promise<string>;
    getBreadcrumbs(category: Category): Promise<Breadcrumb[]>;
}

// ------------------------------------------------------------------
// Catalog Service (high-level operations spanning products + categories)
// ------------------------------------------------------------------

export interface ICatalogService {
    resolvePathToEntity(pathSegments: string[]): Promise<{ type: "category" | "product"; entity: Category | Product } | null>;
    getAllStaticPaths(): Promise<string[][]>;
}

// ------------------------------------------------------------------
// Frame Repository
// ------------------------------------------------------------------

export interface IFrameRepository {
    getAll(): Frame[];
    getById(id: string): Frame | null;
}

// ------------------------------------------------------------------
// Headlight Repository
// ------------------------------------------------------------------

export interface IHeadlightRepository {
    getData(): Promise<HeadlightsData>;
    getCategories(): Promise<HeadlightCategory[]>;
    getCategoryById(id: string): Promise<HeadlightCategory | null>;
}

// ------------------------------------------------------------------
// Medesy Repository
// ------------------------------------------------------------------

export interface IMedesyRepository {
    getData(): MedesyData;
    getCategories(): MedesyCategory[];
    getCategoryById(id: string): MedesyCategory | null;
}
