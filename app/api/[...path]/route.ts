/**
 * The read-only catalogue API behind one route.
 *
 * Vercel turns every route handler into its own serverless function and the Hobby plan allows 12 in all, so these
 * endpoints share this one function instead of one file each. The URLs and responses are unchanged:
 *
 *   GET /api/health
 *   GET /api/categories
 *   GET /api/categories/:id/contents
 *   GET /api/products
 *   GET /api/products/:slug
 *
 * Each handler lives in lib/catalog-api/. Anything else under /api answers 404 as JSON.
 */

import { NextRequest, NextResponse } from "next/server";
import { GET as getCategories } from "@/lib/catalog-api/categories";
import { GET as getCategoryContents } from "@/lib/catalog-api/category-contents";
import { GET as getHealth } from "@/lib/catalog-api/health";
import { GET as getProducts } from "@/lib/catalog-api/products";
import { GET as getProduct } from "@/lib/catalog-api/product";

// Every endpoint answers per request (health reports the current time); none may be prerendered.
export const dynamic = "force-dynamic";

type Segments = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Segments) {
    const [first, second, third, ...rest] = (await params).path;

    if (rest.length === 0) {
        if (first === "health" && second === undefined) return getHealth();
        if (first === "categories" && second === undefined) return getCategories(request);
        if (first === "categories" && third === "contents" && second !== undefined) return getCategoryContents(request, { params: Promise.resolve({ id: second }) });
        if (first === "products" && second === undefined) return getProducts(request);
        if (first === "products" && second !== undefined && third === undefined) return getProduct(request, { params: Promise.resolve({ slug: second }) });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
}
