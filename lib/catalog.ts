import fs from "fs";
import path from "path";
import { Product, Category, Breadcrumb, Frame, FramesData, HeadlightsData, HeadlightCategory, MedesyData, MedesyCategory } from "@/types";
import { findHubForCategoryTrail, hubPath, HubDefinition, HUBS } from "@/lib/hubs";
import { detectBrand } from "@/lib/brand";
import { HEADLIGHT_CATEGORY_SLUG, headlightProducts } from "@/lib/headlight-products";

// ── Static JSON paths (frames / headlights / medesy only — NOT products or categories) ──
const framesPath = path.join(process.cwd(), "data", "frames.json");
const headlightsPath = path.join(process.cwd(), "data", "headlights.json");
const medesyPath = path.join(process.cwd(), "data", "medesy.json");
const trendingPath = path.join(process.cwd(), "data", "trending.json");

let framesCache: Frame[] | null = null;
let headlightsCache: HeadlightsData | null = null;
let medesyCache: MedesyData | null = null;

// ── Backend API base ──────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || "http://localhost:5000";

// A slow backend must not hang page renders: give up and use the JSON fallback instead.
const CATALOG_FETCH_TIMEOUT_MS = 5000;
// A fallback result is only a stopgap — retry the backend after this long instead of pinning it for the process lifetime.
const FALLBACK_CACHE_TTL_MS = 60_000;

// Server-side fetch helper with 5-minute ISR revalidation. Next keeps serving a cached response when a revalidation
// fails (stale-on-error), which is what we want in production during an outage. In development that cache outlives
// the backend: a response saved weeks ago kept being served after the backend went away, so the dev site showed a
// catalogue the files no longer describe. Development therefore always asks the backend and falls back to the files.
const FETCH_CACHE_OPTIONS: RequestInit & { next?: { revalidate: number } } = process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 300 } };

async function catalogFetch<T>(path: string): Promise<T> {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
        ...FETCH_CACHE_OPTIONS,
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(CATALOG_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
        throw new Error(`[catalog] fetch failed ${res.status} — ${url}`);
    }
    const body = await res.json();
    // Backend wraps responses in { data: ... } — unwrap one level
    return (body.data ?? body) as T;
}

// A product's catalogueFile only counts when the PDF is actually in public/. The database and data/products.json name
// per-product PDFs (/catalogues/ergo-3.0x.pdf and about 60 more) that were never added, and every one of them showed
// up as a 404 in Search Console. Drop the ones with no file; add the PDF to public/ and the link comes back by itself.
function publishedCatalogueFile(file: unknown): string | undefined {
    if (typeof file !== "string" || !file.startsWith("/") || file.includes("..")) return undefined;
    return fs.existsSync(path.join(process.cwd(), "public", decodeURIComponent(file))) ? file : undefined;
}

const dropMissingCatalogueFiles = (key: string, value: unknown) => (key === "catalogueFile" ? publishedCatalogueFile(value) : value);

// ── DB → Frontend type adapter ────────────────────────────────────────────────
// The DB stores camelCase column aliases that differ from the frontend types.
// products.json uses: category (number), order, relatedProducts (number[])
// DB row uses:        categoryId, sortOrder, relatedProducts (already parsed)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProduct(row: any): Product {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description ?? undefined,
        category: row.categoryId,
        order: row.sortOrder ?? 0,
        sku: row.sku ?? "",
        basePrice: row.basePrice ?? undefined,
        currency: row.currency ?? "INR",
        colorCode: row.colorCode ?? undefined,
        hasVariants: row.hasVariants ?? false,
        variantType: row.variantType ?? undefined,
        defaultImage: row.defaultImage ?? undefined,
        catalogueFile: publishedCatalogueFile(row.catalogueFile),
        contentBlocks: Array.isArray(row.contentBlocks) ? row.contentBlocks : [],
        relatedProducts: Array.isArray(row.relatedProducts) ? row.relatedProducts : [],
        frameVariants: row.frameVariants ?? undefined,
    };
}

// ── In-process caches to avoid redundant fetches within a single request ──────
// Next.js de-dupes fetch() calls with the same URL, so these are mainly useful
// for synchronous helper functions called multiple times in one render.
// Backend results live as long as the fetch revalidation window; fallback results expire sooner so a
// recovered backend is picked up without a restart.
type Cached<T> = { value: T; expiresAt: number };
const BACKEND_CACHE_TTL_MS = 300_000;

function readCache<T>(entry: Cached<T> | null): T | null {
    return entry && entry.expiresAt > Date.now() ? entry.value : null;
}

let _catCache: Cached<Category[]> | null = null;
let _prodCache: Cached<Product[]> | null = null;
let _fileProductCache: Cached<Map<string, Product>> | null = null;

// The committed files are re-read at most this often, so an edit shows up without a restart.
const FILE_CACHE_TTL_MS = 60_000;

// ── Categories ────────────────────────────────────────────────────────────────
//
// data/categories.json is the single source of truth for the category tree: every id, slug and parent, and so every
// category URL, breadcrumb, sitemap entry and canonical. backend/scripts/seed.js fills the `categories` table FROM this
// file and the backend has no route that edits categories, so that table is only a copy. A copy goes stale whenever the
// file changes without a re-seed, and it did: on 2026-08-17 Bondent's "endo" became "endo-device" and "endo-files" and
// the CBCT sub-category was retired, but the database kept the old tree. Reading the API's copy made the same page
// resolve to /bondent/endo or /bondent/endo-device depending on whether the backend answered and what it had cached.
// Reading the file keeps every URL the same whether the backend is up, down or stale, and a rename ships atomically with
// the code that links to it. (Products stay database-first; see reconcileCategory below.)

export async function getAllCategories(): Promise<Category[]> {
    const cached = readCache(_catCache);
    if (cached) return cached;
    const value = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "categories.json"), "utf-8")) as Category[];
    _catCache = { value, expiresAt: Date.now() + FILE_CACHE_TTL_MS };
    return value;
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const cats = await getAllCategories();
    return cats.find((c) => c.id === id) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const cats = await getAllCategories();
    return cats.find((c) => c.slug === slug) ?? null;
}

export async function getTopCategories(): Promise<Category[]> {
    const cats = await getAllCategories();
    return cats.filter((c) => c.parent === null).sort((a, b) => a.order - b.order);
}

export async function getChildCategories(parentId: number): Promise<Category[]> {
    const cats = await getAllCategories();
    return cats.filter((c) => c.parent === parentId).sort((a, b) => a.order - b.order);
}

/**
 * The heading (H1 and page title) of a category listing, written so two different pages never share one.
 * - A brand's own category lists its range, while /product/<brand> tells the brand story: "Admetec" -> "Admetec products".
 * - A category named like a product-type hub ("Dental Chairs") is one brand's slice of that hub, so it carries the
 *   brand: "Almadent Dental Chairs". Everything else keeps its own name.
 */
export async function getCategoryHeading(category: Category): Promise<string> {
    if (category.parent === null) return `${category.name} products`;
    const isHubName = HUBS.some((hub) => hub.name.toLowerCase() === category.name.toLowerCase());
    if (!isHubName) return category.name;
    const categories = await getAllCategories();
    let root: Category | undefined = category;
    for (let depth = 0; root && root.parent !== null && depth < 10; depth += 1) root = categories.find((c) => c.id === root!.parent);
    return root && root.id !== category.id ? `${root.name} ${category.name}` : category.name;
}

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Admetec lights as catalogue products (see lib/headlight-products.ts). They come from data/headlights.json
 * whether the backend is up or not, so they are added on top of whichever source served the rest of the catalogue.
 * Empty when the Lights category is not in the catalogue.
 */
async function getHeadlightCatalogueProducts(): Promise<Product[]> {
    const lightsCategory = (await getAllCategories()).find((c) => c.slug === HEADLIGHT_CATEGORY_SLUG);
    return lightsCategory ? headlightProducts(loadHeadlights(), lightsCategory.id) : [];
}

/** `base` plus the lights it does not already contain (a light the database learns about later wins). */
function withHeadlights(base: Product[], lights: Product[]): Product[] {
    return [...base, ...lights.filter((light) => !base.some((p) => p.slug === light.slug))];
}

/** data/products.json by slug: the committed catalogue, used as the fallback and to reconcile category assignments. */
function readFileProducts(): Map<string, Product> {
    const cached = readCache(_fileProductCache);
    if (cached) return cached;
    const rows = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "products.json"), "utf-8"), dropMissingCatalogueFiles) as Product[];
    const value = new Map(rows.map((p) => [p.slug, p]));
    _fileProductCache = { value, expiresAt: Date.now() + FILE_CACHE_TTL_MS };
    return value;
}

/**
 * A product's category follows the committed file whenever the file knows the product (matched by slug), for the same
 * reason the category tree does: seed.js copies both into the database, so the database's assignment can point at a
 * category the tree has since retired (CBCT products still sat in the removed "cbct-systems" category, id 78). A
 * product the file does not know keeps the database's assignment. Everything else about the product stays the database's.
 */
function reconcileCategory(product: Product): Product {
    const known = readFileProducts().get(product.slug);
    return known && known.category !== product.category ? { ...product, category: known.category } : product;
}

/**
 * Admetec prices come from the committed price list (data/products.json), not from the database row. The list is
 * revised yearly and shown to the public, and the database only learns a revision when it is re-seeded, so a stale row
 * must not put last year's price (or none) on the site. The actions block carries the per-option prices (Prismatic
 * magnifications) and the prescription surcharges. Other brands stay database-first.
 */
function reconcileAdmetecPricing(product: Product): Product {
    const known = readFileProducts().get(product.slug);
    if (!known || detectBrand(product.sku).name !== "Admetec") return product;
    const listed = known.contentBlocks.find((b) => b.type === "actions");
    return {
        ...product,
        basePrice: known.basePrice,
        currency: known.currency,
        contentBlocks: listed ? product.contentBlocks.map((b) => (b.type === "actions" ? listed : b)) : product.contentBlocks,
    };
}

/** The database row, aligned with the committed catalogue files (category tree and Admetec price list). */
function reconcile(product: Product): Product {
    return reconcileAdmetecPricing(reconcileCategory(product));
}

export async function getAllProducts(): Promise<Product[]> {
    const cached = readCache(_prodCache);
    if (cached) return cached;
    const lights = await getHeadlightCatalogueProducts();
    try {
        const raw = await catalogFetch<{ items: unknown[]; meta: unknown }>("/api/v1/products?limit=500");
        const value = withHeadlights((raw.items as unknown[]).map(dbToProduct).map(reconcile), lights);
        _prodCache = { value, expiresAt: Date.now() + BACKEND_CACHE_TTL_MS };
        return value;
    } catch {
        const value = withHeadlights([...readFileProducts().values()], lights);
        _prodCache = { value, expiresAt: Date.now() + FALLBACK_CACHE_TTL_MS };
        return value;
    }
}

// Single-product lookups fall back to the JSON catalogue like the list functions do, so a backend
// outage doesn't turn every product page into a 404.
export async function getProductById(id: number): Promise<Product | null> {
    const light = (await getHeadlightCatalogueProducts()).find((p) => p.id === id);
    if (light) return light;
    try {
        const raw = await catalogFetch<{ product: unknown }>(`/api/v1/products/${id}`);
        return reconcile(dbToProduct(raw.product ?? raw));
    } catch {
        return (await getAllProducts()).find((p) => p.id === id) ?? null;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const light = (await getHeadlightCatalogueProducts()).find((p) => p.slug === slug);
    if (light) return light;
    try {
        const raw = await catalogFetch<{ product: unknown }>(`/api/v1/products/${slug}`);
        return reconcile(dbToProduct(raw.product ?? raw));
    } catch {
        return (await getAllProducts()).find((p) => p.slug === slug) ?? null;
    }
}

// Filtered from the one reconciled list rather than asking the backend per category: the backend filters by its own
// (possibly stale) category column, which would disagree with the tree and with every other listing.
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    return (await getAllProducts()).filter((p) => p.category === categoryId);
}

/** The Admetec lights as catalogue products with their page paths, for linking from the lights pages. */
export async function getHeadlightProducts(): Promise<(Product & { path: string })[]> {
    const lights = await getHeadlightCatalogueProducts();
    return Promise.all(lights.map(async (p) => ({ ...p, path: await getProductPath(p) })));
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
    if (!product.relatedProducts?.length) return [];
    const all = await getAllProducts();
    return product.relatedProducts.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => p !== undefined);
}

const SIBLING_LIMIT = 8;

/**
 * The curated relatedProducts list when a product has one; otherwise other
 * products from the same catalog category, so every product page links on.
 */
export async function getProductRecommendations(product: Product): Promise<{ title: string; items: Product[] }> {
    const related = await getRelatedProducts(product);
    if (related.length > 0) return { title: "Related Products", items: related };
    if (!product.category) return { title: "Related Products", items: [] };

    const [category, siblings] = await Promise.all([getCategoryById(product.category), getProductsByCategory(product.category)]);
    const items = siblings.filter((p) => p.id !== product.id).slice(0, SIBLING_LIMIT);
    return { title: category ? `More ${category.name}` : "More Products", items };
}

/** Category name for titles; a brand-root category falls back to its hub's name ("Salli" -> "Saddle Chairs"). */
export async function getProductTypeLabel(product: Product): Promise<string | undefined> {
    const category = await getCategoryById(product.category);
    if (!category) return undefined;
    if (category.parent !== null) return category.name;
    return findHubForCategoryTrail([category.slug])?.name ?? category.name;
}

export interface HubProductGroup {
    category: Category;
    products: (Product & { path: string })[];
}

/** Hub sections in configured order; categories that are missing or empty are skipped. */
export async function getHubProductGroups(hub: HubDefinition): Promise<HubProductGroup[]> {
    const groups = await Promise.all(
        hub.productCategories.map(async (slug) => {
            const category = await getCategoryBySlug(slug);
            if (!category) return null;
            const products = await getProductsByCategory(category.id);
            const withPaths = await Promise.all(products.map(async (p) => ({ ...p, path: await getProductPath(p) })));
            return withPaths.length > 0 ? { category, products: withPaths } : null;
        })
    );
    return groups.filter((g): g is HubProductGroup => g !== null);
}

/** The product-type hub whose categories contain this product, if any. */
export async function getProductHub(product: Product): Promise<HubDefinition | null> {
    const trail: string[] = [];
    let cat = product.category ? await getCategoryById(product.category) : null;
    while (cat) {
        trail.push(cat.slug);
        cat = cat.parent !== null ? await getCategoryById(cat.parent) : null;
    }
    return findHubForCategoryTrail(trail);
}

export async function getProductAccessories(product: Product): Promise<Product[]> {
    if (!product.accessories?.length) return [];
    const all = await getAllProducts();
    return product.accessories.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => p !== undefined);
}

// ── Category + product content resolution ────────────────────────────────────

export async function getCategoryContents(categoryId: number): Promise<{ type: "categories" | "products"; items: Category[] | Product[] }> {
    const children = await getChildCategories(categoryId);
    if (children.length > 0) {
        return { type: "categories", items: children };
    }
    const products = await getProductsByCategory(categoryId);
    return { type: "products", items: products };
}

// ── Path helpers ──────────────────────────────────────────────────────────────

export async function getCategoryPath(category: Category): Promise<string> {
    const cats = await getAllCategories();
    const catMap = new Map(cats.map((c) => [c.id, c]));

    const parts: string[] = [];
    let cur: Category | undefined = category;
    while (cur) {
        parts.unshift(cur.slug);
        cur = cur.parent !== null ? catMap.get(cur.parent) : undefined;
    }
    return `/product-category/${parts.join("/")}`;
}

export async function getProductPath(product: Product): Promise<string> {
    const cat = product.category ? await getCategoryById(product.category) : null;
    if (cat) {
        const catPath = await getCategoryPath(cat);
        return `${catPath}/${product.slug}`;
    }
    return `/product/${product.slug}`;
}

// ── Route resolver ────────────────────────────────────────────────────────────

export async function resolvePathToEntity(pathSegments: string[]): Promise<{ type: "category" | "product"; entity: Category | Product } | null> {
    const cats = await getAllCategories();
    const prods = await getAllProducts();

    // Build a slug-path → category map
    const catMap = new Map(cats.map((c) => [c.id, c]));
    const categoryPathMap = new Map<string, Category>();

    for (const cat of cats) {
        const parts: string[] = [];
        let cur: Category | undefined = cat;
        while (cur) {
            parts.unshift(cur.slug);
            cur = cur.parent !== null ? catMap.get(cur.parent) : undefined;
        }
        categoryPathMap.set(parts.join("/"), cat);
    }

    const fullPath = pathSegments.join("/");

    // Try category first
    const matchedCat = categoryPathMap.get(fullPath);
    if (matchedCat) return { type: "category", entity: matchedCat };

    // Try product (last segment = product slug, rest = category path)
    if (pathSegments.length > 0) {
        const productSlug = pathSegments[pathSegments.length - 1];
        const categoryPath = pathSegments.slice(0, -1).join("/");
        const parentCat = categoryPathMap.get(categoryPath);

        if (parentCat) {
            const product = prods.find((p) => p.slug === productSlug && p.category === parentCat.id);
            if (product) return { type: "product", entity: product };
        }
    }

    return null;
}

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

export async function getCategoryBreadcrumbs(category: Category): Promise<Breadcrumb[]> {
    const cats = await getAllCategories();
    const catMap = new Map(cats.map((c) => [c.id, c]));

    const trail: Category[] = [];
    let cur: Category | undefined = category;
    while (cur) {
        trail.unshift(cur);
        cur = cur.parent !== null ? catMap.get(cur.parent) : undefined;
    }

    // Product-type hub first (Home → Dental Loupes → Admetec → …) when one
    // claims this trail; brand-only trails keep the generic Products crumb.
    const hub = findHubForCategoryTrail([...trail].reverse().map((c) => c.slug));
    const crumbs: Breadcrumb[] = [{ name: "Home", path: "/" }, hub ? { name: hub.name, path: hubPath(hub) } : { name: "Products", path: "/products" }];
    for (const cat of trail) {
        // "Home → Dental Chairs → Almadent → Dental Chairs" reads as a stutter; the hub already stands in for it.
        if (hub && cat.name.toLowerCase() === hub.name.toLowerCase()) continue;
        const parts: string[] = [];
        let c: Category | undefined = cat;
        while (c) {
            parts.unshift(c.slug);
            c = c.parent !== null ? catMap.get(c.parent) : undefined;
        }
        crumbs.push({ name: cat.name, path: `/product-category/${parts.join("/")}` });
    }
    return crumbs;
}

export async function getProductBreadcrumbs(product: Product): Promise<Breadcrumb[]> {
    const cat = product.category ? await getCategoryById(product.category) : null;
    const crumbs = cat
        ? await getCategoryBreadcrumbs(cat)
        : [
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
          ];
    crumbs.push({ name: product.name, path: await getProductPath(product) });
    return crumbs;
}

// ── Static path generation ────────────────────────────────────────────────────

export async function getAllStaticPaths(): Promise<string[][]> {
    const cats = await getAllCategories();
    const prods = await getAllProducts();
    const catMap = new Map(cats.map((c) => [c.id, c]));

    const buildCatPath = (cat: Category): string => {
        const parts: string[] = [];
        let cur: Category | undefined = cat;
        while (cur) {
            parts.unshift(cur.slug);
            cur = cur.parent !== null ? catMap.get(cur.parent) : undefined;
        }
        return parts.join("/");
    };

    const paths: string[][] = [];
    for (const cat of cats) {
        paths.push(buildCatPath(cat).split("/"));
    }
    for (const prod of prods) {
        const cat = prod.category ? catMap.get(prod.category) : null;
        if (cat) {
            paths.push([...buildCatPath(cat).split("/"), prod.slug]);
        }
    }
    return paths;
}

// ── Misc helpers ──────────────────────────────────────────────────────────────

// Editorial pick list, not an algorithm — no randomization, no round-robin.
// data/trending.json is a plain ordered array of product slugs; edit that
// file directly to change what shows in the homepage trending section as
// real market conditions change.
export async function getFeaturedProducts(): Promise<Product[]> {
    const slugs: string[] = JSON.parse(fs.readFileSync(trendingPath, "utf8"));
    const prods = await getAllProducts();
    const bySlug = new Map(prods.map((p) => [p.slug, p]));
    return slugs.map((slug) => bySlug.get(slug)).filter((p): p is Product => p !== undefined);
}

export function getProductImage(product: Product): string {
    if (product.defaultImage) return product.defaultImage;
    if (product.variants?.length) return product.variants[0].image;
    if (product.gallery?.length) return product.gallery[0];
    return "/images/placeholder.jpg";
}

// ── Frames (static JSON — unchanged) ─────────────────────────────────────────

function loadFrames(): Frame[] {
    if (!framesCache) {
        const data: FramesData = JSON.parse(fs.readFileSync(framesPath, "utf8"));
        framesCache = data.frames;
    }
    return framesCache!;
}

export function getAllFrames(): Frame[] {
    return loadFrames();
}
export function getFrameById(id: string): Frame | null {
    return loadFrames().find((f) => f.id === id) ?? null;
}

// ── Headlights (static JSON — unchanged) ─────────────────────────────────────

function loadHeadlights(): HeadlightsData {
    if (!headlightsCache) {
        headlightsCache = JSON.parse(fs.readFileSync(headlightsPath, "utf8"));
    }
    return headlightsCache!;
}

export async function getHeadlightsData(): Promise<HeadlightsData> {
    return loadHeadlights();
}
export async function getHeadlightCategories(): Promise<HeadlightCategory[]> {
    return loadHeadlights().categories;
}
export async function getHeadlightCategoryById(id: string): Promise<HeadlightCategory | null> {
    return loadHeadlights().categories.find((c) => c.id === id) ?? null;
}

// ── Medesy (static JSON — unchanged) ─────────────────────────────────────────

function loadMedesy(): MedesyData {
    if (!medesyCache) {
        medesyCache = JSON.parse(fs.readFileSync(medesyPath, "utf8"), dropMissingCatalogueFiles);
    }
    return medesyCache!;
}

export function getMedesyData(): MedesyData {
    return loadMedesy();
}
export function getMedesyCategories(): MedesyCategory[] {
    return loadMedesy().categories;
}
export function getMedesyCategoryById(id: string): MedesyCategory | null {
    return loadMedesy().categories.find((c) => c.id === id) ?? null;
}
