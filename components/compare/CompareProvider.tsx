"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CompareItem {
    id: string;
    name: string;
    image?: string;
    href: string;
    price?: number;
    currency?: string;
    brand?: string;
    specs?: Array<{ label: string; value: string }>;
}

interface CompareContextValue {
    items: CompareItem[];
    add: (item: CompareItem) => void;
    remove: (id: string) => void;
    clear: () => void;
    isAdded: (id: string) => boolean;
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CompareItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const add = useCallback((item: CompareItem) => {
        setItems((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, item];
        });
    }, []);

    const remove = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const clear = useCallback(() => {
        setItems([]);
        setIsOpen(false);
    }, []);

    const isAdded = useCallback((id: string) => items.some((i) => i.id === id), [items]);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    return (
        <CompareContext.Provider value={{ items, add, remove, clear, isAdded, isOpen, openModal, closeModal }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
    return ctx;
}
