import Image from "next/image";
import { HeartPulse, ArrowDownUp, Brain, Armchair, Activity, CheckCircle, Wind, Shield, Droplets, Bone, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import { getDynamicMetadata } from "@/lib/metadata";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { BRAND_LEAD, BrandCTA, BrandFeature, BrandHero, BrandPillars, BrandProductCards, BrandSection, BrandStatement, MediaTile } from "@/components/brand/BrandSections";

export const metadata: Metadata = getDynamicMetadata("Salli | Ergonomic Dental Saddle Chairs", "Salli Systems — pioneers in ergonomic saddle chair design. Solving sitting-related problems through research-driven innovation for dental and medical professionals.", { path: "/product/salli" });

const sittingProblems = [
    "Lower back and shoulder pain",
    "Poor posture during procedures",
    "Sitting fatigue and discomfort",
    "Reduced circulation in lower limbs",
    "Hip and knee joint problems",
    "Slower bowel movement",
    "Restricted breathing while seated",
    "Headaches and poor pelvic circulation",
];

const healthBenefits = [
    {
        icon: <Bone className="h-6 w-6" />,
        title: "Good Posture",
        description: "Prevents spinal issues and muscle tension in the neck, shoulders and lower back, poor blood circulation to the brain and eyes, shallow breathing, and weaker intestinal function.",
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Better Pelvic Health",
        description: "The gap in the middle of the seat prevents the pressure build-up that can affect the organs within the pelvis.",
    },
    {
        icon: <Droplets className="h-6 w-6" />,
        title: "Enhanced Genital Health",
        description: "The gap keeps the genital area dry, avoiding sweating and sitting pressure.",
    },
    {
        icon: <Activity className="h-6 w-6" />,
        title: "Healthier Hip & Knee Joints",
        description: "A 135-degree seating angle reduces pressure on the joints and avoids sitting directly on the thighs.",
    },
    {
        icon: <RefreshCw className="h-6 w-6" />,
        title: "More Movement, Better Circulation",
        description: "Increased activity in the core, pelvis and legs combats the effects of immobility. Stretching and rolling on the Salli chair is easy and enjoyable, promoting movement and tissue health.",
    },
    {
        icon: <Wind className="h-6 w-6" />,
        title: "Deeper Breathing & Focus",
        description: "An upright, balanced posture allows deeper breathing that keeps energy levels high, along with better digestion, mental clarity and concentration.",
    },
];

const pillars = [
    { icon: <Brain className="h-6 w-6" />, title: "Research in Sitting Physiology", description: "Decades of scientific research into how sitting affects the body, informing every design decision." },
    { icon: <ArrowDownUp className="h-6 w-6" />, title: "Continuous Innovation", description: "Relentless product development to deliver cutting-edge ergonomic solutions for modern professionals." },
    { icon: <Armchair className="h-6 w-6" />, title: "High-Quality Manufacturing", description: "Premium materials and precise engineering ensure durability, comfort, and long-lasting performance." },
    { icon: <HeartPulse className="h-6 w-6" />, title: "Customer-Oriented Approach", description: "Solving real sitting problems through an integrated, user-focused design philosophy." },
];

const products = [
    { name: "Salli SwayFit", image: "/images/products/salli/sway-fit-black.jpg", description: "Dynamic saddle chair with a split seat that promotes active sitting and natural spinal alignment.", href: "/product-category/salli/sway-fit" },
    { name: "Salli TripleLift", image: "/images/products/salli/triple-fit-black.jpg", description: "Versatile height-adjustable saddle chair designed for optimal pelvic tilt and pressure distribution.", href: "/product-category/salli/triple-fit" },
    { name: "Salli Ultra", image: "/images/products/salli/ultra-triple-fit-black.jpg", description: "Premium option with ultra-smooth tilt mechanisms for the most comfortable sitting experience.", href: "/product-category/salli/ultra-triple-fit" },
];

const comparisons = [
    {
        title: "Traditional 90\u00b0 Sitting",
        tone: "text-red-700",
        images: [
            { src: "/images/products/salli/benefits-bad-posture.jpg", alt: "Man sitting in a slouched, poor position on an ordinary office chair", width: 500, height: 667 },
            { src: "/images/products/salli/benefits-bad-pelvis-angle.jpg", alt: "Diagram showing a 90-degree hip angle and 30-degree flattening of the lumbar region in traditional sitting", width: 500, height: 709 },
        ],
        body: "In traditional 90-degree sitting, the vertebrae and discs are loaded incorrectly — pressed together at the front while the back muscles and ligaments stay constantly stretched. This leads to poor circulation, weak muscles, and a higher risk of back aches, lumbago and herniated discs. Out of balance, the body looks for something to lean on, and poor circulation over time can contribute to serious conditions such as heart disease, high blood pressure and stroke.",
    },
    {
        title: "Salli Saddle Sitting",
        tone: "text-emerald-700",
        images: [
            { src: "/images/products/salli/benefits-good-posture.jpg", alt: "Woman sitting in an upright, balanced position on a Salli saddle chair", width: 500, height: 898 },
            { src: "/images/products/salli/benefits-good-pelvis-angle.jpg", alt: "Diagram showing the ergonomic 135-degree hip angle achieved on a Salli saddle chair", width: 500, height: 709 },
        ],
        body: "The Salli saddle chair offers an unburdened, standing-like, active way of sitting in balance. You sit in an upright vertical position — where the body is at its strongest, physically and mentally. The pelvis rests in its neutral position, the spine holds up the upper body, and the muscles relax. Discs are evenly loaded, and the small movements you make when turning or reaching activate and strengthen your back and core muscles, all while circulation stays undisturbed throughout the day.",
    },
];

export default function AboutSalliPage() {
    return (
        <>
            {/* Nordic-minimal: Salli's page stays entirely light — no dark band, closing CTA included. */}
            <BrandHero
                name="Salli"
                tagline="Finnish-engineered · Clinically proven"
                description="Advancing research in sitting physiology, continuous product innovation, and solving sitting-related problems through a customer-oriented, integrated approach."
                image="/images/products/salli/triple-fit-black.jpg"
                imageAlt="Salli ergonomic saddle chairs"
                imageFit="contain"
                primary={{ href: "/product-category/salli", label: "Explore Salli Chairs" }}
                secondary={{ href: "/support/contact", label: "Get in Touch" }}
            />

            <BrandStatement
                quote="The way we sit is broken. Salli built the fix."
                stats={[
                    { v: "40+", l: "Years of R&D" },
                    { v: "8", l: "Health Issues Fixed" },
                    { v: "3", l: "Chair Models" },
                    { v: "Finland", l: "Engineered" },
                ]}
            />

            <BrandFeature
                eyebrow="The problem"
                title={
                    <>
                        Traditional Sitting
                        <br />
                        Is Hurting You.
                    </>
                }
                cta={{ href: "/product-category/salli/sway-fit" }}
                media={<MediaTile href="/product-category/salli/sway-fit" src="/images/products/salli/sway-fit-black.jpg" alt="Salli SwayFit saddle chair" aspect="aspect-square" />}
            >
                <p className={BRAND_LEAD}>
                    Salli has demonstrated through research that traditional sitting is closely linked to numerous health issues. Hours in a conventional chair create compounding problems for dental professionals.
                </p>
                <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {sittingProblems.map((problem) => (
                        <li key={problem} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
                            <Activity className="mt-1 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                            {problem}
                        </li>
                    ))}
                </ul>
            </BrandFeature>

            <BrandFeature
                tone="gray"
                reverse
                eyebrow="The solution"
                title={
                    <>
                        Designed to
                        <br />
                        Transform How You Sit.
                    </>
                }
                cta={{ href: "/product-category/salli/triple-fit" }}
                media={<MediaTile href="/product-category/salli/triple-fit" src="/images/products/salli/triple-fit-black.jpg" alt="Salli TripleLift saddle chair" />}
            >
                <p className={BRAND_LEAD}>
                    The Salli saddle chair tilts the pelvis forward naturally, restoring the spine&apos;s healthy S-curve. The result is active, healthy sitting that reduces pain and boosts circulation — even during
                    long procedures.
                </p>
                <ul className="flex flex-wrap gap-2">
                    {["Better Posture", "Less Pain", "More Circulation", "Higher Productivity"].map((b) => (
                        <li key={b} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15px] text-neutral-800 ring-1 ring-neutral-900/[0.06]">
                            <CheckCircle className="text-primary-700 h-4 w-4 shrink-0" aria-hidden="true" />
                            {b}
                        </li>
                    ))}
                </ul>
            </BrandFeature>

            {/* The science / benefits */}
            <BrandSection>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-primary-700 text-[15px] font-medium">The science</p>
                    <h2 className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">Why Your Sitting Position Matters</h2>
                    <p className={`mt-5 ${BRAND_LEAD}`}>
                        Back problems are the most common cause of sick leave in the world today. Our increasingly sedentary lifestyle is a major contributing factor — but the two-part Salli saddle chair both prevents
                        and rehabilitates the damage traditional sitting causes.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl bg-neutral-50 md:mt-16">
                    <Image
                        src="/images/products/salli/benefits-spine-comparison.jpg"
                        alt="Illustration comparing spine position when sitting on a one-part chair versus a two-part Salli saddle chair"
                        width={1000}
                        height={550}
                        className="h-auto w-full object-contain p-6 mix-blend-multiply md:p-10"
                    />
                </div>

                {/* Traditional vs saddle sitting */}
                <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2 lg:gap-6">
                    {comparisons.map((c) => (
                        <article key={c.title} className={`${SURFACE_CARD} p-2`}>
                            <div className="grid grid-cols-2 items-start gap-2">
                                {c.images.map((img) => (
                                    <div key={img.src} className="overflow-hidden rounded-xl bg-neutral-50">
                                        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full object-contain p-2 mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 pt-5 pb-4 md:px-5">
                                <h3 className={`text-[17px] font-semibold tracking-[-0.01em] ${c.tone}`}>{c.title}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{c.body}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </BrandSection>

            <BrandPillars tone="gray" title="Key Health Effects of the Salli Saddle Chair" items={healthBenefits} />

            <div className="bg-white">
                <p className="container mx-auto max-w-3xl pt-16 text-center text-[15px] leading-relaxed text-neutral-500 md:pt-20 md:text-base">
                    The optimally and ergonomically designed two-part seat is the prerequisite for sitting in good posture with undisturbed circulation — with no heat or harmful pressure on the pelvic floor or genital
                    area, and no need to lean away into a slouched position.
                </p>
            </div>

            <BrandProductCards title="The Salli Range" subtitle="Purpose-built saddle chairs that redefine seated comfort for dental and medical professionals." items={products} />

            <BrandPillars tone="gray" title="Four Pillars of Design" subtitle="Why choose Salli." items={pillars} columns={4} />

            <BrandCTA
                tone="light"
                title="Invest in Your Health & Productivity"
                description="Talk to us about which model fits your clinic — Sway Fit, Triple Lift, or Ultra."
                primary={{ href: "/product-category/salli", label: "Shop Salli Chairs" }}
                secondary={{ href: "/support/contact", label: "Contact Us" }}
            />
        </>
    );
}
