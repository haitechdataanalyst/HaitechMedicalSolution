/**
 * API: GET /api/products/[slug]
 *
 * Returns a single product by slug, including related products and accessories.
 */

import { NextRequest, NextResponse } from "next/server";
import { productRepo } from "@/services";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const product = productRepo.getBySlug(slug);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const related = productRepo.getRelated(product);
        const accessories = productRepo.getAccessories(product);

        return NextResponse.json({
            data: {
                ...product,
                relatedProductDetails: related,
                accessoryDetails: accessories,
                path: productRepo.getPath(product),
                breadcrumbs: productRepo.getBreadcrumbs(product),
            },
        });
    } catch (error) {
        console.error("GET /api/products/[slug] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
