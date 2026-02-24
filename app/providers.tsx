"use client";

import { ReactNode } from "react";
import { CartProvider, CartDrawer } from "@/components/cart";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <CartProvider>
            {children}
            <CartDrawer />
        </CartProvider>
    );
}
