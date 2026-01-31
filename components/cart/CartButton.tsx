"use client";

import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/icons";

export default function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className={cn("icon-btn relative", itemCount > 0 && "text-primary-600")}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <CartIcon size={24} />

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
