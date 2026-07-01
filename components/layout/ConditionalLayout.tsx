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

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

// Pill expands on hover (desktop); icon-only on mobile to save screen space
const PILL = "group flex items-center overflow-hidden rounded-full transition-all duration-300";
const ICON_WRAP = "flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12";
const LABEL = "hidden sm:block max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[120px] group-hover:pr-4";

function FloatingButtons() {
    const { items } = useCompare();
    const hasCompareBar = items.length > 0;

    const handleWhatsApp = () => {
        const clean = siteConfig.company.phone.replace(/\D/g, "");
        window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
    };

    const bottom = hasCompareBar
        ? "calc(68px + env(safe-area-inset-bottom, 0px) + 1rem)"
        : "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)";

    return (
        <div
            className="fixed right-4 z-40 flex flex-col gap-2 transition-all duration-300 sm:right-6"
            style={{ bottom }}
        >
            {/* Get a Quote */}
            <Link
                href="/support/contact"
                className={`${PILL} bg-primary-500 shadow-[0_4px_16px_-2px_rgb(31_182_205/0.5)] hover:shadow-[0_6px_24px_-2px_rgb(31_182_205/0.6)]`}
                aria-label="Get a Quote"
            >
                <span className={`${ICON_WRAP} text-white`}>
                    <MessageSquare size={18} />
                </span>
                <span className={`${LABEL} text-white`}>Get a Quote</span>
            </Link>

            {/* WhatsApp — pulse ring only on icon circle */}
            <div className="relative">
                <span className="pointer-events-none absolute left-0 top-0 h-11 w-11 rounded-full bg-whatsapp animate-whatsapp-ping sm:h-12 sm:w-12" />
                <button
                    type="button"
                    onClick={handleWhatsApp}
                    className={`${PILL} relative bg-whatsapp hover:bg-[#20BD5A] active:bg-[#1DA851]`}
                    aria-label="Chat with us on WhatsApp"
                >
                    <span className={`${ICON_WRAP} text-white`}>
                        <WhatsAppIcon size={18} />
                    </span>
                    <span className={`${LABEL} text-white`}>WhatsApp</span>
                </button>
            </div>
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
                        toast: "!font-sans !rounded-2xl !border !border-neutral-200 !shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]",
                        title: "!text-sm !font-semibold !text-neutral-900",
                        description: "!text-xs !text-neutral-500",
                        actionButton: "!rounded-full !text-xs !font-semibold !bg-primary-500 !text-white hover:!bg-primary-600",
                        closeButton: "!rounded-full !border-neutral-200",
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
