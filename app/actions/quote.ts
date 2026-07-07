"use server";

import { z } from "zod";
import { sendQuoteEmail } from "@/lib/email";
import { generateQuotePDF } from "@/lib/pdf";
import { CartItem } from "@/types";
import { headers } from "next/headers";

// Sanitize string input — strip HTML tags and dangerous characters
function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, "")
        .replace(/[<>'"&;]/g, "")
        .replace(/\s+/g, " ")
        .substring(0, 5000);
}

function sanitizePhone(input: string): string {
    return input
        .trim()
        .replace(/[^\d\s\-+()]/g, "")
        .substring(0, 20);
}

// Rate limiting (in production, use Redis or similar persistent store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    if (record.count >= RATE_LIMIT_MAX_REQUESTS) return false;
    record.count++;
    return true;
}

// Zod schema for individual cart items (validate client JSON)
const cartItemSchema = z.object({
    productId: z.string().max(50),
    productName: z.string().max(200),
    sku: z.string().max(100),
    quantity: z.number().int().min(1).max(999),
    basePrice: z.number().min(0).optional(),
    customization: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    image: z.string().max(500).optional(),
});

const quoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100).transform(sanitizeString),
    email: z.string().email("Please enter a valid email address").max(255).transform((val) => val.trim().toLowerCase()),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(20).transform(sanitizePhone),
    company: z.string().max(200).optional().transform((val) => (val ? sanitizeString(val) : undefined)),
    message: z.string().max(5000).optional().transform((val) => (val ? sanitizeString(val) : undefined)),
    cartItems: z.string(),
    // Anti-spam
    website: z.string().max(0).optional(),
    formTimestamp: z.string(),
});

export type QuoteFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
};

export async function submitQuoteRequest(prevState: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
    try {
        // Debug: log incoming form keys and cartItems length to help trace aborted requests
        try {
            const keys: string[] = [];
            formData.forEach((v, k) => keys.push(k));
            const cartStr = formData.get("cartItems")?.toString() || "";
            console.log("[DEBUG] submitQuoteRequest received keys:", keys, "cartItems length:", cartStr.length);
        } catch (e) {
            console.log("[DEBUG] submitQuoteRequest: failed to inspect formData", e);
        }
        // Rate limiting by IP — use the rightmost value in X-Forwarded-For (set by the
        // trusted proxy/CDN) not the leftmost, which is client-supplied and spoofable.
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const parts = forwardedFor?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
        const clientIp = parts[parts.length - 1] || "unknown";

        if (!checkRateLimit(clientIp)) {
            return {
                success: false,
                error: "Too many requests. Please wait a minute before trying again.",
            };
        }

        // Bot detection — honeypot
        const honeypot = formData.get("website");
        if (honeypot && honeypot.toString().length > 0) {
            return { success: false, error: "An error occurred. Please try again." };
        }

        // Bot detection — timestamp
        const timestamp = formData.get("formTimestamp");
        if (timestamp) {
            const formAge = Date.now() - parseInt(timestamp.toString());
            if (formAge < 2000) {
                return { success: false, error: "An error occurred. Please try again." };
            }
            if (formAge > 3600000) {
                return { success: false, error: "Form session expired. Please refresh the page." };
            }
        }

        // Validate input
        const validatedFields = quoteSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            company: formData.get("company"),
            message: formData.get("message"),
            cartItems: formData.get("cartItems"),
            website: formData.get("website"),
            formTimestamp: formData.get("formTimestamp"),
        });

        if (!validatedFields.success) {
            const fieldErrors: Record<string, string> = {};
            validatedFields.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    fieldErrors[issue.path[0].toString()] = issue.message;
                }
            });
            return {
                success: false,
                error: "Please check the form for errors",
                fieldErrors,
            };
        }

        const data = validatedFields.data;

        // Parse and validate cart items with schema (don't trust raw client JSON)
        let cartItems: CartItem[];
        try {
            const rawItems = JSON.parse(data.cartItems);
            if (!Array.isArray(rawItems)) {
                return { success: false, error: "Invalid cart data" };
            }
            const parsed = rawItems.map((item: unknown) => cartItemSchema.parse(item));
            cartItems = parsed as CartItem[];
        } catch {
            return { success: false, error: "Invalid cart data. Please refresh and try again." };
        }

        if (cartItems.length === 0) {
            return { success: false, error: "Your cart is empty" };
        }

        if (cartItems.length > 100) {
            return { success: false, error: "Too many items in cart" };
        }

        // Generate PDF
        const pdfBuffer = await generateQuotePDF({
            customer: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
            },
            items: cartItems,
            message: data.message,
        });

        // Send email
        await sendQuoteEmail({
            to: process.env.QUOTE_EMAIL || process.env.CONTACT_EMAIL || "sales@haitech-group.com",
            customerEmail: data.email,
            customerName: data.name,
            customerPhone: data.phone,
            customerCompany: data.company,
            pdfBuffer,
            items: cartItems,
            message: data.message,
        });

        return { success: true };
    } catch (error) {
        console.error("Quote submission error:", error);

        return {
            success: false,
            error: "Failed to submit quote request. Please try again or contact us directly.",
        };
    }
}
