import type { Category } from "@/types";

// The one place that walks the category parent chain. Every category URL, breadcrumb, route match and static
// path is built from these, so a change to the tree rules is made here once. Pure, so it can be tested directly.

/** Guards against a cycle in bad data; real trees are 3 levels deep. */
const MAX_DEPTH = 20;

export type CategoryById = Map<number, Category>;

export function indexCategories(categories: Category[]): CategoryById {
    return new Map(categories.map((c) => [c.id, c]));
}

/** The chain from the root category down to `category` (inclusive). */
export function categoryTrail(category: Category, byId: CategoryById): Category[] {
    const trail: Category[] = [];
    let cur: Category | undefined = category;
    for (let depth = 0; cur && depth < MAX_DEPTH; depth += 1) {
        trail.unshift(cur);
        cur = cur.parent !== null ? byId.get(cur.parent) : undefined;
    }
    return trail;
}

/** Slugs from the root down to `category`, joined: "admetec/prismatic-loupes". */
export function categorySlugPath(category: Category, byId: CategoryById): string {
    return categoryTrail(category, byId)
        .map((c) => c.slug)
        .join("/");
}
