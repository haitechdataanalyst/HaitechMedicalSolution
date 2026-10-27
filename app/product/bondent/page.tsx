import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { BrandAbout } from "@/components/brand/BrandAbout";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { BrandChecklist, BrandCTA, BrandHero, BrandProductCards, BrandStatement } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Bondent | German Dental Technology Group", "Bondent Group — German-registered dental technology group offering endodontic equipment and imaging systems built on over a decade of in-house R&D.", { path: "/product/bondent" });

const pillars = [
    { title: "Compassion", description: "Patient-first product design focused on better clinical outcomes." },
    { title: "Determination", description: "Continuous long-term investment in research, engineering, and product development." },
    { title: "Innovation", description: "Ongoing development of modern dental technologies across multiple specialties." },
    { title: "Appreciation", description: "Supporting clinicians through education, workshops, and Bondent Academy." },
];

const flagshipProducts = ["CBCT Imaging Systems", "UDG Endodontic Files"];

const range = [
    {
        name: "Endo & ortho",
        meta: "Rotary Files · Hand Files & Obturation · Orthodontics · Endo Accessories",
        description: "Rotary root canal files, obturation instruments, endodontic accessories, orthodontic brackets, archwires, and molar bands designed for reliable everyday clinical performance.",
        image: "/images/products/bondent/endo-files/rotary-files/cc-premium.jpg",
        href: "/product-category/bondent/endo-files",
    },
    {
        name: "Imaging & optics",
        meta: "CBCT with metal-artifact reduction · Surgical loupes for precision work",
        description: "High-resolution CBCT systems with advanced metal-artifact reduction technology and surgical loupes built for enhanced clinical precision.",
        image: "/images/products/bondent/imaging/cbct-1020ms.png",
        href: "/product-category/bondent/imaging",
    },
];

export default function BondentAboutPage() {
    return (
        <>
            <BrandHero
                name="Bondent"
                tagline="German-registered · Global dental innovation"
                description="A full-spectrum dental technology group offering equipment, consumables, and digital solutions—from diagnostic imaging to precision endodontics—built on over a decade of in-house research and manufacturing."
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

            <BrandProductCards id="range" title="Choose your Bondent range." subtitle="Endodontics and orthodontics, imaging and optics." columns={2} items={range} />

            <BrandAbout
                brand="Bondent"
                title="About Bondent Group"
                highlights={pillars.map((p) => ({ title: p.title, text: p.description }))}
                media={
                    <div className={`${SURFACE_CARD} p-6 md:p-8`}>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">Flagship Portfolio</h3>
                        <div className="mt-4">
                            <BrandChecklist items={flagshipProducts} />
                        </div>
                    </div>
                }
            >
                <p>
                    Bondent Group GmbH is a German-registered dental technology company established in 2021, with operational roots dating back to 2009. Headquartered in Shanghai, Bondent develops
                    products across five major dental categories including Endodontics, Optics, Orthodontics, Imaging, and Dental Units.
                </p>
                <p>
                    The company also operates <strong className="font-semibold text-neutral-800">Bondent Academy</strong>, an educational platform dedicated to clinician training and professional
                    development.
                </p>
            </BrandAbout>

            <BrandCTA
                title="Interested in Bondent equipment for your clinic?"
                description="Talk to our team about endodontic systems or imaging equipment for your practice."
                primary={{ href: "/support/contact", label: "Request a Quote" }}
                secondary={{ href: "/product-category/bondent", label: "Browse Products" }}
            />
        </>
    );
}
