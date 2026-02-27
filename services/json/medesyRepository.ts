/**
 * JSON-backed Medesy Repository
 */

import { getMedesyData, getMedesyCategories, getMedesyCategoryById } from "@/lib/catalog";
import type { IMedesyRepository } from "../interfaces";
import type { MedesyData, MedesyCategory } from "@/types";

export class JsonMedesyRepository implements IMedesyRepository {
    getData(): MedesyData {
        return getMedesyData();
    }

    getCategories(): MedesyCategory[] {
        return getMedesyCategories();
    }

    getCategoryById(id: string): MedesyCategory | null {
        return getMedesyCategoryById(id);
    }
}
