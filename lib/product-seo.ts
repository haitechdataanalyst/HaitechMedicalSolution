/**
 * One naming rule shared by product titles, image alt text and schema, built
 * only from catalog fields (brand from SKU, product name, category name).
 * Pure, so client components can import it.
 */
import { Product } from "@/types";
import { specRows } from "@/lib/product-blocks";
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

const META_SUFFIX = " Supplied in India by Haitech Medical.";
/** Search results show roughly 120-160 characters; buildMetadata clamps at the upper end. */
const META_MIN_LENGTH = 120;
const META_MAX_LENGTH = 160;
const MAX_SPEC_FACTS = 2;
const MAX_SPEC_VALUE_LENGTH = 32;

/** Short "Label value" facts from the product's own specification table, in table order, skipping anything the summary already says. */
function specFacts(product: Product, summary: string): string[] {
    const said = summary.toLowerCase();
    return specRows(product)
        .map((row) => ({ label: row.label?.trim(), value: row.value?.trim() }))
        .filter((row): row is { label: string; value: string } => Boolean(row.label && row.value) && row.value.length <= MAX_SPEC_VALUE_LENGTH && !said.includes(row.value.toLowerCase()))
        .map((row) => `${row.label} ${row.value}`);
}

/**
 * "<Brand name>: <summary> Supplied in India by Haitech Medical." When that is too short to use the space a search
 * result offers, up to two key facts from the product's specification table are added. Nothing is written that the
 * catalogue does not already hold.
 */
export function productMetaDescription(product: Product): string {
    const block = product.contentBlocks.find((b) => b.type === "description");
    const summary = product.description || (block?.type === "description" ? block.data.primary : "") || productNameWithBrand(product);
    const sentence = /[.!?]$/.test(summary.trim()) ? summary.trim() : `${summary.trim()}.`;
    const lead = `${productNameWithBrand(product)}: ${sentence}`;

    const facts: string[] = [];
    for (const fact of specFacts(product, summary)) {
        if (facts.length === MAX_SPEC_FACTS || lead.length + META_SUFFIX.length >= META_MIN_LENGTH) break;
        const next = [...facts, fact];
        const candidate = `${lead} ${next.join("; ")}.${META_SUFFIX}`;
        if (candidate.length > META_MAX_LENGTH) break;
        facts.push(fact);
        if (candidate.length >= META_MIN_LENGTH) break;
    }
    return facts.length > 0 ? `${lead} ${facts.join("; ")}.${META_SUFFIX}` : `${lead}${META_SUFFIX}`;
}
