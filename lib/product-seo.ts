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

const META_DESCRIPTION_MAX = 160;
const META_DESCRIPTION_SUFFIX = " Supplied in India by Haitech Medical.";

/**
 * The longest start of `text` that fits in `room` characters and ends where a sentence or clause ends, so a long
 * description is shortened without an ellipsis and without cutting a phrase in half. Only the product's own words are used.
 */
function shortenAtClause(text: string, room: number): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= room) return clean;
    const boundary = /[.!?;,:]\s|\s[—–-]\s/g;
    let cut = 0;
    for (let m = boundary.exec(clean); m && m.index <= room; m = boundary.exec(clean)) cut = m.index;
    const clipped = cut > 0 ? clean.slice(0, cut) : clean.slice(0, room).replace(/\s+\S*$/, "");
    return clipped.replace(/[\s,;:—–-]+$/, "");
}

/** "<Brand Name>: <the product's own description>. Supplied in India by Haitech Medical." in at most 160 characters. */
export function productMetaDescription(product: Product): string {
    const block = product.contentBlocks.find((b) => b.type === "description");
    const summary = product.description || (block?.type === "description" ? block.data.primary : "") || productNameWithBrand(product);
    const lead = `${productNameWithBrand(product)}: `;
    // The closing sentence and the final full stop are kept; the description gives way.
    const room = META_DESCRIPTION_MAX - lead.length - META_DESCRIPTION_SUFFIX.length - 1;
    const body = shortenAtClause(summary, room).replace(/[.!?]+$/, "");
    return `${lead}${body}.${META_DESCRIPTION_SUFFIX}`;
}
