import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Gem, Factory, Wrench, Microscope, Globe, Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Medesy | Italian Dental Instruments & Equipment",
    description: "MEDESY — Italian dental instruments rooted in 600+ years of blade-making heritage from Maniago. Precision, craftsmanship, and innovation in every instrument.",
};

const heritage = [
    { icon: <Flame className="h-6 w-6" />, title: "600+ Years of Heritage", description: "Rooted in Maniago, Italy — internationally recognized for six centuries as a center of excellence in blade production." },
    { icon: <Factory className="h-6 w-6" />, title: "Family Legacy", description: "A brand built on generations of passion, precision, and craftsmanship — carrying forward a proud artisan tradition." },
    { icon: <Gem className="h-6 w-6" />, title: "Artisan Expertise", description: "Blending centuries-old hand-crafting techniques with modern innovation to achieve unmatched quality." },
    { icon: <Microscope className="h-6 w-6" />, title: "Advanced Design", description: "Continuous innovation in ergonomics, materials, and functionality for superior instrument performance." },
    { icon: <Wrench className="h-6 w-6" />, title: "Reliable Functionality", description: "Every instrument engineered for consistent, dependable results in demanding clinical environments." },
    { icon: <Globe className="h-6 w-6" />, title: "Trusted Worldwide", description: "A comprehensive range of dental solutions trusted by professionals globally for durability and precision." },
];

const categories = [
    { name: "Elevators", image: "/images/products/medesy/elevators/elevators-category.jpg", count: "20+ instruments" },
    { name: "Forceps", image: "/images/products/medesy/forceps/forceps-category.jpg", count: "30+ instruments" },
    { name: "Periosteal Elevators", image: "/images/products/medesy/periosteal/periosteal-category.jpg", count: "15+ instruments" },
    { name: "Scissors", image: "/images/products/medesy/scissors/scissors-category.jpg", count: "10+ instruments" },
];

export default function AboutMedesyPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/medesy/medesy-banner.jpg"
                    alt="Medesy dental instruments"
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
                    <span className="text-white/60">Medesy</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Made in Italy · Maniago
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        MEDESY
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Italian dental instruments blending six centuries of artisan expertise with continuous innovation — precision, craftsmanship, and performance in every piece.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/medesy">
                            <Button size="lg" className="rounded-full px-8">Explore Instruments</Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-8 text-white hover:bg-white/10">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="bg-[#001926] py-10 md:py-20 lg:py-28">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl lg:text-3xl">
                        &ldquo;Six centuries of blade-making heritage — channeled into every instrument we forge.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "600+",  l: "Years of Heritage"    },
                            { v: "100+",  l: "Instruments"          },
                            { v: "4",     l: "Instrument Categories" },
                            { v: "Italy", l: "Made in Maniago"      },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-primary-400 md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Heritage ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / Heritage</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                A Legacy<br />Forged in Steel.
                            </h2>
                            <p className="mb-4 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Rooted in the historic steel-making town of Maniago, MEDESY carries forward a family legacy built on passion, precision, and craftsmanship. For over 600 years, Maniago has been internationally recognized as a center of excellence in blade production.
                            </p>
                            <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                                Blending centuries-old artisan expertise with continuous innovation, MEDESY focuses on advanced design, superior ergonomics, and reliable functionality — trusted by professionals worldwide.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative">
                                <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                    <Image
                                        src="/images/products/medesy/forceps/forceps-category.jpg"
                                        alt="Medesy dental forceps craftsmanship"
                                        width={700}
                                        height={525}
                                        className="h-auto w-full object-contain p-6 md:p-10"
                                    />
                                </div>
                                <div className="absolute -bottom-4 -right-4 rounded-2xl bg-primary-600 px-5 py-3 text-white shadow-lg md:px-6 md:py-4">
                                    <div className="text-2xl font-bold md:text-3xl">600+</div>
                                    <div className="text-xs font-semibold uppercase tracking-widest text-primary-100">Years of Heritage</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Instrument Range ── */}
            <section className="bg-neutral-950 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Instrument Range</span>
                        <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            Every Procedure.<br />Every Instrument.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
                            A comprehensive portfolio of precision instruments designed for every clinical need.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <div key={cat.name} className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors duration-200 hover:border-primary-500/40">
                                <div className="relative aspect-square overflow-hidden bg-neutral-900">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="border-t border-white/10 p-4 md:p-5">
                                    <h3 className="mb-1 text-sm font-bold text-white">{cat.name}</h3>
                                    <p className="text-xs text-white/40">{cat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── The MEDESY Difference ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">The MEDESY Difference</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Where Craft Meets Clinic</h2>
                        <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500 md:text-base">
                            Where centuries of Italian craftsmanship meets modern dental innovation.
                        </p>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        {heritage.map((item) => (
                            <div key={item.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-primary-600">
                                    {item.icon}
                                    <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-neutral-500">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[#001926] py-14 text-white md:py-28">
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Built in Maniago, Trusted in Your Clinic
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Browse the full elevator, forceps, and scissors range, or request pricing for your practice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/product-category/medesy">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg hover:bg-primary-50">
                                Browse Instruments
                            </Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-10 text-white hover:border-white hover:bg-white/10">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
