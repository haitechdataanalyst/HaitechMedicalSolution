import fs from "fs";
import path from "path";

export type ItemType = "Sale" | "Demo" | "Spare" | "Cancelled";

export type InventoryItem = {
    ItemID: string;
    OriginalName: string;
    OriginalSKU: string;
    Brand: string;
    Category: string;
    Subcategory: string;
    ProductName: string;
    ItemType: ItemType;
    Variant: string;
    Color: string;
    Model: string;
    StandardSKU: string;
    SellingPrice: number;
    MRP: number;
    StockOnHand: number;
    HSN: string;
    Unit: string;
    ZohoStatus: string;
};

type InventoryJSON = Record<
    string,
    Record<string, Record<string, { count: number; stock: number; item_types: Record<string, number>; items: InventoryItem[] }>>
>;

// Brands shown as primary filters; anything else is grouped as "Other"
export const PRIMARY_BRANDS = ["Medesy", "Strauss", "Admetec", "Salli", "Almadent"] as const;

let flatCache: InventoryItem[] | null = null;

export function getAllInventoryItems(): InventoryItem[] {
    if (flatCache) return flatCache;
    const filePath = path.join(process.cwd(), "data", "structured_inventory.json");
    const raw: InventoryJSON = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const items: InventoryItem[] = [];
    for (const cats of Object.values(raw)) {
        for (const subcats of Object.values(cats)) {
            for (const { items: group } of Object.values(subcats)) {
                items.push(...group);
            }
        }
    }
    // Exclude cancelled and inactive
    flatCache = items.filter((i) => i.ItemType !== "Cancelled" && i.ZohoStatus === "Active");
    return flatCache;
}

export type FilterParams = {
    search?: string;
    brands?: string[];
    categories?: string[];
    subcategories?: string[];
    itemTypes?: string[];
    inStockOnly?: boolean;
    sort?: "name" | "price-asc" | "price-desc" | "stock";
    page?: number;
};

export const PAGE_SIZE = 24;

export function filterInventory(items: InventoryItem[], params: FilterParams) {
    let result = items;

    if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
            (i) =>
                i.ProductName.toLowerCase().includes(q) ||
                i.OriginalName.toLowerCase().includes(q) ||
                i.StandardSKU.toLowerCase().includes(q) ||
                i.OriginalSKU.toLowerCase().includes(q) ||
                i.Brand.toLowerCase().includes(q) ||
                i.Category.toLowerCase().includes(q) ||
                i.Subcategory.toLowerCase().includes(q)
        );
    }

    if (params.brands?.length) {
        result = result.filter((i) => params.brands!.includes(i.Brand));
    }

    if (params.categories?.length) {
        result = result.filter((i) => params.categories!.includes(i.Category));
    }

    if (params.subcategories?.length) {
        result = result.filter((i) => params.subcategories!.includes(i.Subcategory));
    }

    if (params.itemTypes?.length) {
        result = result.filter((i) => params.itemTypes!.includes(i.ItemType));
    }

    if (params.inStockOnly) {
        result = result.filter((i) => i.StockOnHand > 0);
    }

    switch (params.sort) {
        case "price-asc":
            result = [...result].sort((a, b) => a.SellingPrice - b.SellingPrice);
            break;
        case "price-desc":
            result = [...result].sort((a, b) => b.SellingPrice - a.SellingPrice);
            break;
        case "stock":
            result = [...result].sort((a, b) => b.StockOnHand - a.StockOnHand);
            break;
        case "name":
        default:
            result = [...result].sort((a, b) => a.ProductName.localeCompare(b.ProductName));
    }

    const total = result.length;
    const page = params.page ?? 1;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paged = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { items: paged, total, totalPages, page };
}

export function getInventoryFacets(items: InventoryItem[]) {
    const brands = new Map<string, number>();
    const categories = new Map<string, number>();
    const subcategories = new Map<string, number>();
    const itemTypes = new Map<string, number>();

    for (const item of items) {
        brands.set(item.Brand, (brands.get(item.Brand) ?? 0) + 1);
        categories.set(item.Category, (categories.get(item.Category) ?? 0) + 1);
        subcategories.set(item.Subcategory, (subcategories.get(item.Subcategory) ?? 0) + 1);
        itemTypes.set(item.ItemType, (itemTypes.get(item.ItemType) ?? 0) + 1);
    }

    const sortDesc = (m: Map<string, number>) =>
        [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));

    return {
        brands: sortDesc(brands),
        categories: sortDesc(categories),
        subcategories: sortDesc(subcategories),
        itemTypes: sortDesc(itemTypes),
    };
}
