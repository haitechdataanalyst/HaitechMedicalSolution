"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { CartItem } from "@/types";
import { getCartItemKey } from "@/lib/cart";

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

const CART_STORAGE_KEY = "haitech-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load cart:", e);
            }
        }
        setMounted(true);
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, mounted]);

    const addItem = useCallback((newItem: CartItem) => {
        setItems((current) => {
            const newItemKey = getCartItemKey(newItem);
            const existingIndex = current.findIndex((item) => getCartItemKey(item) === newItemKey);

            if (existingIndex >= 0) {
                // Update quantity of existing item
                return current.map((item, index) => (index === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item));
            }

            // Add new item
            return [...current, newItem];
        });

        // Open cart when adding item
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((itemKey: string) => {
        setItems((current) => current.filter((item) => getCartItemKey(item) !== itemKey));
    }, []);

    const updateQuantity = useCallback(
        (itemKey: string, quantity: number) => {
            if (quantity <= 0) {
                removeItem(itemKey);
                return;
            }

            setItems((current) => current.map((item) => (getCartItemKey(item) === itemKey ? { ...item, quantity } : item)));
        },
        [removeItem]
    );

    const clearCart = useCallback(() => {
        setItems([]);
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
