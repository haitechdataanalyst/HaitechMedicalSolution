import { apiFetch } from "./core";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string | null;
    roles: string[];
    role: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
    authProvider: string;
    active: boolean;
    createdAt: string;
    modifiedAt: string;
};

export type Address = {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    landmark: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;
    isDefault: boolean;
};

export type UpdateProfilePayload = {
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string | null;
};

export const userApi = {
    getProfile: () => apiFetch<{ user: User }>("/api/v1/users/me"),

    updateProfile: (data: UpdateProfilePayload) =>
        apiFetch<{ user: User }>("/api/v1/users/me", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    changePassword: (currentPassword: string, newPassword: string) =>
        apiFetch("/api/v1/users/me/password", {
            method: "PUT",
            body: JSON.stringify({ currentPassword, newPassword }),
        }),

    getAddresses: () => apiFetch<{ addresses: Address[] }>("/api/v1/users/me/addresses"),

    addAddress: (data: Omit<Address, "id" | "userId">) =>
        apiFetch<{ address: Address }>("/api/v1/users/me/addresses", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateAddress: (id: string, data: Partial<Omit<Address, "id" | "userId">>) =>
        apiFetch<{ address: Address }>(`/api/v1/users/me/addresses/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    deleteAddress: (id: string) =>
        apiFetch(`/api/v1/users/me/addresses/${id}`, { method: "DELETE" }),

    setDefaultAddress: (id: string) =>
        apiFetch<{ address: Address }>(`/api/v1/users/me/addresses/${id}/default`, { method: "PUT" }),
};
