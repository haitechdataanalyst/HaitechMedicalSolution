import { HeartHandshake, Target, Lightbulb, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { HaitechPartnership } from "@/components/brand/HaitechPartnership";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { BRAND_LEAD, BrandChecklist, BrandCTA, BrandFeature, BrandHero, BrandPillars, BrandStatement, BrandTags, MediaTile } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Bondent | German Dental Technology Group", "Bondent Group — German-registered dental technology group offering endodontic equipment and imaging systems built on over a decade of in-house R&D.", { path: "/product/bondent" });

const pillars = [
    { icon: <HeartHandshake />, title: "Compassion", description: "Patient-first product design focused on better clinical outcomes." },
    { icon: <Target />, title: "Determination", description: "Continuous long-term investment in research, engineering, and product development." },
    { icon: <Lightbulb />, title: "Innovation", description: "Ongoing development of modern dental technologies across multiple specialties." },
    { icon: <GraduationCap />, title: "Appreciation", description: "Supporting clinicians through education, workshops, and Bondent Academy." },
];

const flagshipProducts = ["CBCT Imaging Systems", "UDG Endodontic Files"];

export default function BondentAboutPage() {
    return (
        <>
            <BrandHero
                name="Bondent"
                tagline="German-registered · Global dental innovation"
                description="A full-spectrum dental technology group offering equipment, consumables, and digital solutions—from diagnostic imaging to precision endodontics—built on over a decade of in-house research and manufacturing."
                image="/images/products/bondent/Bondent CBCT-1030 Pro.png"
                imageAlt="Bondent dental technology"
                imageFit="contain"
                primary={{ href: "/product-category/bondent", label: "Explore Bondent Range" }}
                secondary={{ href: "/support/contact", label: "Contact Us" }}
            />

            <BrandStatement
                quote="Integrated dental technology, engineered to help clinicians treat with more confidence."
                stats={[
                    { v: "5", l: "Product Categories" },
                    { v: "CE", l: "Certified" },
                    { v: "180,000+", l: "Academy Learners" },
                    { v: "15+", l: "Years in R&D" },
                ]}
            />

            <BrandFeature
                eyebrow="Endo & ortho"
                title={
                    <>
                        Root to Crown,
                        <br />
                        Every Angle.
                    </>
                }
                cta={{ href: "/product-category/bondent/endo-files/rotary-files/cc-premium" }}
                media={<MediaTile href="/product-category/bondent/endo-files/rotary-files/cc-premium" src="/images/products/bondent/CC Premium.jpg" alt="Bondent rotary endodontic files" />}
            >
                <p className={BRAND_LEAD}>
                    Rotary root canal files, obturation instruments, endodontic accessories, orthodontic brackets, archwires, and molar bands designed for reliable everyday clinical performance.
                </p>
                <BrandTags items={["Rotary Files", "Hand Files & Obturation", "Orthodontics", "Endo Accessories"]} />
            </BrandFeature>

            <BrandFeature
                tone="gray"
                reverse
                eyebrow="Imaging & optics"
                title={
                    <>
                        See More.
                        <br />
                        Miss Nothing.
                    </>
                }
                cta={{ href: "/product-category/bondent/imaging/cbct-1020ms" }}
                media={<MediaTile href="/product-category/bondent/imaging/cbct-1020ms" src="/images/products/bondent/CBCT 1020MS.png" alt="Bondent CBCT imaging system" />}
            >
                <p className={BRAND_LEAD}>High-resolution CBCT systems with advanced metal-artifact reduction technology and surgical loupes built for enhanced clinical precision.</p>
                <BrandChecklist items={["CBCT with metal-artifact reduction", "Surgical loupes for precision work"]} />
            </BrandFeature>

            <BrandPillars title="Built on Four Values" subtitle="Why choose Bondent." items={pillars} columns={4} />

            <BrandFeature
                tone="gray"
                title="About Bondent Group"
                media={
                    <div className={`${SURFACE_CARD} p-6 md:p-8`}>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">Flagship Portfolio</h3>
                        <div className="mt-4">
                            <BrandChecklist items={flagshipProducts} />
                        </div>
                    </div>
                }
            >
                <p className={BRAND_LEAD}>
                    Bondent Group GmbH is a German-registered dental technology company established in 2021, with operational roots dating back to 2009. Headquartered in Shanghai, Bondent develops
                    products across five major dental categories including Endodontics, Optics, Orthodontics, Imaging, and Dental Units.
                </p>
                <p className={BRAND_LEAD}>
                    The company also operates <strong className="font-semibold text-neutral-800">Bondent Academy</strong>, an educational platform dedicated to clinician training and professional
                    development.
                </p>
            </BrandFeature>

            <HaitechPartnership brand="Bondent" />

            <BrandCTA
                title="Interested in Bondent equipment for your clinic?"
                description="Talk to our team about endodontic systems or imaging equipment for your practice."
                primary={{ href: "/support/contact", label: "Request a Quote" }}
                secondary={{ href: "/product-category/bondent", label: "Browse Products" }}
            />
        </>
    );
}
