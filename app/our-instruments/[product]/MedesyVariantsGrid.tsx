"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant, CartItem } from "@/types";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingCart, Check } from "lucide-react";

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
        <div className="group flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
            {/* Variant Image */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={variant.image}
                    alt={variant.name || variant.id}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            {/* Variant Name */}
            <div className="mb-3 flex justify-center">
                <span className="btn bg-primary-700 cursor-default px-4 py-2 text-sm text-white">{variant.name || variant.id}</span>
            </div>

            {/* SKU */}
            <p className="mb-4 grow text-center text-sm text-neutral-500">SKU: {variant.sku}</p>

            {/* Add to Cart */}
            <div className="mt-auto pt-2">
                <Button variant={added ? "primary" : "outline"} className="w-full gap-2" onClick={handleAddToCart}>
                    {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                </Button>
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
        <div className="group mx-auto flex max-w-md flex-col rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
            {/* Product Image */}
            <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image src={image} alt={product.name} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 400px" />
            </div>

            {/* Product Name */}
            <div className="mb-4 flex justify-center">
                <span className="btn bg-primary-700 cursor-default px-4 py-2 text-sm text-white">{product.name}</span>
            </div>

            {/* SKU */}
            <p className="mb-6 text-center text-sm text-neutral-500">SKU: {product.sku}</p>

            {/* Add to Cart */}
            <div className="mt-auto">
                <Button variant={added ? "primary" : "primary"} className="w-full gap-2" size="lg" onClick={handleAddToCart}>
                    {added ? <><Check className="h-4 w-4" /> Added to Cart</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                </Button>
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
