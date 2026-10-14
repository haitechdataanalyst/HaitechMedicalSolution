// Builds data/url-redirects.json: permanent redirects from catalogue URLs that used to exist to where the same thing lives now.
//
//   node scripts/build-url-redirects.mjs              # every snapshot of the catalogue files in git history
//   node scripts/build-url-redirects.mjs --since 2026-07-30
//
// A destination is "known" only when the same category or product (matched by id, which survives renames and moves)
// still exists at a different path. A category that was removed redirects only if its products survive elsewhere, to the
// category that now holds most of them. Anything else was retired with no equivalent and is left to return 404.
// Redirects never point at another redirect, and a path that is live today is never redirected.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const since = args.includes("--since") ? args[args.indexOf("--since") + 1] : null;
const CATEGORIES = "data/categories.json";
const PRODUCTS = "data/products.json";
const OUT = "data/url-redirects.json";
const ROUTE_PREFIX = "/product-category";
// path-to-regexp treats these as syntax in next.config redirect sources.
const UNSAFE_IN_SOURCE = /[()*+?:{}\\[\]|]/;

// Ids are reused: a retired Medesy id later named a different instrument ("Heidbrink Elevator 700/10" -> "Lussatore
// Elevator"). Redirecting on id alone would send visitors to the wrong product, so the old and new names must still
// describe the same thing (at least half of their words in common) before a destination counts as known.
const tokens = (s) => new Set(String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean));
const MIN_SHARED_WORDS = 0.5;
function sameThing(a, b) {
    const left = tokens(a);
    const right = tokens(b);
    const shared = [...left].filter((t) => right.has(t)).length;
    return shared / Math.max(left.size, right.size, 1) >= MIN_SHARED_WORDS;
}
let skippedAsDifferentThing = 0;

const git = (...gitArgs) => execFileSync("git", gitArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const readAt = (commit, file) => {
    try {
        return JSON.parse(git("show", `${commit}:${file}`));
    } catch {
        return null; // the file did not exist yet in that commit
    }
};

/** { categoryPath(id), productPath(product) } for one snapshot of the two files. */
function paths(categories, products) {
    const byId = new Map(categories.map((c) => [c.id, c]));
    const cache = new Map();
    const categoryPath = (id) => {
        if (cache.has(id)) return cache.get(id);
        const segments = [];
        for (let node = byId.get(id), guard = 0; node && guard < 12; node = node.parent === null ? undefined : byId.get(node.parent), guard += 1) segments.unshift(node.slug);
        const value = segments.length ? `${ROUTE_PREFIX}/${segments.join("/")}` : null;
        cache.set(id, value);
        return value;
    };
    const productPath = (p) => {
        const base = categoryPath(p.category);
        return base ? `${base}/${p.slug}` : null;
    };
    return { categories: byId, categoryPath, productPath, products: new Map(products.map((p) => [p.id, p])) };
}

const nowCategories = JSON.parse(readFileSync(CATEGORIES, "utf8"));
const nowProducts = JSON.parse(readFileSync(PRODUCTS, "utf8"));
const now = paths(nowCategories, nowProducts);
const livePaths = new Set([...nowCategories.map((c) => now.categoryPath(c.id)), ...nowProducts.map((p) => now.productPath(p))].filter(Boolean));

const log = git("log", "--format=%H", ...(since ? [`--since=${since}`] : []), "--", CATEGORIES, PRODUCTS)
    .split("\n")
    .filter(Boolean);

const found = new Map(); // from -> { to, reason }
const note = (from, to, reason) => {
    if (!from || !to || from === to || livePaths.has(from) || UNSAFE_IN_SOURCE.test(from)) return;
    if (!found.has(from)) found.set(from, { to, reason });
};

for (const commit of log) {
    const oldCategories = readAt(commit, CATEGORIES);
    const oldProducts = readAt(commit, PRODUCTS) ?? [];
    if (!oldCategories) continue;
    const before = paths(oldCategories, oldProducts);
    const label = commit.slice(0, 7);

    for (const category of oldCategories) {
        const from = before.categoryPath(category.id);
        const kept = now.categories.get(category.id);
        if (kept && sameThing(category.name, kept.name)) {
            note(from, now.categoryPath(category.id), `category ${category.id} moved or renamed (seen in ${label})`);
            continue;
        }
        if (kept) skippedAsDifferentThing += 1; // the id now names a different category: treat the old one as retired
        // Removed category: follow its products, if any survive, to the category that now holds most of them.
        const homes = new Map();
        for (const old of oldProducts.filter((p) => p.category === category.id)) {
            const current = now.products.get(old.id);
            if (current) homes.set(current.category, (homes.get(current.category) ?? 0) + 1);
        }
        const best = [...homes.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best) note(from, now.categoryPath(best[0]), `category ${category.id} was retired; its products now live here (seen in ${label})`);
    }

    for (const old of oldProducts) {
        const current = now.products.get(old.id);
        if (!current) continue;
        if (sameThing(old.name, current.name)) note(before.productPath(old), now.productPath(current), `product ${old.id} moved or renamed (seen in ${label})`);
        else skippedAsDifferentThing += 1;
    }
}

const redirects = [...found.entries()].map(([from, { to, reason }]) => ({ from, to, reason })).sort((a, b) => a.from.localeCompare(b.from));

// A redirect must not lead to another redirect or to a path that does not exist.
const sources = new Set(redirects.map((r) => r.from));
const bad = redirects.filter((r) => sources.has(r.to) || !livePaths.has(r.to));
if (bad.length) {
    console.error("Refusing to write: these destinations are not live paths:\n" + bad.map((r) => `  ${r.from} -> ${r.to}`).join("\n"));
    process.exit(1);
}

writeFileSync(OUT, JSON.stringify(redirects, null, 2) + "\n");
console.log(`${redirects.length} redirects written to ${OUT} from ${log.length} snapshot(s)${since ? ` since ${since}` : ""}.`);
console.log(`${skippedAsDifferentThing} id match(es) skipped because the id now names a different product or category.`);
