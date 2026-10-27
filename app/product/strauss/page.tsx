import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { BrandAbout } from "@/components/brand/BrandAbout";
import { BrandCTA, BrandHero, BrandProductCards, BrandStatement, BrandTags } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Strauss | Precision Diamond Burs for Dentistry", "Strauss Diamond Burs — precision-engineered rotary instruments delivering efficient cutting, smooth performance, and consistent clinical results for dental professionals.", { path: "/product/strauss" });

const advantages = [
    { title: "Uniform Diamond Distribution", description: "Precisely distributed diamond particles ensure consistent cutting efficiency across the entire working surface." },
    { title: "Efficient Cutting", description: "Advanced bonding technology delivers smooth, effortless cutting performance with every use." },
    { title: "Minimal Heat & Vibration", description: "Engineered to minimize heat generation and vibration for safer, more comfortable procedures." },
    { title: "Consistent Geometry", description: "Stable handling and predictable performance when working with enamel, dentin, and restorative materials." },
    { title: "Long Service Life", description: "Known for exceptional sharpness and durability that outlast conventional diamond burs." },
    { title: "Safety & Control", description: "Excellent control and visibility during procedures, prioritizing accuracy and patient safety." },
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

            <BrandProductCards
                id="range"
                title="Three Series. Every Indication."
                subtitle="Covering preparation, adjustment, and finishing across all common clinical indications."
                items={burSeries}
            >
                <div className="text-center">
                    <p className="text-[13px] text-neutral-500">Built for the chair: clinical applications</p>
                    <div className="mt-3 flex justify-center">
                        <BrandTags items={["Crown Preparation", "Cavity Preparation", "Material Adjustment", "Surface Finishing"]} />
                    </div>
                </div>
            </BrandProductCards>

            <BrandAbout brand="Strauss" eyebrow="Engineering" title="Excellence in Every Bur." highlights={advantages.map((p) => ({ title: p.title, text: p.description }))}>
                <p>
                    Manufactured using high-quality materials and advanced bonding technology, Strauss burs provide excellent durability and uniform diamond distribution for reliable cutting
                    efficiency.
                </p>
                <p>
                    Specifically developed for precise cutting and controlled material removal in restorative dentistry — multiple shapes, grits, and configurations to support preparation, adjustment,
                    and finishing across all common clinical indications.
                </p>
            </BrandAbout>

            <BrandCTA
                title="Cut with Confidence"
                description="Request a sample set for your next case and see the difference in cutting efficiency and finish."
                primary={{ href: "/product-category/strauss", label: "Shop Diamond Burs" }}
                secondary={{ href: "/support/contact", label: "Contact Sales" }}
            />
        </>
    );
}
