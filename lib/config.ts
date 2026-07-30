/**
 * Site-wide feature flags.
 * Flip COMMERCE_ENABLED to true when the store is ready to take orders.
 */
export const COMMERCE_ENABLED = false;

// Brands whose price should show even while COMMERCE_ENABLED is off — a
// separate concern from cart/checkout, which stays gated by that flag alone.
const PRICE_VISIBLE_BRANDS = new Set(["Salli"]);

export function shouldShowPrice(brandName?: string | null): boolean {
    return COMMERCE_ENABLED || (!!brandName && PRICE_VISIBLE_BRANDS.has(brandName));
}

/**
 * GA4 measurement ID — not a secret (it's visible in every page's rendered
 * HTML to any visitor), so it's a plain constant rather than an env var.
 * Property: Haitech Medical Solution · stream: medical.haitech-group.com
 */
export const GA_MEASUREMENT_ID = "G-H8JV9R0D5L";
