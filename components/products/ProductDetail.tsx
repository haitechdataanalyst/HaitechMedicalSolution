"use client";

import { useState } from "react";
import { Product, Frame, HeadlightCategory } from "@/types";
import ContentRenderer from "./ContentRenderer";
import ProductGrid from "./ProductGrid";

// Product with computed path for linking
interface ProductWithPath extends Product {
    path: string;
}

interface ProductDetailProps {
    product: Product;
    relatedProducts?: ProductWithPath[];
    accessories?: ProductWithPath[];
    frames?: Frame[];
    headlightCategories?: HeadlightCategory[];
}

export default function ProductDetail({ product, relatedProducts = [], accessories = [], frames = [], headlightCategories = [] }: ProductDetailProps) {
    const [selectedVariantImage, setSelectedVariantImage] = useState<string | undefined>(undefined);

    // Separate blocks for layout purposes
    const heroBlock = product.contentBlocks.find((b) => b.type === "hero");
    const actionsBlock = product.contentBlocks.find((b) => b.type === "actions");
    const descriptionBlock = product.contentBlocks.find((b) => b.type === "description");
    const otherBlocks = product.contentBlocks.filter((b) => !["hero", "actions", "description"].includes(b.type));

    const handleVariantSelect = (imageUrl: string) => {
        setSelectedVariantImage(imageUrl);
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8">
            {/* Product Main Content - Two Column Layout */}
            <div className="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-start lg:gap-12">
                {/* Left Column - Sticky Images */}
                <div className="lg:sticky lg:top-24 lg:w-1/2 lg:self-start">{heroBlock && <ContentRenderer blocks={[heroBlock]} product={product} selectedVariantImage={selectedVariantImage} />}</div>

                {/* Right Column - All Product Info */}
                <div className="space-y-6 lg:w-1/2">
                    {/* Title & SKU */}
                    <div>
                        <h1 className="heading-2 lg:heading-1 mb-2">{product.name}</h1>
                        <p className="text-muted">SKU: {product.sku}</p>
                    </div>

                    {/* Description */}
                    {descriptionBlock && <ContentRenderer blocks={[descriptionBlock]} product={product} />}

                    {/* Actions (Add to Cart) */}
                    {actionsBlock && <ContentRenderer blocks={[actionsBlock]} product={product} onVariantSelect={handleVariantSelect} frames={frames} headlightCategories={headlightCategories} />}

                    {/* Technical Specs & Other Info - Now in right column */}
                    {otherBlocks.length > 0 && (
                        <div className="space-y-6 border-t border-neutral-200 pt-6">
                            <ContentRenderer blocks={otherBlocks} product={product} />
                        </div>
                    )}
                </div>
            </div>

            {/* Accessories */}
            {accessories.length > 0 && (
                <div className="mt-8 border-t border-neutral-200 pt-8 lg:mt-12 lg:pt-12">
                    <h2 className="heading-3 mb-6">Recommended Accessories</h2>
                    <ProductGrid items={accessories} />
                </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-8 border-t border-neutral-200 pt-8 lg:mt-12 lg:pt-12">
                    <h2 className="heading-3 mb-6">Related Products</h2>
                    <ProductGrid items={relatedProducts} />
                </div>
            )}
        </div>
    );
}
