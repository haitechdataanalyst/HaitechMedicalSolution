"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CartButton() {
    const { itemCount, toggleCart } = useCart();
    const { user, isLoading } = useAuth();

    // Hide for unauthenticated users
    if (isLoading || !user) return null;

    return (
        <button
            type="button"
            onClick={toggleCart}
            className={cn(
                "focus-visible:outline-primary-500 relative flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-2.5 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-3",
                itemCount > 0 ? "text-neutral-900" : "text-neutral-600"
            )}
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <span className="relative shrink-0">
                <ShoppingCart size={20} aria-hidden="true" />
                {itemCount > 0 && (
                    <span className="bg-primary-800 absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-xs leading-none font-semibold text-white tabular-nums">
                        {itemCount > 99 ? "99+" : itemCount}
                    </span>
                )}
            </span>
            <span className="hidden text-sm font-medium sm:block">Cart</span>
        </button>
    );
}
