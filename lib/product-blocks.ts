import type { Product } from "@/types";

export interface SpecRow {
    label: string;
    value: string;
}

/**
 * Every spec row on a product, across all "specifications" blocks. Data uses either `rows` or the older `specs`
 * field; this is the one place that knows about the alias.
 */
export function specRows(product: Product): SpecRow[] {
    return (product.contentBlocks ?? []).flatMap((b) => (b.type === "specifications" ? (b.data.rows ?? b.data.specs ?? []) : []));
}
