"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * One delegated listener tracks every phone and WhatsApp *link* on the site,
 * so new tel:/wa.me anchors are covered without per-link wiring. WhatsApp
 * buttons that open via window.open() call trackEvent() themselves.
 */
export function AnalyticsEvents() {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const link = target.closest("a[href]");
            if (!link) return;

            const href = link.getAttribute("href") ?? "";
            if (href.startsWith("tel:")) {
                trackEvent("phone_click", { phone_number: href.slice(4), link_text: link.textContent?.trim() || undefined });
            } else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
                trackEvent("whatsapp_click", { location: "link" });
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => document.removeEventListener("click", handleClick, { capture: true });
    }, []);

    return null;
}
