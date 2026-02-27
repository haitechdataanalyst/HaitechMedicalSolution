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
    getAll(): Product[];
    getById(id: number): Product | null;
    getBySlug(slug: string): Product | null;
    getByCategory(categoryId: number): Product[];
    getRelated(product: Product): Product[];
    getAccessories(product: Product): Product[];
    getImage(product: Product): string;
    getPath(product: Product): string;
    getBreadcrumbs(product: Product): Breadcrumb[];
    getRandomForEachCategory(count: number): Product[];
}

// ------------------------------------------------------------------
// Category Repository
// ------------------------------------------------------------------

export interface ICategoryRepository {
    getAll(): Category[];
    getById(id: number): Category | null;
    getBySlug(slug: string): Category | null;
    getTopLevel(): Category[];
    getChildren(parentId: number): Category[];
    getContents(categoryId: number): { type: "categories" | "products"; items: Category[] | Product[] };
    getPath(category: Category): string;
    getBreadcrumbs(category: Category): Breadcrumb[];
}

// ------------------------------------------------------------------
// Catalog Service (high-level operations spanning products + categories)
// ------------------------------------------------------------------

export interface ICatalogService {
    resolvePathToEntity(pathSegments: string[]): { type: "category" | "product"; entity: Category | Product } | null;
    getAllStaticPaths(): string[][];
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
