/**
 * JSON-backed Catalog Service
 *
 * High-level catalog operations that span products and categories.
 */

import { resolvePathToEntity, getAllStaticPaths } from "@/lib/catalog";
import type { ICatalogService } from "../interfaces";
import type { Category, Product } from "@/types";

export class JsonCatalogService implements ICatalogService {
    resolvePathToEntity(pathSegments: string[]): Promise<{ type: "category" | "product"; entity: Category | Product } | null> {
        return resolvePathToEntity(pathSegments);
    }

    getAllStaticPaths(): Promise<string[][]> {
        return getAllStaticPaths();
    }
}
