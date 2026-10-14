// Compares the committed catalogue files with what the backend serves, and exits 1 on drift.
//
//   node scripts/check-catalog-sync.mjs                       # backend at http://localhost:5000
//   node scripts/check-catalog-sync.mjs --api https://<api host>
//
// data/categories.json and data/products.json are the source of truth: backend/scripts/seed.js copies them into the
// database, and the backend has no route that edits categories. The database therefore goes stale when a file changes
// and nobody re-seeds (on 2026-08-17 "endo" became "endo-device"/"endo-files"; the database kept "endo"). The site reads
// the category tree and each product's category from the files, so drift does not change its URLs, but it does make the
// backend's own category listings and filters disagree with the site until the database is re-seeded.
// Read-only: it only issues GET requests.

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const API = (args.includes("--api") ? args[args.indexOf("--api") + 1] : "http://localhost:5000").replace(/\/$/, "");
const TIMEOUT_MS = 8000;

async function get(path) {
    const res = await fetch(API + path, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
    const body = await res.json();
    return body.data ?? body;
}

const file = (name) => JSON.parse(readFileSync(`data/${name}.json`, "utf8"));

function compareCategories(rows) {
    const fromApi = new Map(rows.map((r) => [r.id, { slug: r.slug, parent: r.parentId ?? r.parent ?? null }]));
    const fromFile = new Map(file("categories").map((c) => [c.id, { slug: c.slug, parent: c.parent }]));
    const problems = [];
    for (const [id, f] of fromFile) {
        const a = fromApi.get(id);
        if (!a) problems.push(`category ${id} "${f.slug}" is in the file but not in the database`);
        else if (a.slug !== f.slug || a.parent !== f.parent) problems.push(`category ${id}: database "${a.slug}" (parent ${a.parent}) vs file "${f.slug}" (parent ${f.parent})`);
    }
    for (const [id, a] of fromApi) if (!fromFile.has(id)) problems.push(`category ${id} "${a.slug}" is in the database but not in the file (retired?)`);
    return problems;
}

function compareProducts(rows) {
    const fromApi = new Map(rows.map((r) => [r.slug, r.categoryId ?? r.category]));
    const problems = [];
    for (const p of file("products")) {
        if (!fromApi.has(p.slug)) problems.push(`product "${p.slug}" is in the file but not in the database`);
        else if (fromApi.get(p.slug) !== p.category) problems.push(`product "${p.slug}": database category ${fromApi.get(p.slug)} vs file category ${p.category}`);
    }
    return problems;
}

try {
    const categories = await get("/api/v1/products/categories");
    const products = await get("/api/v1/products?limit=500");
    const problems = [...compareCategories(categories.categories ?? categories), ...compareProducts(products.items ?? products)];
    problems.forEach((p) => console.log("DRIFT  " + p));
    if (problems.length) {
        console.log(`\n${problems.length} difference(s) between data/*.json and ${API}. Re-seed the database from the files (backend/scripts/seed.js).`);
        process.exit(1);
    }
    console.log(`The database at ${API} matches data/categories.json and data/products.json.`);
} catch (error) {
    console.error(`Could not read the backend at ${API}: ${error.message}`);
    process.exit(2);
}
