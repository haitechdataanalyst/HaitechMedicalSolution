"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, FileText } from "lucide-react";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand, requiresConsultation } from "@/lib/brand";
import { toast } from "sonner";
import { PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";

interface WishlistProduct extends Product {
    path: string;
}

interface Props {
    products: WishlistProduct[];
}

export default function WishlistPageClient({ products }: Props) {
    const { items: wishedIds, toggle } = useWishlist();
    const { addItem, openCart } = useCart();

    const wishedProducts = products.filter((p) => wishedIds.includes(String(p.id)));

    const handleAddToCart = (product: WishlistProduct) => {
        addItem({
            productId: String(product.id),
            productName: product.name,
            sku: product.sku,
            quantity: 1,
            basePrice: product.basePrice,
            image: product.defaultImage,
        });
        toast.success("Added to cart", {
            description: product.name,
            duration: 3000,
            action: { label: "View Cart", onClick: openCart },
        });
    };

    if (wishedProducts.length === 0) {
        return (
            <div className={cn(SURFACE_CARD, "flex flex-col items-center justify-center px-6 py-20 text-center")}>
                <Heart className="mb-5 h-9 w-9 text-neutral-400" aria-hidden="true" />
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-neutral-900">Your wishlist is empty</h3>
                <p className="mt-1.5 text-[15px] text-neutral-500">Save products you&apos;re interested in for easy access later</p>
                <Link href="/products" className={cn(PILL_PRIMARY, "mt-7")}>
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishedProducts.map((product) => {
                const brand = detectBrand(product.sku);
                const image = product.defaultImage || product.gallery?.[0] || "/images/placeholder.jpg";
                return (
                    <li key={product.id} className={cn(SURFACE_CARD, "group flex flex-col p-2")}>
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
                            <Link href={product.path} tabIndex={-1} aria-hidden="true">
                                <Image
                                    src={image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    className="object-contain p-8 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                                />
                            </Link>
                            {/* Brand chip */}
                            <span className={cn("absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-xs font-medium", brand.cls)}>
                                {brand.name}
                            </span>
                            {/* Remove from wishlist */}
                            <button
                                type="button"
                                onClick={() => { toggle(String(product.id)); toast("Removed from wishlist", { description: product.name, duration: 2000 }); }}
                                className="absolute top-1 right-1 flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                                aria-label={`Remove ${product.name} from wishlist`}
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-neutral-900/[0.06]">
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
                            <Link href={product.path} className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900 hover:text-primary-700">
                                {product.name}
                            </Link>
                            <div className="mt-1.5">
                                {product.basePrice ? (
                                    <>
                                        <span className="text-[15px] font-semibold text-neutral-900 tabular-nums">
                                            {formatPrice(product.basePrice, product.currency ?? "INR")}
                                        </span>
                                        <span className="ml-1.5 text-xs text-neutral-500">incl. GST</span>
                                    </>
                                ) : (
                                    <span className="text-[13px] text-neutral-500">Price on request</span>
                                )}
                            </div>

                            <div className="mt-auto flex gap-2 pt-5">
                                {requiresConsultation(brand.name) ? (
                                    <Link href={product.path} className="btn btn-primary btn-md flex-1">
                                        <FileText className="h-4 w-4" aria-hidden="true" />
                                        Get Quote
                                    </Link>
                                ) : (
                                    <button type="button" onClick={() => handleAddToCart(product)} className="btn btn-primary btn-md flex-1">
                                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                                        Add to Cart
                                    </button>
                                )}
                                <Link href={product.path} className="btn btn-secondary btn-md">
                                    View
                                </Link>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
