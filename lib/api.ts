const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const ACCESS_TOKEN_KEY = "haitech_access_token";

export type ApiResponse<T = unknown> = {
    timestamp: string;
    statusCode: number;
    status: number;
    success: boolean;
    message: string;
    data?: T;
    error?: T;
    meta?: Record<string, unknown>;
};

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

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
};

export type UpdateProfilePayload = {
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string | null;
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

export type VerifyPaymentPayload = {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
};

export type GoogleSignInPayload = {
    credential: string; // raw Google ID token — verified server-side
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type AdminOrderListParams = {
    page?: number;
    limit?: number;
    status?: OrderStatus;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

// ── Token management ─────────────────────────────────────────────────────────

export const getAccessToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// ── Token refresh with queue ─────────────────────────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (err: unknown) => void;
}> = [];

const drainQueue = (err: unknown, token: string | null) => {
    pendingQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
    pendingQueue = [];
};

const doRefresh = async (): Promise<string | null> => {
    try {
        const res = await fetch(`${API_BASE}/api/v1/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!res.ok) {
            removeAccessToken();
            return null;
        }

        const body: ApiResponse<{ accessToken: string }> = await res.json();
        if (body.data?.accessToken) {
            setAccessToken(body.data.accessToken);
            return body.data.accessToken;
        }

        removeAccessToken();
        return null;
    } catch {
        removeAccessToken();
        return null;
    }
};

// ── Core fetch ───────────────────────────────────────────────────────────────

type FetchOptions = RequestInit & {
    skipAuth?: boolean;
    skipRefresh?: boolean;
};

export const apiFetch = async <T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
    const { skipAuth = false, skipRefresh = false, headers: extraHeaders, ...rest } = options;

    const buildHeaders = (token?: string | null): HeadersInit => ({
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-Api-Key": API_KEY } : {}),
        ...(extraHeaders as Record<string, string>),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    const initialToken = skipAuth ? null : getAccessToken();

    const doFetch = (token?: string | null) =>
        fetch(`${API_BASE}${endpoint}`, {
            ...rest,
            credentials: "include",
            headers: buildHeaders(token),
        });

    let res = await doFetch(initialToken);

    if (res.status === 401 && !skipRefresh && !skipAuth) {
        let newToken: string | null;

        if (isRefreshing) {
            newToken = await new Promise<string | null>((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            });
        } else {
            isRefreshing = true;
            newToken = await doRefresh();
            isRefreshing = false;
            drainQueue(newToken ? null : new Error("Session expired"), newToken);
        }

        if (newToken) {
            res = await doFetch(newToken);
        }
    }

    return res.json() as Promise<ApiResponse<T>>;
};

// ── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = {
    login: (email: string, password: string) =>
        apiFetch<{ user: User; accessToken: string; refreshToken: string }>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        }),

    register: (payload: RegisterPayload) =>
        apiFetch<{ user: User; accessToken: string; refreshToken: string }>("/api/v1/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
            skipAuth: true,
        }),

    logout: () =>
        apiFetch("/api/v1/auth/logout", {
            method: "POST",
            body: JSON.stringify({}),
        }),

    forgotPassword: (email: string) =>
        apiFetch("/api/v1/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
            skipAuth: true,
        }),

    resetPassword: (token: string, password: string) =>
        apiFetch("/api/v1/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
            skipAuth: true,
        }),

    googleSignIn: (payload: GoogleSignInPayload) =>
        apiFetch<{ user: User; accessToken: string; refreshToken: string }>("/api/v1/auth/google/signin", {
            method: "POST",
            body: JSON.stringify(payload),
            skipAuth: true,
        }),

    verifyEmail: (token: string) =>
        apiFetch(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
            skipAuth: true,
            skipRefresh: true,
        }),

    resendVerificationEmail: () =>
        apiFetch("/api/v1/auth/resend-verification-email", {
            method: "POST",
            body: JSON.stringify({}),
        }),

    getCsrfToken: () =>
        apiFetch("/api/v1/auth/csrf-token", {
            skipAuth: true,
            skipRefresh: true,
        }),
};

// ── User endpoints ───────────────────────────────────────────────────────────

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

// ── Order endpoints ──────────────────────────────────────────────────────────

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

// ── Payment endpoints ────────────────────────────────────────────────────────

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

// ── Cart types & endpoints ────────────────────────────────────────────────────

export type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    productName: string;
    productSku: string | null;
    quantity: number;
    unitPrice: number;
    customization: string | null;
    updatedAt: string;
};

export type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
};

export type AddCartItemPayload = {
    productId: string;
    productName: string;
    productSku?: string;
    quantity?: number;
    unitPrice?: number;
    customization?: string;
};

export type SyncCartPayload = AddCartItemPayload[];

export const cartApi = {
    getCart: () =>
        apiFetch<{ cart: Cart }>("/api/v1/cart"),

    addItem: (item: AddCartItemPayload) =>
        apiFetch<{ item: CartItem }>("/api/v1/cart/items", {
            method: "POST",
            body: JSON.stringify(item),
        }),

    updateItem: (id: string, quantity: number) =>
        apiFetch<{ item: CartItem | null }>(`/api/v1/cart/items/${id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        }),

    removeItem: (id: string) =>
        apiFetch(`/api/v1/cart/items/${id}`, { method: "DELETE" }),

    syncCart: (items: SyncCartPayload) =>
        apiFetch<{ cart: Cart }>("/api/v1/cart/sync", {
            method: "POST",
            body: JSON.stringify({ items }),
        }),

    clearCart: () =>
        apiFetch("/api/v1/cart", { method: "DELETE" }),
};

// ── Wishlist types & endpoints ────────────────────────────────────────────────

export type WishlistItem = {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
};

export const wishlistApi = {
    getWishlist: () =>
        apiFetch<{ items: WishlistItem[]; count: number }>("/api/v1/wishlist"),

    addItem: (productId: string) =>
        apiFetch<{ item: WishlistItem }>("/api/v1/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId }),
        }),

    removeItem: (productId: string) =>
        apiFetch(`/api/v1/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" }),
};

// ── Reviews types & endpoints ─────────────────────────────────────────────────

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

// ── Shipments types & endpoints ───────────────────────────────────────────────

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

// ── Notifications types & endpoints ──────────────────────────────────────────

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

// ── Coupons types & endpoints ─────────────────────────────────────────────────

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

// ── Dashboard types & endpoints ───────────────────────────────────────────────

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

// ── Extended Products API ─────────────────────────────────────────────────────

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

// ── Extended Orders API ───────────────────────────────────────────────────────

export const ordersApi = {
    getAll: (page = 1, limit = 10) =>
        apiFetch<{ orders: Order[] }>(`/api/v1/orders?page=${page}&limit=${limit}`),

    get: (id: string) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/${id}`),

    create: (data: CreateOrderPayload) =>
        apiFetch<{ order: Order }>("/api/v1/orders", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    cancel: (id: string) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/${id}/cancel`, { method: "PUT" }),

    requestReturn: (id: string, reason?: string) =>
        apiFetch<{ order: Order }>(`/api/v1/orders/${id}/return`, {
            method: "PUT",
            body: JSON.stringify({ reason }),
        }),

    getInvoice: (id: string) =>
        apiFetch<{ invoice: { invoiceNo: string; orderId: string; items: OrderItem[]; total: number; currency: string } }>(
            `/api/v1/orders/${id}/invoice`
        ),
};

// ── Zoho Inventory API ────────────────────────────────────────────────────────

export type ZohoInventoryItem = {
    id: string;
    name: string;
    sku: string | null;
    description: string | null;
    status: "active" | "inactive";
    itemType: string;
    unit: string | null;
    rate: number;
    purchaseRate: number | null;
    currency: string;
    stockOnHand: number;
    committedStock: number;
    availableForSale: number;
    reorderLevel: number | null;
    image: string | null;
    category: string | null;
    brand: string | null;
    taxName: string | null;
    taxRate: number | null;
    hsn: string | null;
    lastModified: string | null;
};

export type InventoryPagination = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type InventoryListResponse = {
    items: ZohoInventoryItem[];
    pagination: InventoryPagination;
    categories: string[];
    cachedAt: string;
};

export const inventoryApi = {
    getItems: (params?: {
        page?: number;
        perPage?: number;
        search?: string;
        category?: string;
        inStock?: boolean;
        refresh?: boolean;
    }) => {
        const qs = new URLSearchParams();
        if (params?.page)     qs.set("page",     String(params.page));
        if (params?.perPage)  qs.set("perPage",  String(params.perPage));
        if (params?.search)   qs.set("search",   params.search);
        if (params?.category) qs.set("category", params.category);
        if (params?.inStock)  qs.set("inStock",  "true");
        if (params?.refresh)  qs.set("refresh",  "true");
        const query = qs.toString();
        return apiFetch<InventoryListResponse>(`/api/v1/inventory/items${query ? `?${query}` : ""}`, { skipAuth: true });
    },

    getItem: (itemId: string) =>
        apiFetch<{ item: ZohoInventoryItem }>(`/api/v1/inventory/items/${encodeURIComponent(itemId)}`, { skipAuth: true }),

    sync: () =>
        apiFetch<{ synced: number; syncedAt: string }>("/api/v1/inventory/sync", { method: "POST" }),
};
