import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { TopHeader, Header, Footer, NavigationProvider } from "@/components/layout";
import navigation from "@/data/navigation.json";
import siteConfig from "@/data/site-config.json";
import { WhatsAppButton } from "@/components/ui";

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
                        <div className="flex min-h-screen flex-col">
                            <TopHeader />
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer sections={navigation.footer.sections} config={siteConfig} />
                            <div className="fixed right-6 bottom-6">
                                <WhatsAppButton phoneNumber={siteConfig.company.phone} iconOnly size="lg" className="h-16 w-16 cursor-pointer rounded-full" />
                            </div>
                        </div>
                    </NavigationProvider>
                </Providers>
            </body>
        </html>
    );
}
