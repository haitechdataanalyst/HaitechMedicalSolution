"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant, CartItem } from "@/types";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingCart, Check } from "lucide-react";
import { COMMERCE_ENABLED } from "@/lib/config";
import { SURFACE_CARD } from "@/components/ui/surfaces";

const TILE = "relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50";
const TILE_IMAGE = "object-contain p-6 mix-blend-multiply";
const TITLE = "text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900";

interface VariantCardProps {
    variant: ProductVariant;
    product: Product;
}

function VariantCard({ variant, product }: VariantCardProps) {
    const { addItem, openCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            productId: String(product.id),
            productName: `${product.name} — ${variant.name || variant.id}`,
            sku: variant.sku,
            quantity: 1,
            basePrice: variant.price ?? product.basePrice,
            image: variant.image,
        };
        addItem(cartItem);
        setAdded(true);
        openCart();
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className={`${SURFACE_CARD} flex h-full flex-col p-2`}>
            {/* Variant Image */}
            <div className={TILE}>
                <Image
                    src={variant.image}
                    alt={variant.name || variant.id}
                    fill
                    className={TILE_IMAGE}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
                {/* Variant Name */}
                <h3 className={TITLE}>{variant.name || variant.id}</h3>

                {/* SKU */}
                <p className="mt-1 grow text-[13px] text-neutral-500">SKU: {variant.sku}</p>

                {/* Add to Cart */}
                {COMMERCE_ENABLED && (
                <div className="mt-auto pt-4">
                    <Button variant={added ? "primary" : "outline"} className="w-full gap-2" onClick={handleAddToCart}>
                        {added ? <><Check className="h-4 w-4" aria-hidden="true" /> Added</> : <><ShoppingCart className="h-4 w-4" aria-hidden="true" /> Add to Cart</>}
                    </Button>
                </div>
                )}
            </div>
        </div>
    );
}

interface SingleProductCardProps {
    product: Product;
}

function SingleProductCard({ product }: SingleProductCardProps) {
    const { addItem, openCart } = useCart();
    const [added, setAdded] = useState(false);
    const image = product.defaultImage || product.gallery?.[0] || "/images/placeholder.jpg";

    const handleAddToCart = () => {
        const cartItem: CartItem = {
            productId: String(product.id),
            productName: product.name,
            sku: product.sku,
            quantity: 1,
            basePrice: product.basePrice,
            image: product.defaultImage,
        };
        addItem(cartItem);
        setAdded(true);
        openCart();
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className={`${SURFACE_CARD} mx-auto flex max-w-md flex-col p-2`}>
            {/* Product Image */}
            <div className={TILE}>
                <Image src={image} alt={product.name} fill className={TILE_IMAGE} sizes="(max-width: 640px) 100vw, 400px" />
            </div>

            <div className="flex flex-col px-4 pt-5 pb-4 text-center">
                {/* Product Name */}
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{product.name}</h3>

                {/* SKU */}
                <p className="mt-1 text-[13px] text-neutral-500">SKU: {product.sku}</p>

                {/* Add to Cart */}
                {COMMERCE_ENABLED && (
                <div className="mt-6">
                    <Button variant={added ? "primary" : "primary"} className="w-full gap-2" size="lg" onClick={handleAddToCart}>
                        {added ? <><Check className="h-4 w-4" aria-hidden="true" /> Added to Cart</> : <><ShoppingCart className="h-4 w-4" aria-hidden="true" /> Add to Cart</>}
                    </Button>
                </div>
                )}
            </div>
        </div>
    );
}

interface MedesyVariantsGridProps {
    product: Product;
}

export function MedesyVariantsGrid({ product }: MedesyVariantsGridProps) {
    const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;

    return (
        <>
            {hasVariants ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {product.variants!.map((variant) => (
                        <VariantCard key={variant.id} variant={variant} product={product} />
                    ))}
                </div>
            ) : (
                <SingleProductCard product={product} />
            )}
        </>
    );
}
