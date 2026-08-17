"use client";

import { useEffect, useId, useRef } from "react";

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void }
            ) => string;
            remove: (widgetId: string) => void;
        };
    }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileWidgetProps {
    siteKey: string;
    onVerify: (token: string) => void;
}

export default function TurnstileWidget({ siteKey, onVerify }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const elementId = useId();

    useEffect(() => {
        let cancelled = false;

        function render() {
            if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: onVerify,
                "expired-callback": () => onVerify(""),
            });
        }

        if (window.turnstile) {
            render();
        } else {
            const existing = document.getElementById(SCRIPT_ID);
            if (existing) {
                existing.addEventListener("load", render);
            } else {
                const script = document.createElement("script");
                script.id = SCRIPT_ID;
                script.src = SCRIPT_SRC;
                script.async = true;
                script.onload = render;
                document.body.appendChild(script);
            }
        }

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, onVerify]);

    return <div ref={containerRef} id={`turnstile-${elementId}`} />;
}
