/**
 * GA4 event helper. Sends through the gtag() that components/misc/GoogleAnalytics
 * installs (production only), so there is exactly one analytics pipeline. In
 * development, or before gtag has loaded, calls are a silent no-op.
 */

export type AnalyticsEventName = "quote_request" | "phone_click" | "whatsapp_click" | "generate_lead";

type EventParams = Record<string, string | number | undefined>;

declare global {
    interface Window {
        gtag?: (command: "event", name: string, params?: EventParams) => void;
    }
}

export function trackEvent(name: AnalyticsEventName, params: EventParams = {}): void {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", name, { ...params, page_path: window.location.pathname });
}
