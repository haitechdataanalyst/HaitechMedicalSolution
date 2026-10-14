"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, FileText, GitCompareArrows, Plus } from "lucide-react";
import { Product, Category, SpecificationsBlock } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand, requiresConsultation } from "@/lib/brand";
import { productImageAlt } from "@/lib/product-seo";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { COMMERCE_ENABLED, shouldShowPrice } from "@/lib/config";
import { startsFrom } from "@/lib/product-pricing";
import { useCompare } from "@/components/compare";
import { getCompareGroup } from "@/lib/compare-group.resolve";
import { isCatalogueProductId } from "@/lib/headlight-products";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";

interface ProductCardProps {
    entity: Product | Category;
    href: string;
    image?: string;
}

function isProduct(entity: Product | Category): entity is Product {
    return "sku" in entity;
}

// 44px hit areas around smaller visuals; focus ring on the hit area.
const HIT_AREA = "flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500";
const CHIP_SHADOW = "shadow-[0_1px_3px_rgba(15,23,42,0.12)]";

function CardCta({ needsQuote }: { needsQuote: boolean }) {
    const Icon = needsQuote ? FileText : ArrowRight;
    return (
        <span className="text-primary-700 ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap">
            {needsQuote ? "Get Quote" : "View"}
            <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
    );
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
    const { add: compareAdd, remove: compareRemove, isAdded: compareIsAdded, items: compareItems, activeGroup: compareActiveGroup } = useCompare();
    const compareAdded = product ? compareIsAdded(String(product.id)) : false;
    const compareFull = compareItems.length >= 3 && !compareAdded;
    // Only products from the same category family can be compared (e.g. loupes with loupes, never with a Salli chair)
    const compareMismatch = !!product && !!compareActiveGroup && !compareAdded && compareActiveGroup.key !== getCompareGroup(product.category).key;
    const { addItem } = useCart();
    const optionsCount = product?.variants?.length || product?.frameVariants?.availableFrames?.length || 0;
    const quickAddEligible = COMMERCE_ENABLED && !needsQuote && optionsCount <= 1 && !!product?.basePrice;

    return (
        <Link href={href} className={cn(INTERACTIVE_CARD, "h-full p-2")}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />

            {/* Image tile */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={displayImage}
                    alt={product ? productImageAlt(product) : entity.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                />

                {/* Options count / quick add — bottom-right of the tile */}
                {optionsCount > 1 ? (
                    <span className={cn("absolute right-2 bottom-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-700", CHIP_SHADOW)}>{optionsCount} options</span>
                ) : quickAddEligible && product ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                                productId: String(product.id),
                                productName: product.name,
                                sku: product.sku,
                                quantity: 1,
                                basePrice: product.basePrice,
                                image: displayImage,
                            });
                        }}
                        aria-label="Add to cart"
                        className={cn(HIT_AREA, "group/add absolute right-0 bottom-0 h-11 min-w-11 rounded-full px-1.5")}
                    >
                        <span
                            className={cn(
                                "text-primary-800 group-hover/add:bg-primary-800 flex h-8 items-center gap-1 rounded-full bg-white px-3 text-xs font-semibold transition-[background-color,color,transform] duration-200 ease-out group-hover/add:text-white motion-safe:group-active/add:scale-[0.97]",
                                CHIP_SHADOW
                            )}
                        >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            Add
                        </span>
                    </button>
                ) : null}
            </div>

            {/* Wishlist — 44px hit area around a 32px visual. Always visible on touch; revealed on hover only where hover exists. */}
            {product && isCatalogueProductId(product.id) && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(String(product.id));
                    }}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-pressed={wished}
                    className={cn(
                        HIT_AREA,
                        "absolute top-2 right-2 h-11 w-11 rounded-full transition-opacity duration-200 ease-out focus-visible:opacity-100",
                        !wished && "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                    )}
                >
                    <span
                        className={cn("flex h-8 w-8 items-center justify-center rounded-full", CHIP_SHADOW, wished ? "bg-rose-50 text-rose-500" : "bg-white/90 text-neutral-500 hover:text-rose-500")}
                    >
                        <Heart className={cn("h-4 w-4", wished && "fill-current")} aria-hidden="true" />
                    </span>
                </button>
            )}

            {/* Info */}
            <div className="@container flex flex-1 flex-col px-2.5 pt-4 pb-1">
                {brand && <p className="text-[13px] font-medium text-neutral-500">{brand.name}</p>}
                <h3 className="mt-0.5 line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{entity.name}</h3>

                {/* Fixed height (2 lines at leading-relaxed) so cards stay aligned in a row regardless of copy length */}
                {entityIsProduct && <p className="mt-1 line-clamp-2 h-[3.25em] text-[13px] leading-relaxed text-neutral-500">{product?.description}</p>}

                {shouldShowPrice(brand?.name) && entityIsProduct && (
                    <p className="mt-2">
                        {product?.basePrice ? (
                            <>
                                {startsFrom(product) && <span className="mr-1 text-xs text-neutral-500">From</span>}
                                <span className="text-base font-semibold text-neutral-900 tabular-nums">{formatPrice(product.basePrice, product.currency ?? "INR")}</span>
                                <span className="ml-1.5 text-xs text-neutral-500">incl. GST</span>
                            </>
                        ) : (
                            <span className="text-[13px] text-neutral-500">Price on request</span>
                        )}
                    </p>
                )}

                {entityIsProduct ? (
                    <div className="mt-auto pt-2">
                        <p className="truncate text-xs font-medium text-emerald-700">
                            Free Delivery<span className="hidden @[13rem]:inline"> · Authorized</span>
                        </p>
                        <div className="-ml-2 flex min-h-11 items-center">
                            {/* Compare toggle — Admetec and Salli only */}
                            {compareAllowed && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!product) return;
                                        if (compareAdded) {
                                            compareRemove(String(product.id));
                                        } else if (!compareFull) {
                                            const specs = product.contentBlocks?.filter((b): b is SpecificationsBlock => b.type === "specifications").flatMap((b) => b.data.rows ?? b.data.specs ?? []);
                                            compareAdd({
                                                id: String(product.id),
                                                name: product.name,
                                                image: displayImage,
                                                href,
                                                price: product.basePrice,
                                                currency: product.currency,
                                                brand: brand?.name,
                                                specs,
                                                group: getCompareGroup(product.category),
                                            });
                                        }
                                    }}
                                    disabled={compareFull}
                                    aria-label={compareAdded ? "Remove from compare" : compareMismatch ? `Add to compare — different category from ${compareActiveGroup?.label}` : "Add to compare"}
                                    title={compareMismatch ? `Compare works within one category — you are comparing ${compareActiveGroup?.label}` : undefined}
                                    aria-pressed={compareAdded}
                                    className={cn(HIT_AREA, "group/cmp h-11 min-w-11 rounded-full px-0.5 disabled:cursor-not-allowed")}
                                >
                                    <span
                                        className={cn(
                                            "flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium transition-colors duration-200 ease-out",
                                            compareAdded
                                                ? "bg-primary-50 text-primary-800"
                                                : compareFull || compareMismatch
                                                  ? "text-neutral-400 group-hover/cmp:bg-neutral-900/[0.05]"
                                                  : "text-neutral-600 group-hover/cmp:bg-neutral-900/[0.05] group-hover/cmp:text-neutral-900"
                                        )}
                                    >
                                        <GitCompareArrows className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        <span className="hidden @[13rem]:inline">{compareAdded ? "Added" : "Compare"}</span>
                                    </span>
                                </button>
                            )}
                            <CardCta needsQuote={needsQuote} />
                        </div>
                    </div>
                ) : (
                    <span className="text-primary-700 mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-medium">
                        Browse range
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                )}
            </div>
        </Link>
    );
}
