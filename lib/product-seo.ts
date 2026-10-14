/**
 * One naming rule shared by product titles, image alt text and schema, built
 * only from catalog fields (brand from SKU, product name, category name).
 * Pure, so client components can import it.
 */
import { Product } from "@/types";
import { detectBrand } from "@/lib/brand";

/** "A0" -> "Strauss A0"; names that already carry the brand are left alone. */
export function productNameWithBrand(product: Pick<Product, "name" | "sku">): string {
    const brand = detectBrand(product.sku).name;
    return product.name.toLowerCase().includes(brand.toLowerCase()) ? product.name : `${brand} ${product.name}`;
}

/** Descriptive, non-repetitive alt text for a product photo. */
export function productImageAlt(product: Pick<Product, "name" | "sku">, view?: number): string {
    const base = productNameWithBrand(product);
    return view && view > 1 ? `${base}, view ${view}` : base;
}

/**
 * "Strauss A0 – Round Burs". The category label is added only when the name
 * does not already say what the product is.
 */
export function productPageTitle(product: Pick<Product, "name" | "sku">, typeLabel?: string): string {
    const name = productNameWithBrand(product);
    if (!typeLabel) return name;
    const singular = typeLabel.toLowerCase().replace(/s$/, "");
    return name.toLowerCase().includes(singular) ? name : `${name} – ${typeLabel}`;
}

/** Below this a stored category description is usually just the name again ("Bondent Group Endo") and says nothing. */
const MIN_USEFUL_DESCRIPTION = 70;
const LISTED_ITEMS = 3;

/**
 * A category's own description when it says something; otherwise a sentence built from what the category
 * really lists (its product or subcategory names), so no two category pages share a vague description.
 */
export function categoryMetaDescription(name: string, description: string | undefined, itemNames: string[]): string {
    const own = description?.replace(/\s+/g, " ").trim();
    if (own && own.length >= MIN_USEFUL_DESCRIPTION) return own;
    if (itemNames.length === 0) return `Browse ${name} at Haitech Medical, India.`;
    const listed = itemNames.slice(0, LISTED_ITEMS).join(", ");
    return `Browse ${name} from Haitech Medical: ${listed}${itemNames.length > LISTED_ITEMS ? " and more" : ""}. Supplied in India.`;
}

export function productMetaDescription(product: Product): string {
    const block = product.contentBlocks.find((b) => b.type === "description");
    const summary = product.description || (block?.type === "description" ? block.data.primary : "") || productNameWithBrand(product);
    const sentence = /[.!?]$/.test(summary.trim()) ? summary.trim() : `${summary.trim()}.`;
    return `${productNameWithBrand(product)}: ${sentence} Supplied in India by Haitech Medical.`;
}
