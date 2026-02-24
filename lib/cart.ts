import { CartItem } from "@/types";

export function calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total: number, item: CartItem) => {
        const price = item.basePrice || 0;
        return total + price * item.quantity;
    }, 0);
}

export function formatCurrency(amount: number, currency: string = "AUD"): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: currency,
    }).format(amount);
}

export function generateCartSummary(items: CartItem[]): string {
    return items.map((item) => `${item.quantity}x ${item.productName} (${item.sku})`).join("\n");
}

export function getCartItemKey(item: CartItem): string {
    // Create a unique key based on product ID and customization
    const customKey = item.customization
        ? Object.entries(item.customization)
              .sort()
              .map(([k, v]) => `${k}:${v}`)
              .join("|")
        : "";
    return `${item.productId}-${customKey}`;
}
