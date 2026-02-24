"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { getEnhancedNavigation, getFooterNavigation, EnhancedNavItem } from "@/lib/navigation";

interface NavigationContextValue {
    headerNav: EnhancedNavItem[];
    footerNav: ReturnType<typeof getFooterNavigation>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

interface NavigationProviderProps {
    children: ReactNode;
}

/**
 * Navigation Provider
 * Provides cached navigation data to all child components
 * The data is computed once and memoized for the lifetime of the app
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
    // Memoize navigation data so it's only computed once
    const value = useMemo<NavigationContextValue>(
        () => ({
            headerNav: getEnhancedNavigation(),
            footerNav: getFooterNavigation(),
        }),
        []
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

/**
 * Hook to access navigation data
 * Throws an error if used outside of NavigationProvider
 */
export function useNavigation(): NavigationContextValue {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error("useNavigation must be used within a NavigationProvider");
    }

    return context;
}

/**
 * Hook to access only header navigation
 */
export function useHeaderNavigation(): EnhancedNavItem[] {
    return useNavigation().headerNav;
}

/**
 * Hook to access only footer navigation
 */
export function useFooterNavigation(): ReturnType<typeof getFooterNavigation> {
    return useNavigation().footerNav;
}
