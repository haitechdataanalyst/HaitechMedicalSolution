"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface WishlistContextValue {
    items: string[];
    toggle: (id: string) => void;
    isWished: (id: string) => boolean;
    count: number;
}

const WishlistContext = createContext<WishlistContextValue>({
    items: [],
    toggle: () => {},
    isWished: () => false,
    count: 0,
});

const STORAGE_KEY = "haitech-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {}
    }, []);

    const toggle = useCallback((id: string) => {
        setItems((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
            return next;
        });
    }, []);

    const isWished = useCallback((id: string) => items.includes(id), [items]);

    return (
        <WishlistContext.Provider value={{ items, toggle, isWished, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
