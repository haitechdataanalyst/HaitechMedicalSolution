"use server";

import { z } from "zod";
import { sendQuoteEmail } from "@/lib/email";
import { generateQuotePDF } from "@/lib/pdf";
import { CartItem } from "@/types";

const quoteSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    company: z.string().optional(),
    message: z.string().optional(),
    cartItems: z.string(),
});

export type QuoteFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
};

export async function submitQuoteRequest(prevState: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
    try {
        // Validate input
        const validatedFields = quoteSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            company: formData.get("company"),
            message: formData.get("message"),
            cartItems: formData.get("cartItems"),
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
        const cartItems: CartItem[] = JSON.parse(data.cartItems);

        if (cartItems.length === 0) {
            return { success: false, error: "Your cart is empty" };
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
            to: process.env.QUOTE_EMAIL || "quotes@haitechmedical.com.au",
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
