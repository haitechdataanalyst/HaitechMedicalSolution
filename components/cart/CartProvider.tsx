"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { CartItem } from "@/types";
import { getCartItemKey } from "@/lib/cart";
import { cartApi, getAccessToken } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemKey: string) => void;
    updateQuantity: (itemKey: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    itemCount: 0,
    isOpen: false,
    openCart: () => {},
    closeCart: () => {},
    toggleCart: () => {},
});

export function useCart() {
    return useContext(CartContext);
}

const readLocal = (key: string): CartItem[] => {
    try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : [];
    } catch {
        return [];
    }
};

const writeLocal = (key: string, items: CartItem[]) => {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch {}
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoading: authLoading } = useAuth();
    const serverItemIdMap = useRef(new Map<string, string>());
    // undefined = not yet initialized, null = guest, string = userId
    const prevUserIdRef = useRef<string | null | undefined>(undefined);

    // React to user login / logout / switch
    useEffect(() => {
        if (authLoading) return;

        const currentUserId = user?.id ?? null;
        if (prevUserIdRef.current === currentUserId) return;
        prevUserIdRef.current = currentUserId;

        serverItemIdMap.current.clear();

        // Guest: always empty, nothing persisted
        if (!currentUserId) {
            setItems([]);
            return;
        }

        // Logged-in user: load from their scoped localStorage first
        const storageKey = `haitech-cart-${currentUserId}`;
        const local = readLocal(storageKey);
        setItems(local);

        const syncPayload = local.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.sku,
            quantity: item.quantity,
            unitPrice: item.basePrice ?? 0,
            customization: item.customization ? JSON.stringify(item.customization) : undefined,
        }));

        const doSync = async () => {
            try {
                const res = syncPayload.length > 0
                    ? await cartApi.syncCart(syncPayload)
                    : await cartApi.getCart();

                if (res.success && res.data) {
                    const serverItemsList = res.data.cart.items;
                    serverItemIdMap.current.clear();

                    const mapped: CartItem[] = serverItemsList.map((si) => {
                        let customization: Record<string, string | number> | undefined;
                        try {
                            if (si.customization) customization = JSON.parse(si.customization);
                        } catch {}

                        const item: CartItem = {
                            productId: si.productId,
                            productName: si.productName,
                            sku: si.productSku ?? "",
                            quantity: si.quantity,
                            basePrice: si.unitPrice,
                            customization,
                        };
                        serverItemIdMap.current.set(getCartItemKey(item), si.id);
                        return item;
                    });

                    setItems(mapped);
                    writeLocal(storageKey, mapped);
                }
            } catch {}
        };

        doSync();
    }, [authLoading, user?.id]);

    // Persist to localStorage only when a user is logged in
    useEffect(() => {
        if (!user?.id) return;
        writeLocal(`haitech-cart-${user.id}`, items);
    }, [items, user?.id]);

    const addItem = useCallback((newItem: CartItem) => {
        setItems((current) => {
            const key = getCartItemKey(newItem);
            const existingIndex = current.findIndex((item) => getCartItemKey(item) === key);
            if (existingIndex >= 0) {
                return current.map((item, i) =>
                    i === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            }
            return [...current, newItem];
        });

        setIsOpen(true);

        if (getAccessToken()) {
            cartApi.addItem({
                productId: newItem.productId,
                productName: newItem.productName,
                productSku: newItem.sku,
                quantity: newItem.quantity,
                unitPrice: newItem.basePrice ?? 0,
                customization: newItem.customization ? JSON.stringify(newItem.customization) : undefined,
            }).then((res) => {
                if (res.success && res.data) {
                    serverItemIdMap.current.set(getCartItemKey(newItem), res.data.item.id);
                }
            }).catch(() => {});
        }
    }, []);

    const removeItem = useCallback((itemKey: string) => {
        setItems((current) => current.filter((item) => getCartItemKey(item) !== itemKey));

        const serverId = serverItemIdMap.current.get(itemKey);
        if (getAccessToken() && serverId) {
            serverItemIdMap.current.delete(itemKey);
            cartApi.removeItem(serverId).catch(() => {});
        }
    }, []);

    const updateQuantity = useCallback(
        (itemKey: string, quantity: number) => {
            if (quantity <= 0) {
                removeItem(itemKey);
                return;
            }

            setItems((current) =>
                current.map((item) => (getCartItemKey(item) === itemKey ? { ...item, quantity } : item))
            );

            const serverId = serverItemIdMap.current.get(itemKey);
            if (getAccessToken() && serverId) {
                cartApi.updateItem(serverId, quantity).catch(() => {});
            }
        },
        [removeItem]
    );

    const clearCart = useCallback(() => {
        setItems([]);
        serverItemIdMap.current.clear();
        if (getAccessToken()) {
            cartApi.clearCart().catch(() => {});
        }
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
