import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { NavigationProvider } from "@/components/layout";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SplashScreen, GoogleAnalytics } from "@/components/misc";
import { AnalyticsEvents } from "@/components/misc/AnalyticsEvents";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

// Inter — the standard typeface for enterprise SaaS/technology brands (Stripe,
// Linear, GitHub, Vercel). Chosen over the previous Poppins because Poppins'
// geometric, rounded letterforms read as consumer/startup-friendly, while
// Inter is neutral, highly legible at every size, and signals precision and
// technical credibility — the tone a global medical technology brand needs.
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        template: "%s | Haitech Medical",
        default: "Haitech Medical | Premium Medical & Dental Equipment",
    },
    description: "Your trusted partner for premium dental and medical equipment in India. Authorized distributor of Admetec, Medesy, Strauss, Salli, and more.",
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_IN",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                {/* Marks JS support before first paint so collapsible sections start collapsed
                    without a layout shift, and stay fully open when JS is unavailable. */}
                <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
            </head>
            <body className={`${inter.variable} bg-surface font-sans antialiased`}>
                <GoogleAnalytics />
                <AnalyticsEvents />
                <SplashScreen />
                <Providers>
                    <NavigationProvider>
                        <ConditionalLayout>{children}</ConditionalLayout>
                    </NavigationProvider>
                </Providers>
            </body>
        </html>
    );
}
