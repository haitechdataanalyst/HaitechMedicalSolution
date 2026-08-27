import { apiFetch, PaginationMeta } from "./core";

export type ProductBrand = {
    name: string;
    productCount: number;
};

export type ProductVariant = {
    id: string;
    name: string;
    colorCode: string;
    images: string[];
    additionalPrice: number;
};

export type CompareProduct = {
    id: number;
    slug: string;
    name: string;
    brand: string | null;
    basePrice: number | null;
    currency: string;
    defaultImage: string;
    specs: Record<string, string>;
};

export const productsApi = {
    list: (params?: { search?: string; category?: number; brand?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.category != null) q.set("category", String(params.category));
        if (params?.brand) q.set("brand", params.brand);
        if (params?.minPrice != null) q.set("minPrice", String(params.minPrice));
        if (params?.maxPrice != null) q.set("maxPrice", String(params.maxPrice));
        if (params?.page) q.set("page", String(params.page));
        if (params?.limit) q.set("limit", String(params.limit));
        return apiFetch<{ items: unknown[]; meta: PaginationMeta }>(`/api/v1/products?${q}`, { skipAuth: true });
    },

    get: (id: string | number) =>
        apiFetch<{ product: unknown }>(`/api/v1/products/${id}`, { skipAuth: true }),

    getVariants: (id: string | number) =>
        apiFetch<{ product: unknown; variants: ProductVariant[] }>(`/api/v1/products/${id}/variants`, { skipAuth: true }),

    compare: (ids: (string | number)[]) =>
        apiFetch<{ products: CompareProduct[]; specKeys: string[] }>(
            `/api/v1/products/compare?ids=${ids.join(",")}`,
            { skipAuth: true }
        ),

    search: (q: string, page = 1, limit = 20) =>
        apiFetch<{ items: unknown[]; meta: PaginationMeta }>(
            `/api/v1/products/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
            { skipAuth: true }
        ),

    advancedSearch: (params: { q?: string; sort?: string; page?: number; limit?: number; [key: string]: unknown }) => {
        const q = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
            if (v != null) q.set(k, String(v));
        }
        return apiFetch<{ items: unknown[]; meta: PaginationMeta & { sort: string } }>(
            `/api/v1/products/search/advanced?${q}`,
            { skipAuth: true }
        );
    },

    listCategories: () =>
        apiFetch<{ categories: number[] }>("/api/v1/products/categories", { skipAuth: true }),

    listBrands: () =>
        apiFetch<{ brands: ProductBrand[] }>("/api/v1/products/brands", { skipAuth: true }),
};
