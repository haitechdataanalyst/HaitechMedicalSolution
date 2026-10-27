import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { AdmetecFlamingo } from "@/components/admetec/AdmetecFlamingo";
import { AdmetecLights } from "@/components/admetec/AdmetecLights";
import { ErgoMagnificationSelector } from "@/components/admetec/ErgoMagnificationSelector";
import { AdmetecAbout } from "@/components/admetec/AdmetecAbout";
import { AdmetecLoupes, type LoupeSeries } from "@/components/admetec/AdmetecLoupes";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";
import { BrandCTA, BrandHero, BrandStatement } from "@/components/brand/BrandSections";
import { getHeadlightsData, getProductBySlug, getProductPath } from "@/lib/catalog";
import { headlightFigures } from "@/lib/headlight-specs";

export const metadata: Metadata = getDynamicMetadata("Admetec | Premium Dental Loupes & Headlights", "Discover Admetec — world-leading manufacturer of dental loupes, surgical magnification, and LED headlights. Galilean, Prismatic & Ergo systems for precision care.", { path: "/product/admetec" });

export default async function AboutAdmetecPage() {
    const headlights = await getHeadlightsData();
    const lightModels = headlightFigures(headlights.categories).models;
    const flamingo = await getProductBySlug("flamingo");
    const flamingoHref = flamingo ? await getProductPath(flamingo) : null;
    const prismatic = await getProductBySlug("prismatic-loupe");
    const prismaticHref = prismatic ? await getProductPath(prismatic) : "/product-category/admetec";

    const loupeSeries: LoupeSeries[] = [
        {
            name: "Galilean",
            mags: "2.5x · 2.7x · 3.2x",
            description: "Lightweight, with a wide field and excellent depth of field. For general dentistry and routine procedures.",
            image: "/images/products/admetec/galilean/galilean-2.5x-blues-pink.jpg",
            href: "/product-category/admetec/galilean-loupes/galilean-2.5x",
        },
        {
            name: "Prismatic",
            mags: "3.8x · 4.8x · 5.8x · 7.2x",
            description: "Sharper detail at higher power.",
            image: "/images/products/admetec/prismatic/prismatic-1.jpg",
            href: prismaticHref,
        },
        {
            name: "Ergo",
            mags: "3.0x to 10x",
            description: "Higher magnification with an ergonomic declination angle that promotes natural posture.",
            image: "/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg",
            href: "/product-category/admetec/ergo-loupes/ergo-5.0x",
        },
        {
            name: "Ergo V & V Pro",
            mags: "3.8x to 10x",
            description: "Ergo loupes with adjustable magnification, in two models.",
            image: "/images/products/admetec/ergo-v/ergo-v-category.jpg",
            href: "/product-category/admetec/ergo-v-series",
            cta: "View series",
        },
    ];

    return (
        <>
            <BrandHero
                underName={<AdmetecBrandBadge size="brand" />}
                name="Admetec"
                tagline="Israeli precision, made for dentistry"
                description="World-leading manufacturer of dental loupes, surgical magnification systems, and LED headlights — empowering professionals with unmatched clarity and precision."
                image="/images/products/admetec/admetec-banner.jpg"
                imageAlt="Admetec dental loupes"
                primary={{ href: "/product-category/admetec", label: "Explore Loupes" }}
                secondary={{ href: "/our-headlights", label: "Explore Lights" }}
            />

            <BrandStatement
                quote="Precision magnification engineered for the clinicians who demand the best — because every detail matters in dentistry."
                stats={[
                    { v: "2.5x–10x", l: "Magnification Range" },
                    { v: "ISO", l: "Certified Quality" },
                    { v: "500+", l: "Clinicians Served" },
                    { v: String(lightModels), l: "LED Headlight Models" },
                ]}
            />

            <AdmetecLoupes series={loupeSeries} />

            {/* Ergo V / Ergo V Pro magnification selector */}
            <ErgoMagnificationSelector />

            {/* Lights get a full-width band of their own: both series, headline figures and a way into /our-headlights */}
            <AdmetecLights {...headlights} />

            {/* Flamingo, the loupe camera + light, gets its own section right after the lights */}
            {flamingo && flamingoHref && <AdmetecFlamingo product={flamingo} href={flamingoHref} />}

            <AdmetecAbout />

            <BrandCTA
                title="Try Before You Order"
                description="Book a fitting call — our team measures your working distance and interpupillary distance so your loupes are dialed in before they ship."
                primary={{ href: "/product-category/admetec", label: "Browse Products" }}
                secondary={{ href: "/support/contact", label: "Book a Fitting Call" }}
            />
        </>
    );
}
