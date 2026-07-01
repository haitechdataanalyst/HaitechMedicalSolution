/**
 * API: GET /api/categories
 *
 * Returns categories. By default returns top-level only.
 * Query params: ?all=true to return all categories, ?parent=<id> for children.
 */

import { NextRequest, NextResponse } from "next/server";
import { categoryRepo } from "@/services";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const all = searchParams.get("all");
        const parentId = searchParams.get("parent");

        let categories;

        if (all === "true") {
            categories = await categoryRepo.getAll();
        } else if (parentId) {
            const id = parseInt(parentId, 10);
            if (isNaN(id)) {
                return NextResponse.json({ error: "Invalid parent ID" }, { status: 400 });
            }
            categories = await categoryRepo.getChildren(id);
        } else {
            categories = await categoryRepo.getTopLevel();
        }

        return NextResponse.json({ data: categories });
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
