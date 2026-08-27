import { apiFetch } from "./core";
import { Order } from "./orders";

export type VerifyPaymentPayload = {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
};

export const paymentApi = {
    createPaymentOrder: (orderId: string) =>
        apiFetch<{ razorpayOrderId: string; amount: number; currency: string; keyId: string }>(
            `/api/v1/payments/orders/${orderId}`,
            { method: "POST" }
        ),

    verifyPayment: (data: VerifyPaymentPayload) =>
        apiFetch<{ order: Order }>("/api/v1/payments/verify", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
