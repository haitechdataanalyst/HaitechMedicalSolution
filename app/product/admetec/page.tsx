import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { AdmetecFlamingo } from "@/components/admetec/AdmetecFlamingo";
import { AdmetecLights } from "@/components/admetec/AdmetecLights";
import { ErgoMagnificationSelector } from "@/components/admetec/ErgoMagnificationSelector";
import { AdmetecAbout } from "@/components/admetec/AdmetecAbout";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";
import { BRAND_LEAD, BrandChipLinks, BrandCTA, BrandFeature, BrandHero, BrandStatement, MediaTile } from "@/components/brand/BrandSections";
import { getHeadlightsData, getProductBySlug, getProductPath } from "@/lib/catalog";
import { headlightFigures } from "@/lib/headlight-specs";

export const metadata: Metadata = getDynamicMetadata("Admetec | Premium Dental Loupes & Headlights", "Discover Admetec — world-leading manufacturer of dental loupes, surgical magnification, and LED headlights. Galilean, Prismatic & Ergo systems for precision care.", { path: "/product/admetec" });

const galileanMags = ["2.5x", "2.7x", "3.2x"].map((m) => ({ label: m, href: `/product-category/admetec/galilean-loupes/galilean-${m}` }));
const ergoMags = ["3.0x", "4.0x", "5.0x", "6.0x", "7.5x", "10x"].map((m) => ({ label: m, href: `/product-category/admetec/ergo-loupes/ergo-${m}` }));

export default async function AboutAdmetecPage() {
    const headlights = await getHeadlightsData();
    const lightModels = headlightFigures(headlights.categories).models;
    const flamingo = await getProductBySlug("flamingo");
    const flamingoHref = flamingo ? await getProductPath(flamingo) : null;

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

            <BrandFeature
                eyebrow="Galilean loupes"
                title={
                    <>
                        Lightweight.
                        <br />
                        Wide. Clear.
                    </>
                }
                cta={{ href: "/product-category/admetec/galilean-loupes/galilean-2.5x" }}
                media={<MediaTile href="/product-category/admetec/galilean-loupes/galilean-2.5x" src="/images/products/admetec/galilean/galilean-2.5x-blues-pink.jpg" alt="Admetec Galilean Loupes" />}
            >
                <p className={BRAND_LEAD}>
                    Galilean loupes offer a wide field of view with excellent depth of field. Perfect for general dentistry and routine procedures — compact and remarkably comfortable for all-day
                    wear.
                </p>
                <BrandChipLinks items={galileanMags} />
            </BrandFeature>

            <BrandFeature
                tone="gray"
                reverse
                eyebrow="Prismatic Ergo"
                title={
                    <>
                        Higher Power.
                        <br />
                        Better Posture.
                    </>
                }
                cta={{ href: "/product-category/admetec/ergo-loupes/ergo-5.0x" }}
                media={<MediaTile href="/product-category/admetec/ergo-loupes/ergo-5.0x" src="/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg" alt="Admetec Ergo Prismatic Loupes" />}
            >
                <p className={BRAND_LEAD}>
                    The Ergo series delivers higher magnification with superior optical clarity. An ergonomic declination angle promotes natural posture — ideal for detailed procedures that demand
                    precision.
                </p>
                <BrandChipLinks items={ergoMags} />
            </BrandFeature>

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
