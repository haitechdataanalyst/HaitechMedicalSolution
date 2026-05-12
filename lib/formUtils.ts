import { headers } from "next/headers";
import type { ZodError } from "zod";

export async function getClientIp(): Promise<string> {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    return forwardedFor?.split(",")[0].trim() || "unknown";
}

/** Returns an error message string if a bot is detected, otherwise null. */
export function checkBotDetection(formData: FormData): string | null {
    const honeypot = formData.get("website");
    if (honeypot && honeypot.toString().length > 0) {
        return "An error occurred. Please try again.";
    }

    const timestamp = formData.get("formTimestamp");
    if (timestamp) {
        const formAge = Date.now() - parseInt(timestamp.toString(), 10);
        if (formAge < 2000) return "An error occurred. Please try again.";
        if (formAge > 3_600_000) return "Form session expired. Please refresh the page.";
    }

    return null;
}

export function extractFieldErrors(error: ZodError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
        if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
        }
    }
    return fieldErrors;
}
