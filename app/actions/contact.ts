"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { headers } from "next/headers";

// Sanitize string input - remove potentially harmful characters
function sanitizeString(input: string): string {
    return (
        input
            .trim()
            // Remove any HTML tags
            .replace(/<[^>]*>/g, "")
            // Remove potentially dangerous characters for injection attacks
            .replace(/[<>'"&;]/g, "")
            // Normalize whitespace
            .replace(/\s+/g, " ")
            // Limit length
            .substring(0, 5000)
    );
}

// Sanitize phone number - only allow digits, spaces, dashes, parentheses, and plus
function sanitizePhone(input: string): string {
    return input
        .trim()
        .replace(/[^\d\s\-+()]/g, "")
        .substring(0, 20);
}

// Sanitize postcode - alphanumeric and spaces only
function sanitizePostcode(input: string): string {
    return input
        .trim()
        .replace(/[^\w\s\-]/g, "")
        .substring(0, 15);
}

// Rate limiting storage (in production, use Redis or similar)
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

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
}

// Validation schema with sanitization
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").transform(sanitizeString),
    email: z
        .string()
        .email("Please enter a valid email address")
        .max(255, "Email must be less than 255 characters")
        .transform((val) => val.trim().toLowerCase()),
    phone: z.string().min(6, "Phone number must be at least 6 digits").max(20, "Phone number is too long").transform(sanitizePhone),
    postcode: z.string().max(15, "Postcode is too long").transform(sanitizePostcode),
    country: z
        .string()
        .length(2, "Please select a country")
        .transform((val) => val.toUpperCase()),
    subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject must be less than 200 characters").transform(sanitizeString),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message must be less than 5000 characters").transform(sanitizeString),
    // Honeypot field - must stay empty; non-semantic name prevents browser auto-fill
    _h_check: z.string().max(0, "Bot detected").optional(),
    // Timestamp validation - form should take at least 1.5 seconds to fill
    formTimestamp: z.string().transform((val) => {
        const timestamp = parseInt(val, 10);
        const now = Date.now();
        const timeTaken = now - timestamp;
        // Form filled in less than 1.5 seconds is likely a bot
        if (timeTaken < 1500) {
            throw new Error("Form submitted too quickly");
        }
        // Form older than 1 hour is suspicious
        if (timeTaken > 3600000) {
            throw new Error("Form session expired");
        }
        return timestamp;
    }),
});

export type ContactFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
};

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
    try {
        // Get client IP for rate limiting
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const clientIp = forwardedFor?.split(",")[0].trim() || "unknown";

        // Check rate limit
        if (!checkRateLimit(clientIp)) {
            return {
                success: false,
                error: "Too many requests. Please wait a minute before trying again.",
            };
        }

        // Extract form data
        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            postcode: formData.get("postcode"),
            country: formData.get("country"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            _h_check: formData.get("_h_check"), // Honeypot
            formTimestamp: formData.get("formTimestamp"),
        };

        // Validate and sanitize
        const validatedFields = contactSchema.safeParse(rawData);

        if (!validatedFields.success) {
            const fieldErrors: Record<string, string> = {};
            validatedFields.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    fieldErrors[issue.path[0].toString()] = issue.message;
                }
            });

            // Check for bot-related errors
            if (fieldErrors._h_check || fieldErrors.formTimestamp) {
                // Don't reveal bot detection to potential attackers
                return {
                    success: false,
                    error: "An error occurred. Please try again.",
                };
            }

            return {
                success: false,
                error: "Please check the form for errors",
                fieldErrors,
            };
        }

        const data = validatedFields.data;

        // Send email
        await sendContactEmail({
            to: process.env.CONTACT_EMAIL || "sales@haitech-group.com",
            from: data.email,
            name: data.name,
            subject: data.subject,
            message: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Postcode: ${data.postcode}
Country: ${data.country}

Message:
${data.message}
      `.trim(),
        });

        return { success: true };
    } catch (error) {
        console.error("Contact form error:", error);

        return {
            success: false,
            error: "Failed to send message. Please try again or contact us directly.",
        };
    }
}
