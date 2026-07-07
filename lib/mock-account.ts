export const MOCK_USER = {
    name: "Dr. Ranvijay Singh",
    initials: "RS",
    email: "ranvijay@haitechclinic.com",
    phone: "+91 98765 43210",
    company: "Haitech Dental & Wellness Clinic",
    designation: "Chief Dentist & Director",
    gst: "27AABHC5678L1Z3",
    pan: "AABHC5678L",
    joinedDate: "March 2023",
};

export type OrderStatus = "delivered" | "confirmed" | "processing" | "shipped" | "pending" | "cancelled";

export interface MockOrderItem {
    name: string;
    sku: string;
    qty: number;
    price: number;
    currency: string;
}

export interface MockOrder {
    id: string;
    date: string;
    deliveredDate?: string;
    items: MockOrderItem[];
    total: number;
    currency: string;
    status: OrderStatus;
    address: string;
    tracking: string | null;
}

export const MOCK_ORDERS: MockOrder[] = [
    {
        id: "HT-2025-0118",
        date: "2025-05-10",
        deliveredDate: "2025-05-15",
        items: [
            { name: "Admetec Ergo 5.0x Dental Loupes", sku: "ADM-E-50", qty: 1, price: 220000, currency: "INR" },
            { name: "Comfort Frame — Matte Black", sku: "ADM-FR-MB", qty: 1, price: 0, currency: "INR" },
        ],
        total: 220000,
        currency: "INR",
        status: "delivered",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: "DTDC-BL9876543210",
    },
    {
        id: "HT-2025-0234",
        date: "2025-05-02",
        items: [
            { name: "Medesy Forceps 2500 Series", sku: "MED-F-2500", qty: 3, price: 149, currency: "USD" },
        ],
        total: 447,
        currency: "USD",
        status: "processing",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: null,
    },
    {
        id: "HT-2025-0301",
        date: "2025-04-22",
        items: [
            { name: "Salli Chin Tilt Saddle Chair", sku: "SAL-CT-01", qty: 1, price: 55999, currency: "INR" },
        ],
        total: 55999,
        currency: "INR",
        status: "shipped",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: "BLUEDART-BD4567890123",
    },
    {
        id: "HT-2025-0445",
        date: "2025-03-15",
        deliveredDate: "2025-03-22",
        items: [
            { name: "Admetec Ergo-V PRO Surgical Loupes", sku: "ADM-EV-PRO", qty: 1, price: 440000, currency: "INR" },
        ],
        total: 440000,
        currency: "INR",
        status: "delivered",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: "DTDC-BL1234567891",
    },
    {
        id: "HT-2025-0501",
        date: "2025-02-28",
        deliveredDate: "2025-03-05",
        items: [
            { name: "Strauss Diamond Bur A1", sku: "A1", qty: 10, price: 13, currency: "USD" },
            { name: "Strauss Diamond Bur B4", sku: "B4", qty: 5, price: 14, currency: "USD" },
        ],
        total: 200,
        currency: "USD",
        status: "delivered",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: "FEDEX-794653418889",
    },
    {
        id: "HT-2024-1201",
        date: "2024-12-10",
        deliveredDate: "2024-12-18",
        items: [
            { name: "Admetec LED Headlight + Battery Cable", sku: "ADM-LED-01", qty: 1, price: 85000, currency: "INR" },
        ],
        total: 85000,
        currency: "INR",
        status: "delivered",
        address: "12, Medical Hub, Andheri East, Mumbai 400069",
        tracking: "BLUEDART-BD1234567890",
    },
];

export interface MockAddress {
    id: string;
    label: string;
    isDefault: boolean;
    name: string;
    company: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
}

export const MOCK_ADDRESSES: MockAddress[] = [
    {
        id: "addr-1",
        label: "Clinic",
        isDefault: true,
        name: "Dr. Ranvijay Singh",
        company: "Haitech Dental & Wellness Clinic",
        line1: "12, Medical Hub, 2nd Floor",
        line2: "Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        pin: "400069",
        phone: "+91 98765 43210",
    },
    {
        id: "addr-2",
        label: "Residence",
        isDefault: false,
        name: "Dr. Ranvijay Singh",
        company: "",
        line1: "301, Sunrise Apartments",
        line2: "Borivali West",
        city: "Mumbai",
        state: "Maharashtra",
        pin: "400092",
        phone: "+91 98765 43210",
    },
];

export const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    delivered:  { label: "Delivered",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    confirmed:  { label: "Confirmed",  bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
    processing: { label: "Processing", bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
    shipped:    { label: "Shipped",    bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
    pending:    { label: "Pending",    bg: "bg-neutral-100",text: "text-neutral-600", border: "border-neutral-200", dot: "bg-neutral-400" },
    cancelled:  { label: "Cancelled", bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500"     },
};

export function formatOrderAmount(total: number, currency: string): string {
    if (currency === "INR") {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(total);
}

export function formatOrderDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
