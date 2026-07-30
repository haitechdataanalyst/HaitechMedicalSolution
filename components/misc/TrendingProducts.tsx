"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
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
    const items = products.slice(0, 18); // 6 cols × 3 rows at the widest breakpoint

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

                {/* Tablet+: static grid — three rows at the widest breakpoint, not a shuffled carousel */}
                <div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {items.map((product) => (
                        <ProductCard key={product.slug} entity={product} href={product.path} image={productImage(product)} />
                    ))}
                </div>
            </div>
        </section>
    );
}
