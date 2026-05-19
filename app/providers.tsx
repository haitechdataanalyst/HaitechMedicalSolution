"use client";

import { ReactNode } from "react";
import { CartProvider, CartDrawer } from "@/components/cart";
import { WishlistProvider } from "@/components/cart/WishlistProvider";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <WishlistProvider>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </WishlistProvider>
    );
}
