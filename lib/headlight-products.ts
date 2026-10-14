import type { ContentBlock, HeadlightCategory, HeadlightProduct, HeadlightsData, Product } from "@/types";
import { cleanText, parseFeatures } from "@/lib/headlight-specs";

// Admetec headlights live in data/headlights.json, not in the products table. These helpers turn each model into a
// catalogue Product so it gets the same product page, quote request, compare and search as a loupe — without the
// database having to know about it. Pure, so it can be checked directly.

/** The catalogue category the lights belong to (data/categories.json: "Lights" under Admetec). */
export const HEADLIGHT_CATEGORY_SLUG = "admetec-headlights";

/**
 * Light products carry synthetic ids from here up, far above any real product id. A synthetic id must never reach
 * the backend: leads and wishlists reference products.id, so they would fail on a row that does not exist.
 */
export const HEADLIGHT_ID_BASE = 9_000_000;

/** True for a product that exists in the products table (and so may be sent to the backend by id). */
export function isCatalogueProductId(id: number): boolean {
    return id < HEADLIGHT_ID_BASE;
}

/** SKU in the catalogue's brand-prefixed style ("ADM-FLAMINGO"); the ADM prefix makes it an Admetec, quote-only product. */
export function headlightSku(slug: string): string {
    return `ADM-${slug.toUpperCase()}`;
}

function modelBlocks(model: HeadlightProduct, category: HeadlightCategory): ContentBlock[] {
    const { specs, notes } = parseFeatures(model.features);
    const rows = [...specs, ...(model.bestFor ? [{ label: "Best for", value: model.bestFor }] : [])];
    const benefits = model.isAccessory ? [] : (category.benefits ?? []);
    const inTheCase = model.isAccessory ? [] : (category.inTheBox?.items ?? []);
    const description = [cleanText(model.description), ...notes].join(" ");

    return [
        { type: "hero", data: { primaryImage: model.image, gallery: [model.image] } },
        {
            type: "description",
            data: {
                primary: description,
                // "1. Title: text" items render as the feature cards used on other product pages.
                secondary: benefits.length > 0 ? benefits.map((b, i) => `${i + 1}. ${cleanText(b.title)}: ${cleanText(b.text)}`).join(" ") : undefined,
            },
        },
        ...(rows.length > 0 ? [{ type: "specifications" as const, data: { title: "Technical Specifications", rows } }] : []),
        { type: "info", data: { manufacturer: "Admetec", packageContents: inTheCase.length > 0 ? inTheCase.map(cleanText) : undefined } },
        // addToCart opens the quote request for Admetec; it is never an instant checkout.
        { type: "actions", data: { addToCart: true, customization: false } },
    ];
}

/** Every light as a catalogue Product, with stable synthetic ids in file order; accessories link from the models they fit. */
export function headlightProducts(data: HeadlightsData, categoryId: number): Product[] {
    const flat = data.categories.flatMap((category) => category.products.map((model) => ({ category, model })));
    const idOf = new Map(flat.map(({ model }, index) => [model.id, HEADLIGHT_ID_BASE + index + 1]));

    return flat.map(({ category, model }, index) => {
        const accessoryIds = model.isAccessory
            ? []
            : category.products
                  .filter((p) => p.isAccessory)
                  .map((p) => idOf.get(p.id))
                  .filter((id): id is number => id !== undefined);
        return {
            id: HEADLIGHT_ID_BASE + index + 1,
            slug: model.id,
            name: cleanText(model.name),
            description: cleanText(model.description),
            category: categoryId,
            order: index,
            sku: headlightSku(model.id),
            hasVariants: false,
            defaultImage: model.image,
            gallery: [model.image],
            contentBlocks: modelBlocks(model, category),
            accessories: accessoryIds.length > 0 ? accessoryIds : undefined,
        };
    });
}
