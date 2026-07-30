import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { NavigationProvider } from "@/components/layout";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SplashScreen, GoogleAnalytics } from "@/components/misc";

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
    title: {
        template: "%s | Haitech Medical",
        default: "Haitech Medical | Premium Medical & Dental Equipment",
    },
    description: "Your trusted partner for premium dental and medical equipment in India. Authorized distributor of Admetec, Medesy, Strauss, Salli, and more.",
    keywords: ["dental loupes", "medical equipment", "LED headlights", "surgical loupes", "dental equipment", "India", "Admetec", "Medesy"],
    openGraph: {
        type: "website",
        siteName: "Haitech Medical Solutions",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} bg-surface font-sans antialiased`}>
                <GoogleAnalytics />
                <SplashScreen />
                <Providers>
                    <NavigationProvider>
                        <ConditionalLayout>
                            {children}
                        </ConditionalLayout>
                    </NavigationProvider>
                </Providers>
            </body>
        </html>
    );
}
