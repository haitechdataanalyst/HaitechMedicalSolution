/**
 * API: GET /api/products
 *
 * Returns all products or filtered by category.
 * Query params: ?category=<id>&limit=<n>&offset=<n>
 *
 * This is a skeleton for future backend integration.
 * Currently reads from the JSON-backed service layer.
 */

import { NextRequest, NextResponse } from "next/server";
import { productRepo, categoryRepo } from "@/services";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const categoryId = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "50", 10);
        const offset = parseInt(searchParams.get("offset") || "0", 10);

        let products;

        if (categoryId) {
            const id = parseInt(categoryId, 10);
            if (isNaN(id)) {
                return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
            }
            const category = await categoryRepo.getById(id);
            if (!category) {
                return NextResponse.json({ error: "Category not found" }, { status: 404 });
            }
            products = await productRepo.getByCategory(id);
        } else {
            products = await productRepo.getAll();
        }

        // Pagination
        const total = products.length;
        const paginated = products.slice(offset, offset + limit);

        return NextResponse.json({
            data: paginated,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
