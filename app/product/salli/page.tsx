import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HeartPulse, ArrowDownUp, Brain, Armchair, Activity, CheckCircle, Wind, Shield, Droplets, Bone, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Salli | Ergonomic Saddle Chairs for Dental Professionals",
    description: "Salli Systems — pioneers in ergonomic saddle chair design. Solving sitting-related problems through research-driven innovation for dental and medical professionals.",
};

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
    { name: "Salli SwayFit", image: "/images/products/salli/sway-fit-black.jpg", description: "Dynamic saddle chair with a split seat that promotes active sitting and natural spinal alignment." },
    { name: "Salli TripleLift", image: "/images/products/salli/triple-fit-black.jpg", description: "Versatile height-adjustable saddle chair designed for optimal pelvic tilt and pressure distribution." },
    { name: "Salli Ultra", image: "/images/products/salli/ultra-triple-fit-black.jpg", description: "Premium option with ultra-smooth tilt mechanisms for the most comfortable sitting experience." },
];

export default function AboutSalliPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/salli/triple-fit-black.jpg"
                    alt="Salli ergonomic saddle chairs"
                    fill
                    className="object-cover opacity-25"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/50 to-neutral-950" />

                <nav className="absolute left-0 top-0 z-20 px-6 py-5 text-xs text-white/40">
                    <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <Link href="/products" className="transition-colors hover:text-white/70">Products</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <span className="text-white/60">Salli</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Finnish-Engineered · Clinically Proven
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        Salli
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Advancing research in sitting physiology, continuous product innovation, and solving sitting-related problems through a customer-oriented, integrated approach.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/salli">
                            <Button size="lg" className="rounded-full px-8">Explore Salli Chairs</Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-8 text-white hover:bg-white/10">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="bg-[#001926] py-10 md:py-20 lg:py-28">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl lg:text-3xl">
                        &ldquo;The way we sit is broken. Salli built the fix.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "40+",     l: "Years of R&D"       },
                            { v: "8",       l: "Health Issues Fixed" },
                            { v: "3",       l: "Chair Models"        },
                            { v: "Finland", l: "Engineered"          },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-primary-400 md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 The Problem ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / The Problem</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Traditional Sitting<br />Is Hurting You.
                            </h2>
                            <p className="mb-5 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Salli has demonstrated through research that traditional sitting is closely linked to numerous health issues. Hours in a conventional chair create compounding problems for dental professionals.
                            </p>
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {sittingProblems.map((problem) => (
                                    <div key={problem} className="flex items-start gap-3">
                                        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                        <span className="text-sm text-neutral-600">{problem}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                <Image
                                    src="/images/products/salli/sway-fit-black.jpg"
                                    alt="Salli SwayFit saddle chair"
                                    width={700}
                                    height={700}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 The Solution ── */}
            <section className="bg-neutral-950 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-800 shadow-2xl">
                                <Image
                                    src="/images/products/salli/triple-fit-black.jpg"
                                    alt="Salli TripleLift saddle chair"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / The Solution</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                                Designed to<br />Transform How You Sit.
                            </h2>
                            <p className="mb-5 text-base leading-relaxed text-white/55 md:text-lg">
                                The Salli saddle chair tilts the pelvis forward naturally, restoring the spine&apos;s healthy S-curve. The result is active, healthy sitting that reduces pain and boosts circulation — even during long procedures.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Better Posture", "Less Pain", "More Circulation", "Higher Productivity"].map((b) => (
                                    <div key={b} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary-400" />
                                        <span className="text-sm font-medium text-white/80">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 03 The Science / Benefits ── */}
            <section className="bg-neutral-50 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-16">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / The Science</span>
                        <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                            Why Your Sitting Position Matters
                        </h2>
                        <p className="text-base leading-relaxed text-neutral-500 md:text-lg">
                            Back problems are the most common cause of sick leave in the world today. Our increasingly sedentary lifestyle is a major contributing factor — but the two-part Salli saddle chair both prevents and rehabilitates the damage traditional sitting causes.
                        </p>
                    </div>

                    <div className="mx-auto mb-14 max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-neutral-200/60 md:mb-20">
                        <Image
                            src="/images/products/salli/benefits-spine-comparison.jpg"
                            alt="Illustration comparing spine position when sitting on a one-part chair versus a two-part Salli saddle chair"
                            width={1000}
                            height={550}
                            className="h-auto w-full object-contain p-6 md:p-10"
                        />
                    </div>

                    {/* Bad vs Good comparison */}
                    <div className="mb-14 grid gap-6 md:mb-20 lg:grid-cols-2 lg:gap-8">
                        {/* Traditional sitting — bad */}
                        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
                            <div className="border-b border-red-100 bg-red-50 px-6 py-4 md:px-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-red-500">Traditional 90&deg; Sitting</span>
                            </div>
                            <div className="grid grid-cols-2 items-start gap-4 p-6 md:p-8">
                                <div className="overflow-hidden rounded-xl bg-neutral-50">
                                    <Image
                                        src="/images/products/salli/benefits-bad-posture.jpg"
                                        alt="Man sitting in a slouched, poor position on an ordinary office chair"
                                        width={500}
                                        height={667}
                                        className="h-auto w-full object-contain p-2"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-xl bg-neutral-50">
                                    <Image
                                        src="/images/products/salli/benefits-bad-pelvis-angle.jpg"
                                        alt="Diagram showing a 90-degree hip angle and 30-degree flattening of the lumbar region in traditional sitting"
                                        width={500}
                                        height={709}
                                        className="h-auto w-full object-contain p-2"
                                    />
                                </div>
                            </div>
                            <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-500 md:px-8 md:pb-8">
                                In traditional 90-degree sitting, the vertebrae and discs are loaded incorrectly — pressed together at the front while the back muscles and ligaments stay constantly stretched. This leads to poor circulation, weak muscles, and a higher risk of back aches, lumbago and herniated discs. Out of balance, the body looks for something to lean on, and poor circulation over time can contribute to serious conditions such as heart disease, high blood pressure and stroke.
                            </p>
                        </div>

                        {/* Salli saddle sitting — good */}
                        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                            <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-4 md:px-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Salli Saddle Sitting</span>
                            </div>
                            <div className="grid grid-cols-2 items-start gap-4 p-6 md:p-8">
                                <div className="overflow-hidden rounded-xl bg-neutral-50">
                                    <Image
                                        src="/images/products/salli/benefits-good-posture.jpg"
                                        alt="Woman sitting in an upright, balanced position on a Salli saddle chair"
                                        width={500}
                                        height={898}
                                        className="h-auto w-full object-contain p-2"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-xl bg-neutral-50">
                                    <Image
                                        src="/images/products/salli/benefits-good-pelvis-angle.jpg"
                                        alt="Diagram showing the ergonomic 135-degree hip angle achieved on a Salli saddle chair"
                                        width={500}
                                        height={709}
                                        className="h-auto w-full object-contain p-2"
                                    />
                                </div>
                            </div>
                            <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-500 md:px-8 md:pb-8">
                                The Salli saddle chair offers an unburdened, standing-like, active way of sitting in balance. You sit in an upright vertical position — where the body is at its strongest, physically and mentally. The pelvis rests in its neutral position, the spine holds up the upper body, and the muscles relax. Discs are evenly loaded, and the small movements you make when turning or reaching activate and strengthen your back and core muscles, all while circulation stays undisturbed throughout the day.
                            </p>
                        </div>
                    </div>

                    {/* Key health benefits grid */}
                    <div className="mb-10 text-center md:mb-14">
                        <h3 className="text-2xl font-bold text-neutral-900 md:text-3xl">Key Health Effects of the Salli Saddle Chair</h3>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        {healthBenefits.map((benefit) => (
                            <div key={benefit.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-primary-600">
                                    {benefit.icon}
                                    <h4 className="text-sm font-bold text-neutral-900">{benefit.title}</h4>
                                </div>
                                <p className="text-sm leading-relaxed text-neutral-500">{benefit.description}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-12 max-w-3xl text-center text-sm leading-relaxed text-neutral-500 md:text-base">
                        The optimally and ergonomically designed two-part seat is the prerequisite for sitting in good posture with undisturbed circulation — with no heat or harmful pressure on the pelvic floor or genital area, and no need to lean away into a slouched position.
                    </p>
                </div>
            </section>

            {/* ── 04 Product Range ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">04 / Product Range</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">The Salli Range</h2>
                        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500 md:text-base">
                            Purpose-built saddle chairs that redefine seated comfort for dental and medical professionals.
                        </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {products.map((product) => (
                            <div key={product.name} className="group overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-200 hover:border-neutral-200 hover:shadow-lg">
                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="border-t border-neutral-50 p-5 md:p-6">
                                    <h3 className="mb-2 text-base font-bold text-neutral-900">{product.name}</h3>
                                    <p className="text-sm leading-relaxed text-neutral-500">{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Four Pillars ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Choose Salli</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Four Pillars of Design</h2>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-primary-600">
                                    {pillar.icon}
                                    <h3 className="text-sm font-bold text-neutral-900">{pillar.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-neutral-500">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[#001926] py-14 text-white md:py-28">
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Invest in Your Health & Productivity
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Talk to us about which model fits your clinic — Sway Fit, Triple Lift, or Ultra.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/products">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg hover:bg-primary-50">
                                Shop Salli Chairs
                            </Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-10 text-white hover:border-white hover:bg-white/10">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
