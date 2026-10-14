import { ShieldCheck, Settings2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { HaitechPartnership } from "@/components/brand/HaitechPartnership";
import { BRAND_LEAD, BrandChecklist, BrandCTA, BrandFeature, BrandHero, BrandPillars, BrandStatement, BrandTags, MediaTile } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Almadent | Complete Dental Equipment Solutions", "Almadent by Haitech — reliable dental chairs, handpieces, implant motors, and auxiliary equipment engineered for clinical efficiency, durability, and patient comfort.", { path: "/product/almadent" });

const pillars = [
    { icon: <ShieldCheck />, title: "Performance", description: "Built to perform consistently under the demands of daily clinical use — reliability when it matters most." },
    { icon: <Settings2 />, title: "Functionality", description: "Intuitive controls and streamlined workflows so you can focus entirely on patient care." },
    { icon: <Sparkles />, title: "Durability", description: "Premium materials and rigorous quality testing guarantee equipment that stands the test of time." },
];

const chairs = [
    { href: "/product-category/almadent/dental-chairs/ay-3000", src: "/images/products/almadent/chairs/ay-3000-1.jpg", alt: "AY-3000" },
    { href: "/product-category/almadent/dental-chairs/ay-6000", src: "/images/products/almadent/chairs/ay-6000-1.jpg", alt: "AY-6000" },
    { href: "/product-category/almadent/dental-chairs/ay-8000", src: "/images/products/almadent/chairs/ay-8000-1.jpg", alt: "AY-8000" },
    { href: "/product-category/almadent/dental-chairs/ay-3000", src: "/images/products/almadent/chairs/ay-3000-2.jpg", alt: "AY-3000 detail" },
];

export default function AlmadentAboutPage() {
    return (
        <>
            <BrandHero
                name="Almadent"
                tagline="By Haitech Medical · CE marked"
                description="Complete dental equipment for the modern practice — from chairs to handpieces, every product engineered for performance, ergonomics, and day-to-day clinical convenience."
                image="/images/products/almadent/almadent-banner.jpg"
                imageAlt="Almadent dental equipment"
                imageFit="contain"
                primary={{ href: "/product-category/almadent", label: "Browse Products" }}
                secondary={{ href: "/support/contact", label: "Contact Us" }}
            />

            <BrandStatement
                quote="Complete dental equipment, engineered for the clinic that never stops."
                stats={[
                    { v: "4+", l: "Product Categories" },
                    { v: "3", l: "Chair Series" },
                    { v: "CE", l: "Marked & Certified" },
                    { v: "24/7", l: "Support Available" },
                ]}
            />

            <BrandFeature
                eyebrow="Dental chairs"
                title={
                    <>
                        Comfort for
                        <br />
                        Every Patient.
                    </>
                }
                media={
                    <div className="grid grid-cols-2 gap-4">
                        {chairs.map((c) => (
                            <MediaTile key={c.src} href={c.href} src={c.src} alt={c.alt} aspect="aspect-square" />
                        ))}
                    </div>
                }
            >
                <p className={BRAND_LEAD}>
                    The AY-series combines ergonomic design with advanced functionality. Three configurations — AY-3000, AY-6000, and AY-8000 — each built to deliver outstanding patient comfort while
                    giving dentists ergonomic positioning and intuitive controls.
                </p>
                <BrandChecklist
                    items={["Smooth, whisper-quiet hydraulic movements", "Integrated LED operating light", "Memory positions for quick adjustments", "Durable upholstery in multiple color options"]}
                />
            </BrandFeature>

            <BrandFeature
                tone="gray"
                reverse
                eyebrow="Handpieces"
                title={
                    <>
                        Smooth Torque.
                        <br />
                        Every Time.
                    </>
                }
                media={<MediaTile href="/product-category/almadent" src="/images/products/almadent/handpiece/tealth-handpiece.png" alt="Almadent Tealth Handpiece" />}
            >
                <p className={BRAND_LEAD}>
                    Precision-engineered handpieces delivering consistent performance for restorative, endodontic, and surgical procedures. High-speed, low-speed, and electric options for every
                    clinical need.
                </p>
                <BrandTags items={["High-Speed", "Low-Speed", "Electric", "Surgical"]} />
            </BrandFeature>

            <BrandFeature
                eyebrow="Implant & auxiliary"
                title={
                    <>
                        Complete the
                        <br />
                        Clinic Setup.
                    </>
                }
                media={
                    <div className="grid grid-cols-2 gap-4">
                        <MediaTile
                            href="/product-category/almadent/implant-motor/implant-motor"
                            src="/images/products/almadent/auxiliary/implant-motor-1.jpg"
                            alt="Almadent implant motor"
                            aspect="aspect-square"
                        />
                        <MediaTile href="/product-category/almadent" src="/images/products/almadent/auxiliary/ptx-main.png" alt="Almadent PTX" aspect="aspect-square" />
                    </div>
                }
            >
                <p className={BRAND_LEAD}>
                    Advanced implant motor systems with precise torque control for safe, predictable placement — paired with suction systems, lubricators, and specialized auxiliary tools that keep
                    your practice running efficiently every day.
                </p>
                <BrandTags items={["Implant Motors", "Suction Systems", "Lubricators", "PTX Tools"]} />
            </BrandFeature>

            <BrandPillars tone="gray" title="Three Core Principles" subtitle="Why choose Almadent." items={pillars} />

            <HaitechPartnership brand="Almadent" />

            <BrandCTA
                title="Spec Your Operatory"
                description="Tell us your chair count and workflow and we'll put together a configuration quote for AY-series chairs, handpieces, and auxiliary equipment."
                primary={{ href: "/product-category/almadent", label: "Explore Products" }}
                secondary={{ href: "/support/contact", label: "Request a Quote" }}
            />
        </>
    );
}
