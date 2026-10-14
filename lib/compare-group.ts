// Which products may be compared with each other.
//
// Only products from the same category family can share a comparison: Admetec Ergo, Galilean and Prismatic
// loupes compare with each other; a Salli saddle chair never sits next to loupes.
//
// A product's group is its equipment-type hub when its category (or any parent category) belongs to one
// (lib/hubs.ts: "Dental Loupes", "Saddle Chairs", …); otherwise it is the product's own category.
//
// Pure and dependency-free so the rule can be tested directly.

export interface CompareGroup {
    /** Stable identity: two products are comparable only when their group keys match. */
    key: string;
    /** Shown to the shopper, e.g. "Dental Loupes". */
    label: string;
}

interface CategoryLike {
    id: number;
    slug: string;
    name: string;
    parent: number | null;
}

interface HubLike {
    slug: string;
    name: string;
    productCategories: string[];
}

export function createCompareGroupResolver(categories: CategoryLike[], hubs: HubLike[]): (categoryId: number) => CompareGroup {
    const byId = new Map(categories.map((category) => [category.id, category]));

    return (categoryId) => {
        const own = byId.get(categoryId);
        // Walk up the tree: a loupe in "Ergo Loupes" belongs to the hub that lists "ergo-loupes".
        let node: CategoryLike | undefined = own;
        for (let depth = 0; node && depth < 10; depth += 1) {
            const slug = node.slug;
            const hub = hubs.find((candidate) => candidate.productCategories.includes(slug));
            if (hub) return { key: `hub:${hub.slug}`, label: hub.name };
            node = node.parent === null ? undefined : byId.get(node.parent);
        }
        return { key: `category:${categoryId}`, label: own?.name ?? "this category" };
    };
}

export type CompareBlockReason = "full" | "different-group" | null;

/** Why a product cannot be added to the current comparison, or null if it can. */
export function getCompareBlockReason(current: CompareGroup[], candidate: CompareGroup, maxItems: number): CompareBlockReason {
    if (current.length > 0 && current[0].key !== candidate.key) return "different-group";
    if (current.length >= maxItems) return "full";
    return null;
}
