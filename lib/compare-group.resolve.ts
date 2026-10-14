import categories from "@/data/categories.json";
import { createCompareGroupResolver } from "./compare-group";
import { HUBS } from "./hubs";

/** The comparison group for a product, from its category id. Built from the catalogue's category tree and the equipment-type hubs. */
export const getCompareGroup = createCompareGroupResolver(categories, HUBS);
