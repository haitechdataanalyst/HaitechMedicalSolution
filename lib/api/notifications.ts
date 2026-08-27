import { apiFetch, PaginationMeta } from "./core";

export type Notification = {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string | null;
    data: Record<string, unknown> | null;
    read: boolean;
    createdAt: string;
};

export const notificationsApi = {
    getAll: (page = 1, limit = 20, unreadOnly = false) =>
        apiFetch<{ notifications: Notification[]; unreadCount: number; meta: PaginationMeta }>(
            `/api/v1/notifications?page=${page}&limit=${limit}&unread=${unreadOnly}`
        ),

    markRead: (id: string) =>
        apiFetch<{ notification: Notification }>(`/api/v1/notifications/${id}/read`, { method: "PUT" }),

    markAllRead: () =>
        apiFetch("/api/v1/notifications/read-all", { method: "PUT" }),

    delete: (id: string) =>
        apiFetch(`/api/v1/notifications/${id}`, { method: "DELETE" }),
};
