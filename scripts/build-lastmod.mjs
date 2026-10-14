// Records when each sitemap page's content last changed, for the <lastmod> values in app/sitemap.ts.
//
//   npm run seo:lastmod
//
// The database only keeps a created_at for products (the seed time), so there is no real "modified" date to read. Instead
// every page is fingerprinted from the data or source file that decides what it shows. When the fingerprint differs from
// the one saved in data/lastmod.json, the page's date becomes today; when it is the same the old date is kept. A page
// seen for the first time gets the date of the last git commit that touched its source (an upper bound, never a guess
// at the future). Commit data/lastmod.json together with the change that caused it. Reads data/ and app/; writes only
// data/lastmod.json.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const OUT = "data/lastmod.json";
const read = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const json = (file) => JSON.parse(read(file));
const fingerprint = (value) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex").slice(0, 16);
const today = new Date().toISOString().slice(0, 10);

function lastCommitDate(...files) {
    try {
        const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], { encoding: "utf8" }).trim();
        return out || today;
    } catch {
        return today;
    }
}

const products = json("data/products.json");
const categories = json("data/categories.json");
const headlights = json("data/headlights.json");

// key -> { hash, files }: the files are only used to date a page the first time it is seen.
const pages = {};
const add = (key, hash, files) => (pages[key] = { hash, files });

for (const product of products) add(`product:${product.slug}`, fingerprint(product), ["data/products.json"]);

for (const category of categories) {
    // A listing changes when one of its sub-categories or products does, not only when its own row does.
    const members = [
        ...categories.filter((c) => c.parent === category.id).map((c) => [c.slug, c.name]),
        ...products.filter((p) => p.category === category.id).map((p) => [p.slug, p.name]),
    ];
    add(`category:${category.id}`, fingerprint({ category, members }), ["data/categories.json", "data/products.json"]);
}

// The Admetec lights are built from headlights.json (see lib/headlight-products.ts), not from products.json.
add("lights", fingerprint(headlights), ["data/headlights.json"]);

// Static pages: the page file itself. Hub pages share app/[hub]/page.tsx and the hub definitions.
const pageSource = (path) => {
    const file = path === "/" ? "app/page.tsx" : `app/${path.slice(1)}/page.tsx`;
    return existsSync(file) ? file : undefined;
};
const STATIC_PATHS = [...readFileSync("app/sitemap.ts", "utf8").matchAll(/^\s+"(\/[^"]*)",?\s*$/gm)].map((m) => m[1]);
for (const path of STATIC_PATHS) {
    const file = pageSource(path);
    if (file) add(`page:${path}`, fingerprint(read(file)), [file]);
}
add("stories", fingerprint(read("data/customer-stories.json")), ["data/customer-stories.json"]);
add("hubs", fingerprint(read("lib/hubs.ts") + read("app/[hub]/page.tsx")), ["lib/hubs.ts", "app/[hub]/page.tsx"]);

const previous = existsSync(OUT) ? json(OUT) : {};
const next = {};
let changed = 0;
let added = 0;
for (const [key, { hash, files }] of Object.entries(pages)) {
    const old = previous[key];
    if (!old) {
        added += 1;
        next[key] = { hash, lastmod: lastCommitDate(...files) };
    } else if (old.hash !== hash) {
        changed += 1;
        next[key] = { hash, lastmod: today };
    } else {
        next[key] = old;
    }
}

const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${OUT}: ${Object.keys(sorted).length} pages (${added} new, ${changed} changed, ${Object.keys(sorted).length - added - changed} unchanged)`);
