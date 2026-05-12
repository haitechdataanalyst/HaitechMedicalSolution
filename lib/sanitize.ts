export function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, "")
        .replace(/[<>'"&;]/g, "")
        .replace(/\s+/g, " ")
        .substring(0, 5000);
}

export function sanitizePhone(input: string): string {
    return input
        .trim()
        .replace(/[^\d\s\-+()]/g, "")
        .substring(0, 20);
}

export function sanitizePostcode(input: string): string {
    return input
        .trim()
        .replace(/[^\w\s\-]/g, "")
        .substring(0, 15);
}
