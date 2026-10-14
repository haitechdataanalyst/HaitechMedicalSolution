import { apiFetch, type ApiResponse } from "./core";

export type LeadSource = "contact_form" | "product_quote" | "cart_quote";

export interface LeadCartItemInput {
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice?: number;
    customization?: string;
}

export interface CreateLeadInput {
    source: LeadSource;
    name: string;
    email: string;
    phone: string;
    state?: string;
    postcode?: string;
    country?: string;
    subject: string;
    message?: string;
    productId?: number;
    productName?: string;
    productSku?: string;
    selectedVariant?: string;
    userAgent?: string | null;
    cartItems?: LeadCartItemInput[];
}

export interface Lead {
    id: string;
    emailSent: boolean;
}

/**
 * Persists a lead (rate-limit-checked server-side by email+IP). `clientIp`
 * is forwarded as X-Forwarded-For — the backend's app.set('trust proxy', 1)
 * reads exactly this one hop as the real client IP, since this call itself
 * originates from our own trusted Next.js server, not the browser directly.
 */
export const createLead = async (input: CreateLeadInput, clientIp: string | null): Promise<ApiResponse<{ lead: Lead }>> => {
    return apiFetch<{ lead: Lead }>("/api/v1/leads", {
        method: "POST",
        skipAuth: true,
        headers: clientIp ? { "X-Forwarded-For": clientIp } : undefined,
        body: JSON.stringify(input),
    });
};

export const markLeadEmailSent = async (leadId: string): Promise<ApiResponse<{ lead: Lead }>> => {
    return apiFetch<{ lead: Lead }>(`/api/v1/leads/${leadId}/email-sent`, {
        method: "PATCH",
        skipAuth: true,
    });
};
