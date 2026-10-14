"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { getCompareBlockReason } from "@/lib/compare-group";
import type { CompareGroup } from "@/lib/compare-group";

export const MAX_COMPARE_ITEMS = 3;

export interface CompareItem {
    id: string;
    name: string;
    image?: string;
    href: string;
    price?: number;
    currency?: string;
    brand?: string;
    specs?: Array<{ label: string; value: string }>;
    /** Only products in the same group can be compared (see lib/compare-group.ts). */
    group: CompareGroup;
}

interface CompareContextValue {
    items: CompareItem[];
    /** The group everything in the comparison belongs to, or null when it is empty. */
    activeGroup: CompareGroup | null;
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

    const add = useCallback(
        (item: CompareItem) => {
            if (items.some((existing) => existing.id === item.id)) return;

            const blocked = getCompareBlockReason(
                items.map((existing) => existing.group),
                item.group,
                MAX_COMPARE_ITEMS
            );

            if (blocked === "different-group") {
                toast("Compare works within one category", {
                    description: `You're comparing ${items[0].group.label}. ${item.name} is in ${item.group.label}, so it can't be added.`,
                    action: { label: "Start new comparison", onClick: () => setItems([item]) },
                });
                return;
            }
            if (blocked === "full") {
                toast(`You can compare up to ${MAX_COMPARE_ITEMS} products at a time`);
                return;
            }
            setItems((prev) => [...prev, item]);
        },
        [items]
    );

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
    const activeGroup = items[0]?.group ?? null;

    return <CompareContext.Provider value={{ items, activeGroup, add, remove, clear, isAdded, isOpen, openModal, closeModal }}>{children}</CompareContext.Provider>;
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
    return ctx;
}
