"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

export default function CartButton() {
    const { itemCount, toggleCart } = useCart();

    return (
        <button
            onClick={toggleCart}
            className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-neutral-100",
                itemCount > 0 ? "text-primary-600" : "text-neutral-600"
            )}
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <div className="relative shrink-0">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                        {itemCount > 99 ? "99+" : itemCount}
                    </span>
                )}
            </div>
            <span className="hidden text-sm font-semibold sm:block">Cart</span>
        </button>
    );
}
