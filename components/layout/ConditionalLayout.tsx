"use client";

import { usePathname } from "next/navigation";
import { TopHeader, Header, Footer } from "@/components/layout";
import { PageTransition } from "@/components/layout/PageTransition";
import navigation from "@/data/navigation.json";
import siteConfig from "@/data/site-config.json";
import { Toaster } from "sonner";
import { CompareBar, CompareModal, useCompare } from "@/components/compare";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";

const AUTH_ROUTES = ["/login", "/signup", "/register", "/forgot-password", "/dashboard/update-password", "/auth/mfa-verify"];

// Two calm round actions. On hover-capable devices a label fades in beside the button (opacity/transform only).
const ACTION =
    "group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_6px_20px_-6px_rgba(15,23,42,0.35)] transition-[background-color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:active:scale-[0.94]";
const LABEL =
    "pointer-events-none absolute right-full mr-3 hidden translate-x-1 rounded-full bg-neutral-900/85 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-white opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 [@media(hover:hover)]:block";

function FloatingButtons() {
    const { items } = useCompare();
    const hasCompareBar = items.length > 0;

    const handleWhatsApp = () => {
        const clean = siteConfig.company.phone.replace(/\D/g, "");
        trackEvent("whatsapp_click", { location: "floating_button" });
        window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
    };

    const bottom = hasCompareBar ? "calc(68px + env(safe-area-inset-bottom, 0px) + 1rem)" : "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)";

    return (
        <div className="floating-actions fixed right-4 z-40 flex flex-col gap-3 sm:right-6" style={{ bottom }}>
            {/* Get a Quote */}
            <Link href="/support/contact" className={`${ACTION} bg-primary-800 hover:bg-primary-900`} aria-label="Get a Quote">
                <MessageSquare size={20} aria-hidden="true" />
                <span className={LABEL}>Get a Quote</span>
            </Link>

            {/* WhatsApp */}
            <button type="button" onClick={handleWhatsApp} className={`${ACTION} bg-whatsapp hover:bg-[#20BD5A] active:bg-[#1DA851]`} aria-label="Chat with us on WhatsApp">
                <WhatsAppIcon size={20} aria-hidden="true" />
                <span className={LABEL}>WhatsApp</span>
            </button>
        </div>
    );
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuth = AUTH_ROUTES.some((r) => pathname === r);

    if (isAuth) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Toaster
                position="bottom-right"
                richColors
                closeButton
                toastOptions={{
                    classNames: {
                        toast: "!font-sans !rounded-2xl !border-0 !shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_18px_48px_-16px_rgba(15,23,42,0.28)]",
                        title: "!text-[15px] !font-semibold !tracking-[-0.01em] !text-neutral-900",
                        description: "!text-[13px] !text-neutral-600",
                        actionButton: "!rounded-full !text-[13px] !font-semibold !bg-primary-800 !text-white hover:!bg-primary-900",
                        closeButton: "!rounded-full !border-0 !bg-white !text-neutral-500 !shadow-[0_0_0_1px_rgba(15,23,42,0.08)] hover:!text-neutral-900",
                    },
                }}
            />
            <TopHeader />
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer sections={navigation.footer.sections} config={siteConfig} />
            <FloatingButtons />
            <CompareBar />
            <CompareModal />
        </div>
    );
}
