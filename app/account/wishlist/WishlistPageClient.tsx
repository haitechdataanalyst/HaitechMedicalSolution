"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Package, FileText } from "lucide-react";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand } from "@/lib/brand";
import { toast } from "sonner";

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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center shadow-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                    <Heart className="h-7 w-7 text-rose-300" />
                </div>
                <h3 className="mb-1 text-base font-bold text-neutral-800">Your wishlist is empty</h3>
                <p className="mb-5 text-sm text-neutral-500">Save products you're interested in for easy access later</p>
                <Link
                    href="/products"
                    className="rounded-xl bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {wishedProducts.map((product) => {
                const brand = detectBrand(product.sku);
                const image = product.defaultImage || product.gallery?.[0] || "/images/placeholder.jpg";
                return (
                    <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:border-primary-100 hover:shadow">

                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-neutral-50">
                            <Link href={product.path}>
                                <Image
                                    src={image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </Link>
                            {/* Brand chip */}
                            <span className={cn("absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[9px] font-bold", brand.cls)}>
                                {brand.name}
                            </span>
                            {/* Remove from wishlist */}
                            <button
                                onClick={() => { toggle(String(product.id)); toast("Removed from wishlist", { description: product.name, duration: 2000 }); }}
                                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                                aria-label="Remove from wishlist"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col px-4 py-4">
                            <div className="mb-1">
                                {product.basePrice ? (
                                    <>
                                        <span className="text-lg font-bold tracking-tight text-neutral-900">
                                            {formatPrice(product.basePrice, product.currency ?? "INR")}
                                        </span>
                                        <span className="ml-1.5 text-[10px] text-neutral-400">incl. GST</span>
                                    </>
                                ) : (
                                    <span className="text-xs italic text-neutral-400">Price on request</span>
                                )}
                            </div>
                            <Link href={product.path} className="mb-3 text-sm font-semibold text-neutral-800 line-clamp-2 hover:text-primary-700">
                                {product.name}
                            </Link>

                            <div className="mt-auto flex gap-2">
                                {brand.name === "Admetec" ? (
                                    <Link
                                        href={product.path}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-500 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
                                    >
                                        <FileText className="h-3.5 w-3.5" />
                                        Get Quote
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-600"
                                    >
                                        <ShoppingCart className="h-3.5 w-3.5" />
                                        Add to Cart
                                    </button>
                                )}
                                <Link
                                    href={product.path}
                                    className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-800"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
