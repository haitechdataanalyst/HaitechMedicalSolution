import { apiFetch } from "./core";

export type WishlistItem = {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
};

export const wishlistApi = {
    getWishlist: () =>
        apiFetch<{ items: WishlistItem[]; count: number }>("/api/v1/wishlist"),

    addItem: (productId: string) =>
        apiFetch<{ item: WishlistItem }>("/api/v1/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId }),
        }),

    removeItem: (productId: string) =>
        apiFetch(`/api/v1/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" }),
};
