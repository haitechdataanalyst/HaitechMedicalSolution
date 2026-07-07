"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Truck, ShieldCheck, ArrowRight, FileText, GitCompareArrows } from "lucide-react";
import { Product, Category, SpecificationsBlock } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand, requiresConsultation } from "@/lib/brand";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { COMMERCE_ENABLED } from "@/lib/config";
import { useCompare } from "@/components/compare";

interface ProductCardProps {
    entity: Product | Category;
    href: string;
    image?: string;
}

function isProduct(entity: Product | Category): entity is Product {
    return "sku" in entity;
}

export default function ProductCard({ entity, href, image }: ProductCardProps) {
    const entityIsProduct = isProduct(entity);
    const product = entityIsProduct ? (entity as Product) : null;
    const displayImage = image || "/images/placeholder.jpg";
    const brand = product ? detectBrand(product.sku) : null;
    const needsQuote = brand ? requiresConsultation(brand.name) : false;
    const compareAllowed = brand?.name === "Admetec" || brand?.name === "Salli";
    const { toggle, isWished } = useWishlist();
    const wished = product ? isWished(String(product.id)) : false;
    const { add: compareAdd, remove: compareRemove, isAdded: compareIsAdded, items: compareItems } = useCompare();
    const compareAdded = product ? compareIsAdded(String(product.id)) : false;
    const compareFull = compareItems.length >= 3 && !compareAdded;

    return (
        <Link
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_8px_28px_rgba(31,182,205,0.12)] active:translate-y-0"
        >
            {/* Image zone */}
            <div className="relative aspect-square overflow-hidden bg-neutral-50">
                <Image
                    src={displayImage}
                    alt={entity.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                />

                {/* Brand chip — top-left */}
                {brand && (
                    <span className={cn("absolute left-2 top-2 rounded-full border px-2 py-0.5 text-xs font-bold tracking-wide", brand.cls)}>
                        {brand.name}
                    </span>
                )}

                {/* Wishlist heart — top-right */}
                {product && (
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
                )}
            </div>

            {/* Info zone — reading order: Price → Name → Trust → Action */}
            <div className="flex flex-1 flex-col px-3.5 pb-3 pt-3">

                {/* 1 — PRICE (dominant) */}
                {COMMERCE_ENABLED && entityIsProduct && (
                    <div className="mb-1 leading-none">
                        {product?.basePrice ? (
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

                {/* 2 — NAME */}
                <h3 className="mb-2.5 mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-neutral-700">
                    {entity.name}
                </h3>

                {entityIsProduct ? (
                    <div className="mt-auto space-y-2.5">
                        {/* 3 — TRUST SIGNALS */}
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

                        {/* 4 — CTA */}
                        <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                            {/* Compare toggle — Admetec and Salli only */}
                            {compareAllowed && <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!product) return;
                                    if (compareAdded) {
                                        compareRemove(String(product.id));
                                    } else if (!compareFull) {
                                        const specs = product.contentBlocks
                                            ?.filter((b): b is SpecificationsBlock => b.type === "specifications")
                                            .flatMap((b) => b.data.rows ?? b.data.specs ?? []);
                                        compareAdd({
                                            id: String(product.id),
                                            name: product.name,
                                            image: displayImage,
                                            href,
                                            price: product.basePrice,
                                            currency: product.currency,
                                            brand: brand?.name,
                                            specs,
                                        });
                                    }
                                }}
                                disabled={compareFull}
                                aria-label={compareAdded ? "Remove from compare" : "Add to compare"}
                                className={cn(
                                    "flex items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-semibold transition-all duration-150",
                                    compareAdded
                                        ? "bg-primary-100 text-primary-700"
                                        : compareFull
                                        ? "cursor-not-allowed text-neutral-200"
                                        : "text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600"
                                )}
                            >
                                <GitCompareArrows className="h-3 w-3" />
                                {compareAdded ? "Added" : "Compare"}
                            </button>}

                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-neutral-400 transition-colors duration-150 group-hover:text-primary-600">
                                    {needsQuote ? "Get Quote" : "View Details"}
                                </span>
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 transition-all duration-150 group-hover:bg-primary-500 group-hover:text-white">
                                    {needsQuote ? <FileText className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-auto border-t border-neutral-100 pt-2">
                        <span className="text-[11px] font-semibold text-primary-600">Browse range →</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
