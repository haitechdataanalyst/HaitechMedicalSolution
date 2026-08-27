import { apiFetch, PaginationMeta } from "./core";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productBrand: string | null;
    productSku: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

export type Order = {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentStatus: string;
    subtotal: number;
    tax: number;
    shippingFee: number;
    total: number;
    currency: string;
    notes?: string | null;
    items?: OrderItem[];
    createdAt: string;
};

export type CreateOrderPayload = {
    items: {
        productId: string;
        productName: string;
        productBrand?: string;
        productSku?: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    shippingAddressId?: string | null;
    notes?: string;
};

export type AdminOrderListParams = {
    page?: number;
    limit?: number;
    status?: OrderStatus;
};

export type Invoice = {
    invoiceNo: string;
    orderId: string;
    items: OrderItem[];
    total: number;
    currency: string;
};

// The single order API client — a near-duplicate `ordersApi` object existed
// alongside this one (same createOrder/getOrders/getOrder/cancelOrder, plus
// requestReturn/getInvoice this one lacked) with exactly one real caller
// across the whole app (the invoice page, for getInvoice). Merged here as
// part of Phase 6's lib/api.ts modularization — see [[feedback_architecture_policy]].
export const orderApi = {
    createOrder: (data: CreateOrderPayload) =>
        apiFetch<{ order: Order }>("/api/v1/orders", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getOrders: (page = 1, limit = 10) =>
        apiFetch<{ orders: Order[] }>(`/api/v1/orders?page=${page}&limit=${limit}`),

    getOrder: (id: string) => apiFetch<{ order: Order }>(`/api/v1/orders/${id}`),

    cancelOrder: (id: string) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/${id}/cancel`, { method: "PUT" }),

    requestReturn: (id: string, reason?: string) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/${id}/return`, {
            method: "PUT",
            body: JSON.stringify({ reason }),
        }),

    getInvoice: (id: string) =>
        apiFetch<{ invoice: Invoice }>(`/api/v1/orders/${id}/invoice`),

    adminGetOrders: (params?: AdminOrderListParams) => {
        const q = new URLSearchParams();
        if (params?.page) q.set("page", String(params.page));
        if (params?.limit) q.set("limit", String(params.limit));
        if (params?.status) q.set("status", params.status);
        const qs = q.toString();
        return apiFetch<{ orders: Order[]; meta: PaginationMeta }>(
            `/api/v1/orders/admin/all${qs ? `?${qs}` : ""}`
        );
    },

    adminUpdateOrderStatus: (id: string, status: OrderStatus) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/admin/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        }),
};
