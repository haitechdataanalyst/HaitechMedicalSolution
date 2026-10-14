"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { COMMERCE_ENABLED } from "@/lib/config";
import type { HeadlightProduct } from "@/types";

const ADDED_FEEDBACK_MS = 2000;

/** Add-to-cart for a headlight model. Renders nothing while commerce is switched off, like every other product surface. */
export function HeadlightAddToCart({ product }: { product: HeadlightProduct }) {
    const { addItem, openCart } = useCart();
    const [added, setAdded] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

    if (!COMMERCE_ENABLED) return null;

    const handleAdd = () => {
        addItem({ productId: product.id, productName: product.name, sku: product.id, quantity: 1, image: product.image });
        setAdded(true);
        openCart();
        timer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
    };

    return (
        <Button variant={added ? "primary" : "outline"} className="w-full gap-2" onClick={handleAdd}>
            {added ? (
                <>
                    <Check className="h-4 w-4" aria-hidden="true" /> Added
                </>
            ) : (
                <>
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Add to Cart
                </>
            )}
        </Button>
    );
}
