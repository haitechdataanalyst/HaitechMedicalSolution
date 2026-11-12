// Run: node --test tests/admetec-seo.test.ts   (Node 22.6+ strips types natively)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ADMETEC_CATEGORY_SEO, admetecLoupeSeo } from "../lib/admetec-seo.ts";
import { ADMETEC_VIDEOS, watchTime } from "../lib/admetec-videos.ts";

type Row = { label?: string; value?: string };
type Product = { sku: string; name: string; contentBlocks: { type: string; data: { rows?: Row[] } }[] };
const all = JSON.parse(readFileSync("data/products.json", "utf-8")) as Product[];
const rowsOf = (p: Product) => p.contentBlocks.filter((b) => b.type === "specifications").flatMap((b) => b.data.rows ?? []);
const loupes = all.flatMap((p) => {
    const seo = admetecLoupeSeo(p.sku, `Admetec ${p.name}`, rowsOf(p));
    return seo ? [{ sku: p.sku, seo }] : [];
});

const MIN = 120;
const MAX = 160;

test("every Admetec loupe, and nothing else, gets loupe SEO", () => {
    assert.equal(loupes.length, 15); // 3 Galilean, 4 prismatic, 6 Ergo, Ergo-V and Ergo-V PRO
    assert.ok(all.filter((p) => p.sku.startsWith("ADM-") && !loupes.some((l) => l.sku === p.sku)).every((p) => !/^ADM-(?:[GPE]-\d|EV)/.test(p.sku)));
    assert.equal(admetecLoupeSeo("SAL-1", "Salli Light", []), undefined);
});

test("titles and descriptions are unique, say India, and fit a search result", () => {
    for (const { sku, seo } of loupes) {
        assert.match(seo.title, /Dental Loupes in India$/, sku);
        assert.ok(seo.title.length <= 47, `${sku} title ${seo.title.length}`);
        assert.ok(seo.description && seo.description.length >= MIN && seo.description.length <= MAX, `${sku} description ${seo.description?.length}`);
    }
    assert.equal(new Set(loupes.map((l) => l.seo.title)).size, loupes.length);
    assert.equal(new Set(loupes.map((l) => l.seo.description)).size, loupes.length);
});

test("each video is a real, unique, dated YouTube id", () => {
    assert.equal(ADMETEC_VIDEOS.length, 5);
    assert.equal(new Set(ADMETEC_VIDEOS.map((v) => v.id)).size, 5);
    for (const v of ADMETEC_VIDEOS) {
        assert.match(v.id, /^[\w-]{11}$/, v.id);
        assert.ok(!Number.isNaN(Date.parse(v.uploadDate)), `${v.id} uploadDate`);
        assert.ok(v.seconds > 0 && v.points.length >= 3, v.id);
        if (v.cta) assert.ok(v.cta.href.startsWith("/"), v.id);
    }
    assert.equal(watchTime(104), "1 min 44 s");
    assert.equal(watchTime(55), "55 s");
    assert.equal(watchTime(60), "1 min");
});

test("the '5-year warranty' shown beside the videos is true of every Admetec loupe", () => {
    const warranties = all.filter((p) => admetecLoupeSeo(p.sku, p.name, [])).map((p) => p.contentBlocks.find((b) => b.type === "info") as unknown as { data: { warranty?: string } } | undefined);
    assert.equal(warranties.length, 15);
    for (const info of warranties) assert.match(info?.data.warranty ?? "", /^5-year/);
});

test("category copy fits a search result", () => {
    for (const [slug, seo] of Object.entries(ADMETEC_CATEGORY_SEO)) {
        assert.ok(seo.title.length <= 47, `${slug} title ${seo.title.length}`);
        assert.ok(seo.description.length >= MIN && seo.description.length <= MAX, `${slug} description ${seo.description.length}`);
        assert.match(seo.title + seo.description, /India/, slug);
    }
});
