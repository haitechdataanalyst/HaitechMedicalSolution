/**
 * Service Layer — Single Entry Point
 *
 * This file instantiates the active repository implementations and exports them.
 * To swap from JSON files to an API/database backend:
 *   1. Create new implementations in services/api/ that satisfy the same interfaces
 *   2. Change the imports below from ./json to ./api
 *   3. Everything else in the app continues to work unchanged
 *
 * Usage in pages/components:
 *   import { productRepo, categoryRepo } from "@/services";
 *   const products = productRepo.getAll();
 */

import {
    JsonProductRepository,
    JsonCategoryRepository,
    JsonCatalogService,
    JsonFrameRepository,
    JsonHeadlightRepository,
    JsonMedesyRepository,
} from "./json";

// Active repository instances — swap these when connecting a backend
export const productRepo = new JsonProductRepository();
export const categoryRepo = new JsonCategoryRepository();
export const catalogService = new JsonCatalogService();
export const frameRepo = new JsonFrameRepository();
export const headlightRepo = new JsonHeadlightRepository();
export const medesyRepo = new JsonMedesyRepository();

// Re-export interfaces for consumers that need to type against them
export type {
    IProductRepository,
    ICategoryRepository,
    ICatalogService,
    IFrameRepository,
    IHeadlightRepository,
    IMedesyRepository,
} from "./interfaces";
