"use client";

import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/icons";

export default function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button onClick={toggleCart} className={cn("icon-btn relative cursor-pointer", itemCount > 0 && "text-primary-600")} aria-label={`Shopping cart with ${itemCount} items`}>
      <CartIcon size={24} />

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <span className="bg-primary-600 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</span>
      )}
    </button>
  );
}
