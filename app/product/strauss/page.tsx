import { Diamond, Zap, ThermometerSun, Target, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { HaitechPartnership } from "@/components/brand/HaitechPartnership";
import { BRAND_LEAD, BrandCTA, BrandFeature, BrandHero, BrandPillars, BrandProductCards, BrandSection, BrandStatement, BrandTags, MediaTile } from "@/components/brand/BrandSections";
import SectionHeader from "@/components/misc/SectionHeader";

export const metadata: Metadata = getDynamicMetadata("Strauss | Precision Diamond Burs for Dentistry", "Strauss Diamond Burs — precision-engineered rotary instruments delivering efficient cutting, smooth performance, and consistent clinical results for dental professionals.", { path: "/product/strauss" });

const advantages = [
    { icon: <Diamond />, title: "Uniform Diamond Distribution", description: "Precisely distributed diamond particles ensure consistent cutting efficiency across the entire working surface." },
    { icon: <Zap />, title: "Efficient Cutting", description: "Advanced bonding technology delivers smooth, effortless cutting performance with every use." },
    { icon: <ThermometerSun />, title: "Minimal Heat & Vibration", description: "Engineered to minimize heat generation and vibration for safer, more comfortable procedures." },
    { icon: <Target />, title: "Consistent Geometry", description: "Stable handling and predictable performance when working with enamel, dentin, and restorative materials." },
    { icon: <Clock />, title: "Long Service Life", description: "Known for exceptional sharpness and durability that outlast conventional diamond burs." },
    { icon: <ShieldCheck />, title: "Safety & Control", description: "Excellent control and visibility during procedures, prioritizing accuracy and patient safety." },
];

const burSeries = [
    {
        name: "A-Series",
        description: "Standard diamond burs for general preparation and restorative procedures.",
        image: "/images/products/strauss/a-series/A1M.jpg",
        href: "/product-category/strauss/a-series",
    },
    {
        name: "B-Series",
        description: "Fine-grit burs designed for contouring, adjustment, and finishing work.",
        image: "/images/products/strauss/b-series/B1M.jpg",
        href: "/product-category/strauss/b-series",
    },
    {
        name: "P-Series",
        description: "Specialty shapes and configurations for specific clinical indications.",
        image: "/images/products/strauss/p-series/PR13M.jpg",
        href: "/product-category/strauss/p-series",
    },
];

const burTiles = [
    { href: "/product-category/strauss/a-series", src: "/images/products/strauss/a-series/A2M.jpg", alt: "Strauss A-series bur" },
    { href: "/product-category/strauss/b-series", src: "/images/products/strauss/b-series/B2M.jpg", alt: "Strauss B-series bur" },
    { href: "/product-category/strauss/p-series", src: "/images/products/strauss/p-series/PR24M.jpg", alt: "Strauss P-series bur" },
    { href: "/product-category/strauss/a-series", src: "/images/products/strauss/a-series/A4M.jpg", alt: "Strauss bur closeup" },
];

export default function AboutStraussPage() {
    return (
        <>
            <BrandHero
                name="Strauss"
                tagline="Precision diamond technology · ISO 9001"
                description="Precision-engineered rotary instruments designed to deliver efficient cutting, smooth performance, and consistent clinical results for the modern dental practice."
                image="/images/products/strauss/strauss-banner.jpg"
                imageAlt="Strauss diamond burs"
                imageFit="contain"
                primary={{ href: "/product-category/strauss", label: "Explore Diamond Burs" }}
                secondary={{ href: "/support/contact", label: "Request Samples" }}
            />

            <BrandStatement
                quote="Diamond-sharp precision. Built to outlast, built to perform."
                stats={[
                    { v: "ISO 9001", l: "Certified Quality" },
                    { v: "3", l: "Bur Series" },
                    { v: "Min.", l: "Heat & Vibration" },
                    { v: "Long", l: "Service Life" },
                ]}
            />

            <BrandFeature
                eyebrow="Engineering"
                title={
                    <>
                        Excellence in
                        <br />
                        Every Bur.
                    </>
                }
                media={
                    <div className="grid grid-cols-2 gap-4">
                        {burTiles.map((t) => (
                            <MediaTile key={t.src} href={t.href} src={t.src} alt={t.alt} aspect="aspect-square" />
                        ))}
                    </div>
                }
            >
                <p className={BRAND_LEAD}>
                    Manufactured using high-quality materials and advanced bonding technology, Strauss burs provide excellent durability and uniform diamond distribution for reliable cutting
                    efficiency.
                </p>
                <p className="text-[15px] leading-relaxed text-neutral-500 md:text-base">
                    Specifically developed for precise cutting and controlled material removal in restorative dentistry — multiple shapes, grits, and configurations to support preparation, adjustment,
                    and finishing across all common clinical indications.
                </p>
            </BrandFeature>

            <BrandProductCards
                tone="gray"
                title="Three Series. Every Indication."
                subtitle="Covering preparation, adjustment, and finishing across all common clinical indications."
                items={burSeries}
            />

            <BrandSection>
                <SectionHeader title="Built for the Chair" subtitle="Clinical applications." />
                <BrandTags items={["Crown Preparation", "Cavity Preparation", "Material Adjustment", "Surface Finishing"]} />
            </BrandSection>

            <BrandPillars tone="gray" title="Six Clinical Advantages" subtitle="Why choose Strauss." items={advantages} />

            <HaitechPartnership brand="Strauss" />

            <BrandCTA
                title="Cut with Confidence"
                description="Request a sample set for your next case and see the difference in cutting efficiency and finish."
                primary={{ href: "/product-category/strauss", label: "Shop Diamond Burs" }}
                secondary={{ href: "/support/contact", label: "Contact Sales" }}
            />
        </>
    );
}
