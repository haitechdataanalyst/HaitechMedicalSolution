import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { BrandAbout } from "@/components/brand/BrandAbout";
import { BrandCTA, BrandHero, BrandProductCards, BrandStatement, MediaTile } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Medesy | Italian Dental Instruments & Equipment", "MEDESY — Italian dental instruments rooted in 600+ years of blade-making heritage from Maniago. Precision, craftsmanship, and innovation in every instrument.", { path: "/product/medesy" });

const heritage = [
    { title: "600+ Years of Heritage", description: "Rooted in Maniago, Italy — internationally recognized for six centuries as a center of excellence in blade production." },
    { title: "Family Legacy", description: "A brand built on generations of passion, precision, and craftsmanship — carrying forward a proud artisan tradition." },
    { title: "Artisan Expertise", description: "Blending centuries-old hand-crafting techniques with modern innovation to achieve unmatched quality." },
    { title: "Advanced Design", description: "Continuous innovation in ergonomics, materials, and functionality for superior instrument performance." },
    { title: "Reliable Functionality", description: "Every instrument engineered for consistent, dependable results in demanding clinical environments." },
    { title: "Trusted Worldwide", description: "A comprehensive range of dental solutions trusted by professionals globally for durability and precision." },
];

const categories = [
    { name: "Elevators", image: "/images/products/medesy/elevators/elevators-category.jpg", meta: "20+ instruments", href: "/product-category/medesy/elevators" },
    { name: "Forceps", image: "/images/products/medesy/forceps/forceps-category.jpg", meta: "30+ instruments", href: "/product-category/medesy/forceps" },
    { name: "Periosteal Elevators", image: "/images/products/medesy/periosteal/periosteal-category.jpg", meta: "15+ instruments", href: "/product-category/medesy/periosteal-elevators" },
    { name: "Scissors", image: "/images/products/medesy/scissors/scissors-category.jpg", meta: "10+ instruments", href: "/product-category/medesy/scissors" },
];

export default function AboutMedesyPage() {
    return (
        <>
            <BrandHero
                name="MEDESY"
                tagline="Made in Italy · Maniago"
                description="Italian dental instruments blending six centuries of artisan expertise with continuous innovation — precision, craftsmanship, and performance in every piece."
                image="/images/products/medesy/medesy-banner.jpg"
                imageAlt="Medesy dental instruments"
                imageFit="contain"
                primary={{ href: "/product-category/medesy", label: "Explore Instruments" }}
                secondary={{ href: "/support/contact", label: "Contact Us" }}
            />

            <BrandStatement
                quote="Six centuries of blade-making heritage — channeled into every instrument we forge."
                stats={[
                    { v: "600+", l: "Years of Heritage" },
                    { v: "100+", l: "Instruments" },
                    { v: "4", l: "Instrument Categories" },
                    { v: "Italy", l: "Made in Maniago" },
                ]}
            />

            <BrandProductCards
                id="range"
                title="Every Procedure. Every Instrument."
                subtitle="A comprehensive portfolio of precision instruments designed for every clinical need."
                items={categories}
                columns={4}
            />

            <BrandAbout
                brand="Medesy"
                eyebrow="Heritage"
                title="A Legacy Forged in Steel."
                highlights={heritage.map((p) => ({ title: p.title, text: p.description }))}
                media={<MediaTile href="/product-category/medesy/forceps" src="/images/products/medesy/forceps/forceps-category.jpg" alt="Medesy dental forceps craftsmanship" />}
            >
                <p>
                    Rooted in the historic steel-making town of Maniago, MEDESY carries forward a family legacy built on passion, precision, and craftsmanship. For over 600 years, Maniago has been
                    internationally recognized as a center of excellence in blade production.
                </p>
                <p>
                    Blending centuries-old artisan expertise with continuous innovation, MEDESY focuses on advanced design, superior ergonomics, and reliable functionality — trusted by professionals
                    worldwide.
                </p>
            </BrandAbout>

            <BrandCTA
                title="Built in Maniago, Trusted in Your Clinic"
                description="Browse the full elevator, forceps, and scissors range, or request pricing for your practice."
                primary={{ href: "/product-category/medesy", label: "Browse Instruments" }}
                secondary={{ href: "/support/contact", label: "Contact Sales" }}
            />
        </>
    );
}
