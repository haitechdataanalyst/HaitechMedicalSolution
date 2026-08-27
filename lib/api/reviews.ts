import { apiFetch, PaginationMeta } from "./core";

export type Review = {
    id: string;
    userId: string;
    productId: string;
    orderId: string | null;
    rating: number;
    title: string | null;
    body: string | null;
    verifiedPurchase: boolean;
    approved: boolean;
    createdAt: string;
};

export type ReviewStats = {
    count: number;
    avg: string | null;
};

export type CreateReviewPayload = {
    productId: string;
    orderId?: string | null;
    rating: number;
    title?: string;
    body?: string;
};

export const reviewsApi = {
    getProductReviews: (productId: string, page = 1, limit = 10) =>
        apiFetch<{ reviews: Review[]; stats: ReviewStats; meta: PaginationMeta }>(
            `/api/v1/reviews/products/${encodeURIComponent(productId)}?page=${page}&limit=${limit}`
        ),

    createReview: (data: CreateReviewPayload) =>
        apiFetch<{ review: Review }>("/api/v1/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    deleteReview: (id: string) =>
        apiFetch(`/api/v1/reviews/${id}`, { method: "DELETE" }),

    adminGetPending: () =>
        apiFetch<{ reviews: Review[]; meta: PaginationMeta }>("/api/v1/reviews/pending"),

    adminApprove: (id: string, approved: boolean) =>
        apiFetch<{ review: Review }>(`/api/v1/reviews/${id}/approve`, {
            method: "PUT",
            body: JSON.stringify({ approved }),
        }),
};
