"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { wishlistApi, getAccessToken } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

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

const readLocal = (key: string): string[] => {
    try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : [];
    } catch { return []; }
};

const writeLocal = (key: string, ids: string[]) => {
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch {}
};

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<string[]>([]);
    const { user, isLoading: authLoading } = useAuth();
    const prevUserIdRef = useRef<string | null | undefined>(undefined);

    // React to user login / logout / switch
    useEffect(() => {
        if (authLoading) return;

        const currentUserId = user?.id ?? null;
        if (prevUserIdRef.current === currentUserId) return;
        prevUserIdRef.current = currentUserId;

        // Guest: empty wishlist
        if (!currentUserId) {
            setItems([]);
            return;
        }

        const storageKey = `haitech-wishlist-${currentUserId}`;
        const local = readLocal(storageKey);
        setItems(local);

        if (!getAccessToken()) return;

        wishlistApi.getWishlist().then((res) => {
            if (res.success && res.data) {
                const serverIds = res.data.items.map((i) => i.productId);
                const merged = Array.from(new Set([...serverIds, ...local]));

                // Push any local-only items to backend
                const toSync = local.filter((id) => !serverIds.includes(id));
                toSync.forEach((id) => wishlistApi.addItem(id).catch(() => {}));

                setItems(merged);
                writeLocal(storageKey, merged);
            }
        }).catch(() => {});
    }, [authLoading, user?.id]);

    // Persist to localStorage only when a user is logged in
    useEffect(() => {
        if (!user?.id) return;
        writeLocal(`haitech-wishlist-${user.id}`, items);
    }, [items, user?.id]);

    const toggle = useCallback((id: string) => {
        setItems((prev) => {
            const isInList = prev.includes(id);
            const next = isInList ? prev.filter((x) => x !== id) : [...prev, id];

            if (getAccessToken()) {
                if (isInList) {
                    wishlistApi.removeItem(id).catch(() => {});
                } else {
                    wishlistApi.addItem(id).catch(() => {});
                }
            }
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
