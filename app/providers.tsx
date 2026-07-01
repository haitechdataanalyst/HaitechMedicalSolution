"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider, CartDrawer } from "@/components/cart";
import { WishlistProvider } from "@/components/cart/WishlistProvider";
import { CompareProvider } from "@/components/compare";
import { AuthProvider } from "@/components/auth/AuthProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <CompareProvider>
                            {children}
                            <CartDrawer />
                        </CompareProvider>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
