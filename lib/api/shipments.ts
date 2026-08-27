import { apiFetch } from "./core";

export type Shipment = {
    id: string;
    orderId: string;
    awbNo: string | null;
    dtdcRefNo: string | null;
    carrier: string;
    status: string;
    labelUrl: string | null;
    originPincode: string | null;
    destinationPincode: string | null;
    estimatedDelivery: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
};

export type CreateShipmentPayload = {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientCity: string;
    recipientState: string;
    recipientPincode: string;
    weightGrams?: number;
    declaredValue?: number;
    productDescription?: string;
};

export const shipmentsApi = {
    checkPincodeServiceability: (pincode: string) =>
        apiFetch<{ serviceable: boolean; estimatedDays: number | null }>(
            `/api/v1/shipments/pincode/${pincode}/serviceability`,
            { skipAuth: true }
        ),

    trackByAwb: (awbNo: string) =>
        apiFetch<{ shipment: Shipment; tracking: unknown }>(`/api/v1/shipments/track/${encodeURIComponent(awbNo)}`),

    getOrderShipment: (orderId: string) =>
        apiFetch<{ shipment: Shipment; tracking: unknown }>(`/api/v1/shipments/orders/${orderId}`),

    adminCreateShipment: (orderId: string, data: CreateShipmentPayload) =>
        apiFetch<{ shipment: Shipment }>(`/api/v1/shipments/orders/${orderId}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    adminGetLabel: (awbNo: string) =>
        apiFetch<{ labelUrl: string | null; labelBase64: string | null }>(`/api/v1/shipments/${encodeURIComponent(awbNo)}/label`),
};
