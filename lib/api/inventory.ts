import { apiFetch } from "./core";

export type ZohoInventoryItem = {
    id: string;
    name: string;
    sku: string | null;
    description: string | null;
    status: "active" | "inactive";
    itemType: string;
    unit: string | null;
    rate: number;
    purchaseRate: number | null;
    currency: string;
    stockOnHand: number;
    committedStock: number;
    availableForSale: number;
    reorderLevel: number | null;
    image: string | null;
    category: string | null;
    brand: string | null;
    taxName: string | null;
    taxRate: number | null;
    hsn: string | null;
    lastModified: string | null;
};

export type InventoryPagination = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type InventoryListResponse = {
    items: ZohoInventoryItem[];
    pagination: InventoryPagination;
    categories: string[];
    cachedAt: string;
};

export const inventoryApi = {
    getItems: (params?: {
        page?: number;
        perPage?: number;
        search?: string;
        category?: string;
        inStock?: boolean;
        refresh?: boolean;
    }) => {
        const qs = new URLSearchParams();
        if (params?.page)     qs.set("page",     String(params.page));
        if (params?.perPage)  qs.set("perPage",  String(params.perPage));
        if (params?.search)   qs.set("search",   params.search);
        if (params?.category) qs.set("category", params.category);
        if (params?.inStock)  qs.set("inStock",  "true");
        if (params?.refresh)  qs.set("refresh",  "true");
        const query = qs.toString();
        return apiFetch<InventoryListResponse>(`/api/v1/inventory/items${query ? `?${query}` : ""}`, { skipAuth: true });
    },

    getItem: (itemId: string) =>
        apiFetch<{ item: ZohoInventoryItem }>(`/api/v1/inventory/items/${encodeURIComponent(itemId)}`, { skipAuth: true }),

    sync: () =>
        apiFetch<{ synced: number; syncedAt: string }>("/api/v1/inventory/sync", { method: "POST" }),
};
