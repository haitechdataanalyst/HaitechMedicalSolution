import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { TopHeader, Header, Footer } from "@/components/layout";
import navigation from "@/data/navigation.json";
import siteConfig from "@/data/site-config.json";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haitech Medical | Premium Medical & Dental Equipment",
  description:
    "Australia's leading supplier of premium dental loupes, LED headlights, and medical equipment. Quality products with exceptional service.",
  keywords: [
    "dental loupes",
    "medical equipment",
    "LED headlights",
    "surgical loupes",
    "dental equipment",
    "Australia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-surface`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <TopHeader />
            <Header navigation={navigation.header} />
            <main className="flex-1">{children}</main>
            <Footer sections={navigation.footer.sections} config={siteConfig} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
