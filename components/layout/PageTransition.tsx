/// <reference types="react/canary" />
"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

// On a client navigation the old page fades out and the new one fades in (CSS: .page-fade in globals.css).
// The header, footer and floating buttons sit outside <main>, so they stay put. Browsers without the
// View Transitions API fall back to the plain fade-in on .page-enter-fallback.
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <ViewTransition default="page-fade">
            <main key={pathname} className="page-enter-fallback flex-1">
                {children}
            </main>
        </ViewTransition>
    );
}
