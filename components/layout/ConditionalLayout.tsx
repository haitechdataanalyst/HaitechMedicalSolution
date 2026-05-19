"use client";

import { usePathname } from "next/navigation";
import { TopHeader, Header, Footer } from "@/components/layout";
import { PageTransition } from "@/components/layout/PageTransition";
import navigation from "@/data/navigation.json";
import siteConfig from "@/data/site-config.json";
import { DownloadCatalogButton, ScrollToTopButton, WhatsAppButton } from "@/components/ui";
import { Toaster } from "sonner";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

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
            <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-40">
                <WhatsAppButton
                    phoneNumber={siteConfig.company.phone}
                    iconOnly
                    size="md"
                    className="h-12 w-12 cursor-pointer rounded-full"
                    title="Chat on WhatsApp"
                    aria-label="Chat with us on WhatsApp"
                />
                <DownloadCatalogButton
                    iconOnly
                    size="md"
                    className="h-12 w-12 border-[0.5px]! cursor-pointer rounded-full bg-primary-500 text-white"
                    fileUrl="/catalouges/Haitech Medical Solutions Catalog.pdf"
                    fileName="Haitech Medical Solutions Catalog.pdf"
                    title="Download product catalog"
                    aria-label="Download product catalog PDF"
                />
                <ScrollToTopButton
                    iconOnly
                    size="md"
                    className="h-12 w-12 cursor-pointer rounded-full"
                    title="Back to top"
                    aria-label="Scroll back to top"
                />
            </div>
        </div>
    );
}
