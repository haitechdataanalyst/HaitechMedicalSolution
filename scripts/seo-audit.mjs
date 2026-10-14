// SEO regression check. Fetches /sitemap.xml from a running site and audits every URL in it.
//
//   npm run dev            (or: npm run build && npm start)
//   npm run seo:audit                       # http://localhost:3000
//   node scripts/seo-audit.mjs --base http://localhost:3000 --verbose
//
// Exits 1 when any ERROR is found. Warnings are printed but do not fail the run.
// Reads only; sitemap URLs on the production origin are fetched from --base instead, so it works against a local server.

// The one place the canonical origin is defined (lib/metadata.ts); Node strips its type-only import, so it loads as is.
import { SITE_URL as PROD_ORIGIN } from "../lib/metadata.ts";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const BASE = option("--base", "http://localhost:3000").replace(/\/$/, "");
const CONCURRENCY = Number(option("--concurrency", "4"));
const VERBOSE = flag("--verbose");

const TITLE_WARN_AT = 65;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 165;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
    return m ? decode(m[1]) : null;
};

function parse(html) {
    const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
    const meta = (key, by = "name") => {
        const tag = metas.find((t) => (attr(t, by) || "").toLowerCase() === key);
        return tag ? attr(tag, "content") : null;
    };
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
    const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
    const levels = [...body.matchAll(/<h([1-4])\b/gi)].map((m) => Number(m[1]));
    let headingSkips = 0;
    for (let i = 1; i < levels.length; i += 1) if (levels[i] - levels[i - 1] > 1) headingSkips += 1;
    let invalidJsonLd = 0;
    for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
            JSON.parse(m[1]);
        } catch {
            invalidJsonLd += 1;
        }
    }
    return {
        title: decode(((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").trim()) || null,
        description: meta("description"),
        robots: meta("robots"),
        canonicals: links.filter((t) => (attr(t, "rel") || "").toLowerCase() === "canonical").map((t) => attr(t, "href")),
        ogTitle: meta("og:title", "property"),
        ogImage: meta("og:image", "property"),
        ogImageAlt: meta("og:image:alt", "property"),
        twitterCard: meta("twitter:card"),
        h1Count: [...body.matchAll(/<h1\b/gi)].length,
        headingSkips,
        invalidJsonLd,
        imgsWithoutAlt: [...body.matchAll(/<img\b[^>]*>/gi)].filter((m) => !/\balt\s*=/.test(m[0])).length,
    };
}

async function main() {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) throw new Error("sitemap.xml lists no URLs");
    console.log(`Auditing ${urls.length} sitemap URLs against ${BASE}\n`);

    const pages = [];
    let next = 0;
    async function worker() {
        while (next < urls.length) {
            const url = urls[next++];
            const path = url.startsWith(PROD_ORIGIN) ? url.slice(PROD_ORIGIN.length) || "/" : url;
            try {
                const res = await fetch(BASE + path, { redirect: "manual" });
                pages.push({ url, path, status: res.status, ...(res.status === 200 ? parse(await res.text()) : {}) });
            } catch (error) {
                pages.push({ url, path, status: `ERR ${String(error).slice(0, 60)}` });
            }
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));

    const errors = [];
    const warnings = [];
    const seen = { title: new Map(), description: new Map() };
    const add = (list, page, message) => list.push(`${page.path}  ${message}`);

    for (const page of pages) {
        if (page.status !== 200) {
            add(errors, page, `HTTP ${page.status} (sitemap URLs must return 200)`);
            continue;
        }
        if (!page.title) add(errors, page, "missing <title>");
        else seen.title.set(page.title, [...(seen.title.get(page.title) ?? []), page.path]);
        if (!page.description) add(errors, page, "missing meta description");
        else seen.description.set(page.description, [...(seen.description.get(page.description) ?? []), page.path]);

        if (page.canonicals.length !== 1) add(errors, page, `${page.canonicals.length} canonical tags (expected exactly 1)`);
        else if (!page.canonicals[0].startsWith(PROD_ORIGIN)) add(errors, page, `canonical is not on ${PROD_ORIGIN}: ${page.canonicals[0]}`);
        if (page.robots && /noindex/i.test(page.robots)) add(errors, page, "noindex page is listed in the sitemap");
        if (!page.ogTitle) add(errors, page, "missing og:title");
        if (!page.ogImage) add(errors, page, "missing og:image");
        else if (!page.ogImage.startsWith("https://")) add(errors, page, `og:image is not an absolute https URL: ${page.ogImage}`);
        if (page.ogImage && !page.ogImageAlt) add(errors, page, "og:image without og:image:alt");
        if (!page.twitterCard) add(errors, page, "missing twitter:card");
        if (page.h1Count !== 1) add(errors, page, `${page.h1Count} <h1> elements (expected exactly 1)`);
        if (page.invalidJsonLd > 0) add(errors, page, `${page.invalidJsonLd} invalid JSON-LD block(s)`);
        if (page.imgsWithoutAlt > 0) add(errors, page, `${page.imgsWithoutAlt} <img> without an alt attribute`);

        if (page.title && page.title.length > TITLE_WARN_AT) add(warnings, page, `title is ${page.title.length} characters`);
        if (page.description && (page.description.length < DESCRIPTION_MIN || page.description.length > DESCRIPTION_MAX)) add(warnings, page, `description is ${page.description.length} characters`);
        if (page.headingSkips > 0) add(warnings, page, `${page.headingSkips} heading level skip(s)`);
    }
    for (const [kind, map] of Object.entries(seen)) {
        for (const [text, paths] of map) if (paths.length > 1) errors.push(`${paths.length} pages share one ${kind}: "${text.slice(0, 60)}" (${paths.slice(0, 3).join(", ")}…)`);
    }

    // robots.txt: names the same sitemap as the canonicals do, and blocks none of the pages the sitemap lists.
    const robots = await (await fetch(`${BASE}/robots.txt`)).text();
    const robotsLines = robots.split("\n").map((l) => l.trim());
    if (!robotsLines.includes(`Sitemap: ${PROD_ORIGIN}/sitemap.xml`)) errors.push(`robots.txt does not declare "Sitemap: ${PROD_ORIGIN}/sitemap.xml"`);
    const disallowed = robotsLines.filter((l) => /^disallow:/i.test(l)).map((l) => l.slice(l.indexOf(":") + 1).trim()).filter(Boolean);
    for (const page of pages) {
        const rule = disallowed.find((d) => page.path.startsWith(d));
        if (rule) errors.push(`${page.path}  is listed in the sitemap but blocked by robots.txt rule "Disallow: ${rule}"`);
    }

    if (VERBOSE) warnings.forEach((w) => console.log(`WARN   ${w}`));
    errors.forEach((e) => console.log(`ERROR  ${e}`));
    console.log(`\n${pages.length} pages · ${errors.length} error(s) · ${warnings.length} warning(s)${VERBOSE ? "" : " (use --verbose to list warnings)"}`);
    process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
