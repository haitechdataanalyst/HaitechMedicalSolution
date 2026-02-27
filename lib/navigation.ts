import navigationData from "@/data/navigation.json";
import categoriesData from "@/data/categories.json";
import { Category, NavItem } from "@/types";

// Extended NavItem type for mega menu with additional category info
export interface MegaMenuItem extends NavItem {
    isNew?: boolean;
    description?: string;
    image?: string;
    categoryId?: number;
}

export interface MegaMenuColumn {
    title: string;
    href: string;
    items: MegaMenuItem[];
    aboutLink?: {
        label: string;
        href: string;
    };
}

export interface EnhancedNavItem extends NavItem {
    megaMenu?: MegaMenuColumn[];
    children?: EnhancedNavItem[];
}

// Cache for the enhanced navigation data
let cachedNavigation: EnhancedNavItem[] | null = null;

/**
 * Get category by slug from categories data
 */
function getCategoryBySlug(slug: string): Category | undefined {
    return (categoriesData as Category[]).find((cat) => cat.slug === slug);
}

/**
 * Get category by ID from categories data
 */
function getCategoryById(id: number): Category | undefined {
    return (categoriesData as Category[]).find((cat) => cat.id === id);
}

/**
 * Get child categories for a parent category
 */
function getChildCategories(parentId: number): Category[] {
    return (categoriesData as Category[]).filter((cat) => cat.parent === parentId).sort((a, b) => a.order - b.order);
}

/**
 * Get all root categories (parent brands like Admetec, Almadent, etc.)
 */
function getRootCategories(): Category[] {
    return (categoriesData as Category[]).filter((cat) => cat.parent === null).sort((a, b) => a.order - b.order);
}

/**
 * Build mega menu columns from categories
 * Each root category becomes a column with its children as items
 */
function buildMegaMenuFromCategories(): MegaMenuColumn[] {
    const rootCategories = getRootCategories();

    return rootCategories.map((rootCat) => {
        const childCategories = getChildCategories(rootCat.id);

        const items: MegaMenuItem[] = childCategories.map((child) => {
            // If child has a special page, append the category slug as a query parameter
            let href = child.specialPage || `/product-category/${rootCat.slug}/${child.slug}`;
            if (child.specialPage) {
                href = `${child.specialPage}?category=${child.slug}`;
            }

            return {
                label: child.name,
                href,
                description: child.description,
                image: child.image,
                categoryId: child.id,
            };
        });

        return {
            title: rootCat.name,
            href: rootCat.specialPage || `/product-category/${rootCat.slug}`,
            items,
            aboutLink: {
                label: `About ${rootCat.name}`,
                href: `/product/${rootCat.slug}`,
            },
        };
    });
}

/**
 * Enhance navigation items with mega menu data from categories
 * This combines the navigation.json structure with categories.json data
 */
function enhanceNavigation(navItems: NavItem[]): EnhancedNavItem[] {
    return navItems.map((item) => {
        // If this is the PRODUCTS link, build a mega menu from categories
        if (item.href === "/products") {
            return {
                ...item,
                megaMenu: buildMegaMenuFromCategories(),
                children: item.children?.map((child) => ({
                    ...child,
                })),
            };
        }

        // For other items, just pass through with enhanced children if any
        return {
            ...item,
            children: item.children?.map((child) => ({
                ...child,
            })),
        };
    });
}

/**
 * Get the enhanced navigation data
 * This function caches the result so it's only computed once
 */
export function getEnhancedNavigation(): EnhancedNavItem[] {
    if (cachedNavigation) {
        return cachedNavigation;
    }

    cachedNavigation = enhanceNavigation(navigationData.header);
    return cachedNavigation;
}

/**
 * Get footer navigation data
 */
export function getFooterNavigation() {
    return navigationData.footer;
}

/**
 * Clear the navigation cache (useful for development/testing)
 */
export function clearNavigationCache(): void {
    cachedNavigation = null;
}

/**
 * Get category path for breadcrumbs
 */
export function getCategoryPath(categorySlug: string): Category[] {
    const path: Category[] = [];
    let currentCat = getCategoryBySlug(categorySlug);

    while (currentCat) {
        path.unshift(currentCat);
        if (currentCat.parent) {
            currentCat = getCategoryById(currentCat.parent);
        } else {
            break;
        }
    }

    return path;
}

/**
 * Check if a category has subcategories
 */
export function hasSubcategories(categoryId: number): boolean {
    return getChildCategories(categoryId).length > 0;
}
