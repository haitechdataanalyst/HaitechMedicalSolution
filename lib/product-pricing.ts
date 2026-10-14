import type { CustomField, Product } from "@/types";

type PricedOption = { value: string; label: string; price?: number };

/** The custom fields of a product's actions block (empty when it has none). */
function customFieldsOf(product: Pick<Product, "contentBlocks">): CustomField[] {
    const actions = product.contentBlocks.find((b) => b.type === "actions");
    return actions?.type === "actions" ? (actions.data.customFields ?? []) : [];
}

/** Every option price a product defines, e.g. one per Prismatic magnification. */
export function optionPrices(product: Pick<Product, "contentBlocks">): number[] {
    return customFieldsOf(product)
        .flatMap((field) => field.options ?? [])
        .flatMap((option) => (typeof option === "object" && typeof option.price === "number" ? [option.price] : []));
}

/** True when the headline price is only the lowest of several: it is shown as "From …". */
export function startsFrom(product: Pick<Product, "contentBlocks">): boolean {
    return new Set(optionPrices(product)).size > 1;
}

/** The price of the option the visitor chose (field name -> chosen value), when that option has one. */
export function chosenOptionPrice(product: Pick<Product, "contentBlocks">, chosen: Record<string, string | number>): number | undefined {
    for (const field of customFieldsOf(product)) {
        const value = chosen[field.name ?? ""];
        const option = (field.options ?? []).find((o): o is PricedOption => typeof o === "object" && o.value === value);
        if (option?.price !== undefined) return option.price;
    }
    return undefined;
}
