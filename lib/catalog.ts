import fs from "fs";
import path from "path";
import { Product, Category, Breadcrumb, Frame, FramesData, HeadlightsData, HeadlightCategory, MedesyData, MedesyCategory } from "@/types";

// ── Static JSON paths (frames / headlights / medesy only — NOT products or categories) ──
const framesPath     = path.join(process.cwd(), "data", "frames.json");
const headlightsPath = path.join(process.cwd(), "data", "headlights.json");
const medesyPath     = path.join(process.cwd(), "data", "medesy.json");

let framesCache:     Frame[]        | null = null;
let headlightsCache: HeadlightsData | null = null;
let medesyCache:     MedesyData     | null = null;

// ── Backend API base ──────────────────────────────────────────────────────────
const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.INTERNAL_API_URL    ||
    "http://localhost:5000";

// Server-side fetch helper with 5-minute ISR revalidation
async function catalogFetch<T>(path: string): Promise<T> {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        throw new Error(`[catalog] fetch failed ${res.status} — ${url}`);
    }
    const body = await res.json();
    // Backend wraps responses in { data: ... } — unwrap one level
    return (body.data ?? body) as T;
}

// ── DB → Frontend type adapters ───────────────────────────────────────────────
// The DB stores camelCase column aliases that differ from the frontend types.
// products.json uses: category (number), order, relatedProducts (number[])
// DB row uses:        categoryId, sortOrder, relatedProducts (already parsed)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToCategory(row: any, allRows: any[]): Category {
    return {
        id:          row.id,
        slug:        row.slug,
        name:        row.name,
        type:        "category" as const,
        description: row.description ?? undefined,
        image:       row.image ?? undefined,
        parent:      row.parentId ?? null,
        order:       row.sortOrder ?? 0,
        // Compute children from the flat list
        children:    allRows.filter((r) => r.parentId === row.id).map((r) => r.id),
        specialPage: row.specialPage ?? undefined,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProduct(row: any): Product {
    return {
        id:             row.id,
        slug:           row.slug,
        name:           row.name,
        description:    row.description ?? undefined,
        category:       row.categoryId,
        order:          row.sortOrder ?? 0,
        sku:            row.sku ?? "",
        basePrice:      row.basePrice ?? undefined,
        currency:       row.currency ?? "INR",
        colorCode:      row.colorCode ?? undefined,
        hasVariants:    row.hasVariants ?? false,
        variantType:    row.variantType ?? undefined,
        defaultImage:   row.defaultImage ?? undefined,
        catalogueFile:  row.catalogueFile ?? undefined,
        contentBlocks:  Array.isArray(row.contentBlocks) ? row.contentBlocks : [],
        relatedProducts:Array.isArray(row.relatedProducts) ? row.relatedProducts : [],
        frameVariants:  row.frameVariants ?? undefined,
    };
}

// ── In-process caches to avoid redundant fetches within a single request ──────
// Next.js de-dupes fetch() calls with the same URL, so these are mainly useful
// for synchronous helper functions called multiple times in one render.
let _catCache: Category[] | null = null;
let _prodCache: Product[] | null = null;

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
    if (_catCache) return _catCache;
    try {
        const raw = await catalogFetch<{ categories: unknown[] }>("/api/v1/products/categories");
        const rows = raw.categories ?? raw;
        _catCache = (rows as unknown[]).map((r) => dbToCategory(r, rows as unknown[]));
    } catch {
        const staticPath = path.join(process.cwd(), "data", "categories.json");
        _catCache = JSON.parse(fs.readFileSync(staticPath, "utf-8")) as Category[];
    }
    return _catCache!;
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

// ── Products ──────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
    if (_prodCache) return _prodCache;
    try {
        const raw = await catalogFetch<{ items: unknown[]; meta: unknown }>("/api/v1/products?limit=500");
        _prodCache = (raw.items as unknown[]).map(dbToProduct);
    } catch {
        const staticPath = path.join(process.cwd(), "data", "products.json");
        _prodCache = JSON.parse(fs.readFileSync(staticPath, "utf-8")) as Product[];
    }
    return _prodCache!;
}

export async function getProductById(id: number): Promise<Product | null> {
    try {
        const raw = await catalogFetch<{ product: unknown }>(`/api/v1/products/${id}`);
        return dbToProduct(raw.product ?? raw);
    } catch {
        return null;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const raw = await catalogFetch<{ product: unknown }>(`/api/v1/products/${slug}`);
        return dbToProduct(raw.product ?? raw);
    } catch {
        return null;
    }
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
        const raw = await catalogFetch<{ items: unknown[] }>(`/api/v1/products?category=${categoryId}&limit=200`);
        return (raw.items as unknown[]).map(dbToProduct);
    } catch {
        const all = await getAllProducts();
        return all.filter((p) => p.category === categoryId);
    }
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
    if (!product.relatedProducts?.length) return [];
    const all = await getAllProducts();
    return product.relatedProducts
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);
}

export async function getProductAccessories(product: Product): Promise<Product[]> {
    if (!product.accessories?.length) return [];
    const all = await getAllProducts();
    return product.accessories
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);
}

// ── Category + product content resolution ────────────────────────────────────

export async function getCategoryContents(
    categoryId: number
): Promise<{ type: "categories" | "products"; items: Category[] | Product[] }> {
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

export async function resolvePathToEntity(
    pathSegments: string[]
): Promise<{ type: "category" | "product"; entity: Category | Product } | null> {
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
        const productSlug  = pathSegments[pathSegments.length - 1];
        const categoryPath = pathSegments.slice(0, -1).join("/");
        const parentCat    = categoryPathMap.get(categoryPath);

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

    const crumbs: Breadcrumb[] = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
    ];
    for (const cat of trail) {
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
    const crumbs = cat ? await getCategoryBreadcrumbs(cat) : [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
    ];
    crumbs.push({ name: product.name, path: await getProductPath(product) });
    return crumbs;
}

// ── Static path generation ────────────────────────────────────────────────────

export async function getAllStaticPaths(): Promise<string[][]> {
    const cats  = await getAllCategories();
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

export async function getRandomProductsForEachCategory(count: number): Promise<Product[]> {
    const [cats, prods] = await Promise.all([getAllCategories(), getAllProducts()]);
    const results: Product[] = [];

    for (const cat of cats) {
        const catProds = prods.filter((p) => p.category === cat.id);
        if (catProds.length === 0) continue;
        const idx = Math.floor(Math.random() * catProds.length);
        results.push(catProds[idx]);
        if (results.length >= count) break;
    }
    return results;
}

export function getProductImage(product: Product): string {
    if (product.defaultImage) return product.defaultImage;
    if (product.variants?.length)  return product.variants[0].image;
    if (product.gallery?.length)   return product.gallery[0];
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

export function getAllFrames(): Frame[] { return loadFrames(); }
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

export async function getHeadlightsData(): Promise<HeadlightsData> { return loadHeadlights(); }
export async function getHeadlightCategories(): Promise<HeadlightCategory[]> { return loadHeadlights().categories; }
export async function getHeadlightCategoryById(id: string): Promise<HeadlightCategory | null> {
    return loadHeadlights().categories.find((c) => c.id === id) ?? null;
}

// ── Medesy (static JSON — unchanged) ─────────────────────────────────────────

function loadMedesy(): MedesyData {
    if (!medesyCache) {
        medesyCache = JSON.parse(fs.readFileSync(medesyPath, "utf8"));
    }
    return medesyCache!;
}

export function getMedesyData(): MedesyData { return loadMedesy(); }
export function getMedesyCategories(): MedesyCategory[] { return loadMedesy().categories; }
export function getMedesyCategoryById(id: string): MedesyCategory | null {
    return loadMedesy().categories.find((c) => c.id === id) ?? null;
}
