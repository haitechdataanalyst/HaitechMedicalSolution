import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HeartPulse, ArrowDownUp, Brain, Armchair, Activity, CheckCircle, ChevronDown } from "lucide-react";
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

const pillars = [
    { icon: <Brain className="h-7 w-7" />, title: "Research in Sitting Physiology", description: "Decades of scientific research into how sitting affects the body, informing every design decision." },
    { icon: <ArrowDownUp className="h-7 w-7" />, title: "Continuous Innovation", description: "Relentless product development to deliver cutting-edge ergonomic solutions for modern professionals." },
    { icon: <Armchair className="h-7 w-7" />, title: "High-Quality Manufacturing", description: "Premium materials and precise engineering ensure durability, comfort, and long-lasting performance." },
    { icon: <HeartPulse className="h-7 w-7" />, title: "Customer-Oriented Approach", description: "Solving real sitting problems through an integrated, user-focused design philosophy." },
];

const products = [
    { name: "Salli SwayFit", image: "/images/products/salli/salli-swayfit-main.jpg", description: "Dynamic saddle chair with a split seat that promotes active sitting and natural spinal alignment." },
    { name: "Salli TripleLift", image: "/images/products/salli/salli-triplelift-main.jpg", description: "Versatile height-adjustable saddle chair designed for optimal pelvic tilt and pressure distribution." },
    { name: "Salli Ultra", image: "/images/products/salli/salli-ultra-main.jpg", description: "Premium option with ultra-smooth tilt mechanisms for the most comfortable sitting experience." },
];

export default function AboutSalliPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/salli/salli-banner.jpg"
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
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                        Finnish-Engineered · Clinically Proven
                    </span>
                    <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl md:text-9xl">
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

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-6 w-6 text-white/30" />
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="bg-amber-950 py-10 md:py-20 lg:py-28">
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
                                <p className="text-2xl font-black text-amber-400 md:text-3xl lg:text-4xl">{s.v}</p>
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
                            <h2 className="mb-4 text-3xl font-black leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
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
                                    src="/images/products/salli/salli-swayfit-1.jpg"
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
                                    src="/images/products/salli/salli-triplelift-main.jpg"
                                    alt="Salli TripleLift saddle chair"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / The Solution</span>
                            <h2 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                                Designed to<br />Transform How You Sit.
                            </h2>
                            <p className="mb-5 text-base leading-relaxed text-white/55 md:text-lg">
                                The Salli saddle chair tilts the pelvis forward naturally, restoring the spine&apos;s healthy S-curve. The result is active, healthy sitting that reduces pain and boosts circulation — even during long procedures.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Better Posture", "Less Pain", "More Circulation", "Higher Productivity"].map((b) => (
                                    <div key={b} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                        <span className="text-sm font-medium text-white/80">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 03 Product Range ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / Product Range</span>
                        <h2 className="text-3xl font-black text-neutral-900 md:text-4xl lg:text-5xl">The Salli Range</h2>
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
                        <h2 className="text-3xl font-black text-neutral-900 md:text-4xl lg:text-5xl">Four Pillars of Design</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {pillars.map((pillar, index) => (
                            <div key={pillar.title} className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-200 hover:border-amber-200 hover:shadow-lg md:p-7">
                                <div className="mb-3 text-5xl font-black text-neutral-100 transition-colors group-hover:text-amber-50">
                                    0{index + 1}
                                </div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                                    {pillar.icon}
                                </div>
                                <h3 className="mb-2 text-sm font-bold text-neutral-900">{pillar.title}</h3>
                                <p className="text-sm leading-relaxed text-neutral-500">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden bg-amber-950 py-14 text-white md:py-28">
                <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-500 opacity-10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-400 opacity-5 blur-2xl" />
                <div className="container relative text-center">
                    <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Salli Chairs
                    </span>
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
                        Invest in Your Health & Productivity
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Join thousands of dental and medical professionals who have transformed their practice with Salli ergonomic seating.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/products">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-amber-700 shadow-lg hover:bg-amber-50">
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
