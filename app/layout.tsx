import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { NavigationProvider } from "@/components/layout";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
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
        <html lang="en">
            <body className={`${poppins.variable} bg-surface font-sans antialiased`}>
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
