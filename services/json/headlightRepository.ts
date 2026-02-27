/**
 * JSON-backed Headlight Repository
 */

import { getHeadlightsData, getHeadlightCategories, getHeadlightCategoryById } from "@/lib/catalog";
import type { IHeadlightRepository } from "../interfaces";
import type { HeadlightsData, HeadlightCategory } from "@/types";

export class JsonHeadlightRepository implements IHeadlightRepository {
    async getData(): Promise<HeadlightsData> {
        return getHeadlightsData();
    }

    async getCategories(): Promise<HeadlightCategory[]> {
        return getHeadlightCategories();
    }

    async getCategoryById(id: string): Promise<HeadlightCategory | null> {
        return getHeadlightCategoryById(id);
    }
}
