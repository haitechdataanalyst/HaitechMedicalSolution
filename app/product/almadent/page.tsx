import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { BrandAbout } from "@/components/brand/BrandAbout";
import { BrandChecklist, BrandCTA, BrandHero, BrandProductCards, BrandStatement } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Almadent | Complete Dental Equipment Solutions", "Almadent by Haitech — reliable dental chairs, handpieces, implant motors, and auxiliary equipment engineered for clinical efficiency, durability, and patient comfort.", { path: "/product/almadent" });

const pillars = [
    { title: "Performance", description: "Built to perform consistently under the demands of daily clinical use — reliability when it matters most." },
    { title: "Functionality", description: "Intuitive controls and streamlined workflows so you can focus entirely on patient care." },
    { title: "Durability", description: "Premium materials and rigorous quality testing guarantee equipment that stands the test of time." },
];

const range = [
    {
        name: "Dental chairs",
        meta: "AY-3000 · AY-6000 · AY-8000",
        description: "The AY-series combines ergonomic design with advanced functionality.",
        image: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308202/haitech/images/products/almadent/chairs/ay-6000-1.jpg",
        href: "/product-category/almadent/dental-chairs",
    },
    {
        name: "Handpieces",
        meta: "High-Speed · Low-Speed · Electric · Surgical",
        description: "Precision-engineered handpieces delivering consistent performance for restorative, endodontic, and surgical procedures.",
        image: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308212/haitech/images/products/almadent/handpiece/tealth-handpiece.png",
        href: "/product-category/almadent",
    },
    {
        name: "Implant & auxiliary",
        meta: "Implant Motors · Suction Systems · Lubricators · PTX Tools",
        description: "Advanced implant motor systems with precise torque control for safe, predictable placement.",
        image: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308189/haitech/images/products/almadent/auxiliary/implant-motor-1.jpg",
        href: "/product-category/almadent/implant-motor",
    },
];
export default function AlmadentAboutPage() {
    return (
        <>
            <BrandHero
                name="Almadent"
                tagline="By Haitech Medical · CE marked"
                description="Complete dental equipment for the modern practice — from chairs to handpieces, every product engineered for performance, ergonomics, and day-to-day clinical convenience."
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

            <BrandProductCards id="range" title="Complete the operatory." subtitle="Chairs, handpieces and implant equipment from one range." items={range}>
                <div className="mx-auto max-w-3xl">
                    <p className="text-center text-[13px] text-neutral-500">Every AY-series chair</p>
                    <div className="mt-4">
                        <BrandChecklist
                            columns={2}
                            items={["Smooth, whisper-quiet hydraulic movements", "Integrated LED operating light", "Memory positions for quick adjustments", "Durable upholstery in multiple color options"]}
                        />
                    </div>
                </div>
            </BrandProductCards>

            <BrandAbout brand="Almadent" eyebrow="Why choose Almadent" title="Performance, functionality, durability." highlights={pillars.map((p) => ({ title: p.title, text: p.description }))} />

            <BrandCTA
                title="Spec Your Operatory"
                description="Tell us your chair count and workflow and we'll put together a configuration quote for AY-series chairs, handpieces, and auxiliary equipment."
                primary={{ href: "/product-category/almadent", label: "Explore Products" }}
                secondary={{ href: "/support/contact", label: "Request a Quote" }}
            />
        </>
    );
}
