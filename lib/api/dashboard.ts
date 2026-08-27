import { apiFetch } from "./core";

export type OrderStats = {
    period: string;
    since: string;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    byStatus: Record<string, number>;
};

export type UserStats = {
    period: string;
    totalUsers: number;
    newUsers: number;
};

export type TopProduct = {
    productId: string;
    productName: string;
    productBrand: string | null;
    totalQty: number;
    totalRevenue: number;
    orderCount: number;
};

export type DailyRevenue = {
    date: string;
    revenue: number;
    orderCount: number;
};

export const dashboardApi = {
    getSummary: () =>
        apiFetch<{ orders: OrderStats; users: UserStats; topProducts: TopProduct[] }>("/api/v1/dashboard/summary"),

    getOrderStats: (period: "today" | "week" | "month" | "year" = "month") =>
        apiFetch<OrderStats>(`/api/v1/dashboard/orders/stats?period=${period}`),

    getUserStats: (period: "today" | "week" | "month" | "year" = "month") =>
        apiFetch<UserStats>(`/api/v1/dashboard/users/stats?period=${period}`),

    getTopProducts: (limit = 10, period: "today" | "week" | "month" | "year" = "month") =>
        apiFetch<{ products: TopProduct[] }>(`/api/v1/dashboard/products/top?limit=${limit}&period=${period}`),

    getRevenueByDay: (days = 30) =>
        apiFetch<{ data: DailyRevenue[] }>(`/api/v1/dashboard/revenue/daily?days=${days}`),
};
