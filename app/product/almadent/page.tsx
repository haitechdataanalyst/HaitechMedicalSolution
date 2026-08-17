import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Settings2, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Almadent | Complete Dental Equipment Solutions",
    description: "Almadent by Haitech — reliable dental chairs, handpieces, implant motors, and auxiliary equipment engineered for clinical efficiency, durability, and patient comfort.",
};

const pillars = [
    { icon: <ShieldCheck className="h-6 w-6" />, title: "Performance", description: "Built to perform consistently under the demands of daily clinical use — reliability when it matters most." },
    { icon: <Settings2 className="h-6 w-6" />, title: "Functionality", description: "Intuitive controls and streamlined workflows so you can focus entirely on patient care." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Durability", description: "Premium materials and rigorous quality testing guarantee equipment that stands the test of time." },
];

export default function AlmadentAboutPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-gradient">
                <Image
                    src="/images/products/almadent/almadent-banner.jpg"
                    alt="Almadent dental equipment"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/30 via-navy-900/50 to-navy-900" />

                <nav className="absolute left-0 top-0 z-20 px-6 py-5 text-xs text-white/40">
                    <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <Link href="/products" className="transition-colors hover:text-white/70">Products</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <span className="text-white/60">Almadent</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        By Haitech Medical · CE Marked
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        Almadent
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Complete dental equipment for the modern practice — from chairs to handpieces, every product engineered for performance, ergonomics, and day-to-day clinical convenience.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/almadent" className="btn btn-lg btn-primary rounded-full px-8">
                            Browse Products
                        </Link>
                        <Link
                            href="/support/contact"
                            className="btn btn-lg rounded-full border border-white/25 px-8 text-white transition-all hover:bg-white/10"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="bg-navy-gradient py-10 md:py-20 lg:py-28">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl lg:text-3xl">
                        &ldquo;Complete dental equipment, engineered for the clinic that never stops.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "4+",   l: "Product Categories" },
                            { v: "3",    l: "Chair Series"       },
                            { v: "CE",   l: "Marked & Certified" },
                            { v: "24/7", l: "Support Available"  },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-primary-400 md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Dental Chairs ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / Dental Chairs</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Comfort for<br />Every Patient.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                The AY-series combines ergonomic design with advanced functionality. Three configurations — AY-3000, AY-6000, and AY-8000 — each built to deliver outstanding patient comfort while giving dentists ergonomic positioning and intuitive controls.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Smooth, whisper-quiet hydraulic movements",
                                    "Integrated LED operating light",
                                    "Memory positions for quick adjustments",
                                    "Durable upholstery in multiple color options",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-neutral-600">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/almadent/chairs/ay-3000-1.jpg" alt="AY-3000" width={400} height={300} className="h-auto w-full object-cover" />
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/almadent/chairs/ay-6000-1.jpg" alt="AY-6000" width={400} height={300} className="h-auto w-full object-cover" />
                                </div>
                                <div className="overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/almadent/chairs/ay-8000-1.jpg" alt="AY-8000" width={400} height={300} className="h-auto w-full object-cover" />
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/almadent/chairs/ay-3000-2.jpg" alt="AY-3000 detail" width={400} height={300} className="h-auto w-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Handpieces ── */}
            <section className="bg-navy-gradient py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-navy-800 shadow-2xl">
                                <Image
                                    src="/images/products/almadent/handpiece/tealth-handpiece.png"
                                    alt="Almadent Tealth Handpiece"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-12"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Handpieces</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                                Smooth Torque.<br />Every Time.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-white/55 md:text-lg">
                                Precision-engineered handpieces delivering consistent performance for restorative, endodontic, and surgical procedures. High-speed, low-speed, and electric options for every clinical need.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["High-Speed", "Low-Speed", "Electric", "Surgical"].map((t) => (
                                    <span key={t} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 03 Implant & Auxiliary ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / Implant & Auxiliary</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Complete the<br />Clinic Setup.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Advanced implant motor systems with precise torque control for safe, predictable placement — paired with suction systems, lubricators, and specialized auxiliary tools that keep your practice running efficiently every day.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Implant Motors", "Suction Systems", "Lubricators", "PTX Tools"].map((t) => (
                                    <span key={t} className="rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/almadent/auxiliary/implant-motor-1.jpg" alt="Almadent implant motor" width={400} height={350} className="h-auto w-full object-cover" />
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-50 p-4 shadow-lg">
                                    <Image src="/images/products/almadent/auxiliary/ptx-main.png" alt="Almadent PTX" width={400} height={350} className="h-auto w-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Four Pillars ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Choose Almadent</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Three Core Principles</h2>
                    </div>
                    <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-7 md:grid-cols-3">
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
            <section className="bg-navy-gradient py-14 text-white md:py-28">
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Spec Your Operatory
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Tell us your chair count and workflow and we&apos;ll put together a configuration quote for AY-series chairs, handpieces, and auxiliary equipment.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/product-category/almadent"
                            className="btn btn-lg rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg transition-all hover:bg-primary-50"
                        >
                            Explore Products
                        </Link>
                        <Link
                            href="/support/contact"
                            className="btn btn-lg rounded-full border border-white/25 px-10 text-white transition-all hover:border-white hover:bg-white/10"
                        >
                            Request a Quote
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
