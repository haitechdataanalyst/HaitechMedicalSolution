// Run: node --test tests/category-tree.test.ts   (Node 22.6+ strips types natively)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { categorySlugPath, categoryTrail, indexCategories } from "../lib/category-tree.ts";

type Cat = { id: number; slug: string; name: string; parent: number | null };
const all = JSON.parse(readFileSync("data/categories.json", "utf-8")) as Cat[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const byId = indexCategories(all as any);

// The loop that used to be copied four times in lib/catalog.ts.
function legacySlugPath(cat: Cat): string {
    const parts: string[] = [];
    let cur: Cat | undefined = cat;
    while (cur) {
        parts.unshift(cur.slug);
        cur = cur.parent !== null ? all.find((c) => c.id === cur!.parent) : undefined;
    }
    return parts.join("/");
}

test("slug path matches the legacy loop for every real category", () => {
    for (const cat of all) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assert.equal(categorySlugPath(cat as any, byId), legacySlugPath(cat), cat.slug);
    }
});

test("trail runs root-first and ends at the category", () => {
    const child = all.find((c) => c.parent !== null)!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trail = categoryTrail(child as any, byId);
    assert.equal(trail[0].parent, null);
    assert.equal(trail.at(-1)!.id, child.id);
});

test("a parent cycle in bad data terminates instead of hanging", () => {
    const a = { id: 1, slug: "a", name: "A", parent: 2 };
    const b = { id: 2, slug: "b", name: "B", parent: 1 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = indexCategories([a, b] as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.ok(categoryTrail(a as any, index).length <= 20);
});
