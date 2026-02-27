/**
 * API: GET /api/categories/[id]/contents
 *
 * Returns the contents (subcategories or products) of a category.
 * Mirrors the fetchCategoryContentsAction server action for REST consumers.
 */

import { NextRequest, NextResponse } from "next/server";
import { categoryRepo, productRepo } from "@/services";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idParam } = await params;
        const categoryId = parseInt(idParam, 10);

        if (isNaN(categoryId)) {
            return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
        }

        const category = categoryRepo.getById(categoryId);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const contents = categoryRepo.getContents(categoryId);

        // Enrich items with paths
        const items = contents.items.map((item) => {
            if (contents.type === "categories") {
                const cat = item as import("@/types").Category;
                return { ...cat, path: categoryRepo.getPath(cat) };
            } else {
                const prod = item as import("@/types").Product;
                return { ...prod, path: productRepo.getPath(prod) };
            }
        });

        return NextResponse.json({
            data: {
                type: contents.type,
                items,
            },
        });
    } catch (error) {
        console.error("GET /api/categories/[id]/contents error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
