"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Carousel } from "@/components/ui";
import type { CSSProperties } from "react";

interface ProductWithPath extends Product {
    path: string;
}

interface TrendingProductsProps {
    products: ProductWithPath[];
}

function productImage(product: ProductWithPath) {
    return product.defaultImage || product.variants?.[0]?.image || product.gallery?.[0];
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
    const items = products.slice(0, 10);

    return (
        <section className="bg-neutral-50/60 py-10 md:py-14">
            <div className="container">
                <ScrollReveal variant="up">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-600">Featured Selection</p>
                            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">Trending Products</h2>
                        </div>
                        <Link href="/products" className="group flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
                            See all
                            <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Mobile: horizontal scroll */}
                <div
                    className="flex gap-3 overflow-x-auto pb-3 md:hidden [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" } as CSSProperties}
                >
                    {items.map((product) => (
                        <div key={`mob-${product.slug}`} className="w-[160px] flex-none">
                            <ProductCard entity={product} href={product.path} image={productImage(product)} />
                        </div>
                    ))}
                </div>

                {/* Tablet+: arrow-nav shelf */}
                <div className="hidden md:block">
                    <Carousel
                        showDots={false}
                        loop={false}
                        arrowSize="sm"
                        responsive={{ 0: { slidesToShow: 3, gap: 16 }, 1024: { slidesToShow: 4, gap: 16 }, 1280: { slidesToShow: 5, gap: 16 } }}
                    >
                        {items.map((product) => (
                            <ProductCard key={product.slug} entity={product} href={product.path} image={productImage(product)} />
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
