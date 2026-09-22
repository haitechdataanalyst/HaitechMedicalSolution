"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email";
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

function sanitizePostcode(input: string): string {
    return input
        .trim()
        .replace(/[^\w\s\-]/g, "")
        .substring(0, 15);
}

// Rate limiting (in production, use Redis or similar persistent store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
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

const productQuoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100).transform(sanitizeString),
    email: z
        .string()
        .email("Please enter a valid email address")
        .max(255)
        .transform((val) => val.trim().toLowerCase()),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(20).transform(sanitizePhone),
    postcode: z.string().min(2, "Postcode is required").max(15).transform(sanitizePostcode),
    country: z.string().min(2, "Country is required").transform(sanitizeString),
    subject: z.string().min(3, "Subject must be at least 3 characters").max(200).transform(sanitizeString),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000).transform(sanitizeString),
    // Hidden fields
    productName: z.string().max(200).transform(sanitizeString),
    productSku: z.string().max(100).transform(sanitizeString),
    productId: z.string().max(50).transform(sanitizeString),
    selectedVariant: z
        .string()
        .max(200)
        .optional()
        .transform((val) => (val ? sanitizeString(val) : undefined)),
    // Anti-spam
    website: z.string().max(0).optional(),
    formTimestamp: z.string(),
});

export type ProductQuoteFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
};

export async function submitProductQuote(prevState: ProductQuoteFormState, formData: FormData): Promise<ProductQuoteFormState> {
    try {
        // Rate limiting by IP
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const clientIp = forwardedFor?.split(",")[0].trim() || "unknown";

        if (!checkRateLimit(clientIp)) {
            return {
                success: false,
                error: "Too many requests. Please wait a minute before trying again.",
            };
        }

        // Basic bot detection - check if honeypot field is filled
        const honeypot = formData.get("website");
        if (honeypot && honeypot.toString().length > 0) {
            console.warn("Bot detected: honeypot field filled");
            return { success: false, error: "An error occurred. Please try again." };
        }

        // Check form timestamp (basic time-based bot detection)
        const timestamp = formData.get("formTimestamp");
        if (timestamp) {
            const formAge = Date.now() - parseInt(timestamp.toString());
            if (formAge < 2000) {
                console.warn("Bot detected: form submitted too quickly");
                return { success: false, error: "An error occurred. Please try again." };
            }
            if (formAge > 3600000) {
                return { success: false, error: "Form session expired. Please refresh the page." };
            }
        }

        // Validate input
        const validatedFields = productQuoteSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            postcode: formData.get("postcode"),
            country: formData.get("country"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            productName: formData.get("productName"),
            productSku: formData.get("productSku"),
            productId: formData.get("productId"),
            selectedVariant: formData.get("selectedVariant"),
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

        // Prepare email content
        const emailSubject = data.name ? `Product Quote Request: ${data.productName} - ${data.name}` : `Product Quote Request: ${data.productName}`;

        const row = (label: string, value: string) => `
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#111827;font-size:14px;vertical-align:top;">${value}</td>
        </tr>`;

        const section = (title: string, rows: string) => `
      <h2 style="margin:20px 0 8px;font-size:12px;color:#0f766e;text-transform:uppercase;letter-spacing:0.6px;">${title}</h2>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>`;

        const emailHtml = `
<div style="background:#f3f4f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0f766e;padding:20px 24px;">
      <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Haitech Medical</p>
      <h1 style="margin:4px 0 0;color:#ffffff;font-size:20px;">New Product Quote Request</h1>
    </div>
    <div style="padding:24px;">
      ${section(
          "Customer",
          row("Name", data.name || "&mdash;") +
              row("Email", `<a href="mailto:${data.email}" style="color:#0f766e;text-decoration:none;">${data.email}</a>`) +
              row("Phone", `<a href="tel:${data.phone}" style="color:#0f766e;text-decoration:none;">${data.phone}</a>`) +
              row("Postcode", data.postcode || "&mdash;") +
              row("Country", data.country || "&mdash;")
      )}
      ${section(
          "Product",
          row("Product", data.productName || "&mdash;") +
              row("SKU", data.productSku || "&mdash;") +
              row("Product ID", data.productId || "&mdash;") +
              (data.selectedVariant ? row("Selected Variant", data.selectedVariant) : "")
      )}
      ${section("Request", row("Subject", data.subject || "&mdash;"))}
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Message</p>
        <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${data.message.replace(/\n/g, "<br>")}</p>
      </div>
    </div>
    <div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Sent from the product quote form at haitech-group.com</p>
    </div>
  </div>
</div>`;

        const variantLine = data.selectedVariant ? `\nSelected Variant: ${data.selectedVariant}` : "";

        const emailText = `
New Product Quote Request

Customer:
Name: ${data.name || "-"}
Email: ${data.email}
Phone: ${data.phone}
Postcode: ${data.postcode}
Country: ${data.country}

Product:
Product: ${data.productName}
SKU: ${data.productSku}
Product ID: ${data.productId}${variantLine}

Request:
Subject: ${data.subject}
Message:
${data.message}

---
Sent from the product quote form at haitech-group.com
    `;

        // Send email
        await sendEmail({
            to: process.env.QUOTE_EMAIL || process.env.CONTACT_EMAIL || "sales@haitech-group.com",
            from: process.env.EMAIL_FROM || process.env.SMTP_FROM || "sales@haitech-group.com",
            replyTo: data.email,
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
        });

        return { success: true };
    } catch (error) {
        console.error("Product quote submission error:", error);

        return {
            success: false,
            error: "Failed to submit quote request. Please try again or contact us directly.",
        };
    }
}
