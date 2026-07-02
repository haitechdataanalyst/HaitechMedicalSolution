"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Truck, ShieldCheck, ArrowRight, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand } from "@/lib/brand";
import { useWishlist } from "@/components/cart/WishlistProvider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { COMMERCE_ENABLED } from "@/lib/config";
import type { CSSProperties } from "react";

interface ProductWithPath extends Product {
    path: string;
}

interface TrendingProductsProps {
    products: ProductWithPath[];
}

function TrendingCard({ product }: { product: ProductWithPath }) {
    const image =
        product.defaultImage ||
        product.variants?.[0]?.image ||
        product.gallery?.[0] ||
        "/images/placeholder.jpg";

    const brand = detectBrand(product.sku);
    const { toggle, isWished } = useWishlist();
    const wished = isWished(String(product.id));

    return (
        <Link
            href={product.path}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-colors duration-200 hover:border-neutral-200 active:bg-neutral-50"
        >
            {/* Image zone */}
            <div className="relative aspect-square overflow-hidden bg-neutral-50">
                <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 165px, (max-width: 1024px) 33vw, 220px"
                />

                {/* Brand chip */}
                <span className={cn("absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide", brand.cls)}>
                    {brand.name}
                </span>

                {/* Wishlist */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(String(product.id)); }}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                    className={cn(
                        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-150",
                        wished
                            ? "border-rose-200 bg-rose-50 text-rose-500"
                            : "border-neutral-200 bg-white/90 text-neutral-300 opacity-0 group-hover:opacity-100 hover:border-rose-200 hover:text-rose-400"
                    )}
                >
                    <Heart className={cn("h-3.5 w-3.5 transition-all", wished && "fill-current text-rose-500")} />
                </button>
            </div>

            {/* Info zone */}
            <div className="flex flex-1 flex-col px-3.5 pb-3 pt-3">
                {COMMERCE_ENABLED && (
                    <div className="mb-1 leading-none">
                        {product.basePrice ? (
                            <>
                                <span className="text-[17px] font-bold tracking-tight text-neutral-900">
                                    {formatPrice(product.basePrice, product.currency ?? "INR")}
                                </span>
                                <span className="ml-1.5 text-[10px] font-normal text-neutral-400">incl. GST</span>
                            </>
                        ) : (
                            <span className="text-xs font-medium italic text-neutral-400">Price on request</span>
                        )}
                    </div>
                )}

                <h3 className="mb-2.5 mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-neutral-700">
                    {product.name}
                </h3>

                <div className="mt-auto space-y-2.5">
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-1">
                            <Truck className="h-2.5 w-2.5 text-emerald-500" />
                            Free Delivery
                        </span>
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="h-2.5 w-2.5 text-primary-500" />
                            Authorized
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                        <span className="text-[11px] font-semibold text-neutral-400 transition-colors duration-150 group-hover:text-primary-600">
                            View Details
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 transition-colors duration-150 group-hover:bg-primary-500 group-hover:text-white">
                            <ArrowRight className="h-3 w-3" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
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
                            <TrendingCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Tablet+: grid */}
                <div className="hidden grid-cols-3 gap-3 md:grid md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                    {items.map((product, i) => (
                        <ScrollReveal key={product.slug} variant="up" delay={Math.min(i, 4) * 65} threshold={0.05}>
                            <TrendingCard product={product} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
