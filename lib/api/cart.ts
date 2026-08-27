import { apiFetch } from "./core";

export type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    productName: string;
    productSku: string | null;
    quantity: number;
    unitPrice: number;
    customization: string | null;
    updatedAt: string;
};

export type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
};

export type AddCartItemPayload = {
    productId: string;
    productName: string;
    productSku?: string;
    quantity?: number;
    unitPrice?: number;
    customization?: string;
};

export type SyncCartPayload = AddCartItemPayload[];

export const cartApi = {
    getCart: () =>
        apiFetch<{ cart: Cart }>("/api/v1/cart"),

    addItem: (item: AddCartItemPayload) =>
        apiFetch<{ item: CartItem }>("/api/v1/cart/items", {
            method: "POST",
            body: JSON.stringify(item),
        }),

    updateItem: (id: string, quantity: number) =>
        apiFetch<{ item: CartItem | null }>(`/api/v1/cart/items/${id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        }),

    removeItem: (id: string) =>
        apiFetch(`/api/v1/cart/items/${id}`, { method: "DELETE" }),

    syncCart: (items: SyncCartPayload) =>
        apiFetch<{ cart: Cart }>("/api/v1/cart/sync", {
            method: "POST",
            body: JSON.stringify({ items }),
        }),

    clearCart: () =>
        apiFetch("/api/v1/cart", { method: "DELETE" }),
};
