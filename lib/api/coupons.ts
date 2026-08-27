import { apiFetch, PaginationMeta } from "./core";

export type Coupon = {
    id: string;
    code: string;
    type: "percent" | "flat";
    value: number;
    minOrderAmount: number;
    maxUses: number | null;
    usedCount: number;
    perUserLimit: number;
    validFrom: string;
    validUntil: string | null;
    active: boolean;
};

export type CouponValidationResult = {
    coupon: Pick<Coupon, "id" | "code" | "type" | "value">;
    discount: number;
    finalTotal: number;
};

export const couponsApi = {
    validate: (code: string, orderTotal: number) =>
        apiFetch<CouponValidationResult>("/api/v1/coupons/validate", {
            method: "POST",
            body: JSON.stringify({ code, orderTotal }),
        }),

    adminList: (page = 1, limit = 20) =>
        apiFetch<{ coupons: Coupon[]; meta: PaginationMeta }>(`/api/v1/coupons?page=${page}&limit=${limit}`),

    adminCreate: (data: Omit<Coupon, "id" | "usedCount" | "active">) =>
        apiFetch<{ coupon: Coupon }>("/api/v1/coupons", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    adminUpdate: (id: string, data: Partial<Omit<Coupon, "id">>) =>
        apiFetch<{ coupon: Coupon }>(`/api/v1/coupons/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    adminDelete: (id: string) =>
        apiFetch(`/api/v1/coupons/${id}`, { method: "DELETE" }),
};
