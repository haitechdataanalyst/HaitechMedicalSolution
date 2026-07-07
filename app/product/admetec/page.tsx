import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Eye, Crosshair, Lightbulb, Sparkles, Award, Shield } from "lucide-react";
import type { Metadata } from "next";
import { ErgoMagnificationSelector } from "@/components/admetec/ErgoMagnificationSelector";

export const metadata: Metadata = {
    title: "Admetec | Premium Dental Loupes & Headlights",
    description: "Discover Admetec — world-leading manufacturer of dental loupes, surgical magnification, and LED headlights. Galilean, Prismatic & Ergo systems for precision care.",
};

const features = [
    { icon: <Eye className="h-6 w-6" />, title: "Superior Optics", description: "Crystal-clear magnification with edge-to-edge sharpness for precise clinical work." },
    { icon: <Crosshair className="h-6 w-6" />, title: "Precision Engineering", description: "Each loupe is meticulously crafted with aerospace-grade materials for lasting performance." },
    { icon: <Lightbulb className="h-6 w-6" />, title: "Advanced LED Lights", description: "Powerful, lightweight headlights delivering optimal illumination for any procedure." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Ergonomic Design", description: "Thoughtfully designed frames that reduce neck strain and enhance all-day comfort." },
    { icon: <Award className="h-6 w-6" />, title: "Award-Winning Innovation", description: "Recognized globally for pioneering advancements in dental magnification technology." },
    { icon: <Shield className="h-6 w-6" />, title: "Built to Last", description: "Premium materials and rigorous quality control ensure years of reliable performance." },
];

export default function AboutAdmetecPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/admetec/admetec-banner.jpg"
                    alt="Admetec dental loupes"
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
                    <span className="text-white/60">Admetec</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Israeli Precision · Made for Dentistry
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        Admetec
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        World-leading manufacturer of dental loupes, surgical magnification systems, and LED headlights — empowering professionals with unmatched clarity and precision.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/admetec">
                            <Button size="lg" className="rounded-full px-8">Explore Loupes</Button>
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
                        &ldquo;Precision magnification engineered for the clinicians who demand the best — because every detail matters in dentistry.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "3.5x–10x", l: "Magnification Range" },
                            { v: "ISO",      l: "Certified Quality"  },
                            { v: "500+",     l: "Clinicians Served"  },
                            { v: "2",        l: "Optical Systems"    },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-[#1fb6cd] md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Galilean ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / Galilean Loupes</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Lightweight.<br />Wide. Clear.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Galilean loupes offer a wide field of view with excellent depth of field. Perfect for general dentistry and routine procedures — compact and remarkably comfortable for all-day wear.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["2.5x", "2.7x", "3.2x"].map((m) => (
                                    <span key={m} className="rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">{m}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                <Image
                                    src="/images/products/admetec/galilean/galilean-2.5x-blues-pink.jpg"
                                    alt="Admetec Galilean Loupes"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Ergo / Prismatic ── */}
            <section className="bg-neutral-950 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-800 shadow-2xl">
                                <Image
                                    src="/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg"
                                    alt="Admetec Ergo Prismatic Loupes"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Prismatic Ergo</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                                Higher Power.<br />Better Posture.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-white/55 md:text-lg">
                                The Ergo series delivers higher magnification with superior optical clarity. An ergonomic declination angle promotes natural posture — ideal for detailed procedures that demand precision.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["3.0x", "4.0x", "5.0x", "6.0x", "7.5x", "10x"].map((m) => (
                                    <span key={m} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02.5 Ergo V / Ergo V Pro Magnification Selector ── */}
            <ErgoMagnificationSelector />

            {/* ── 03 Headlights ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / Headlights</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Shadow-Free<br />Illumination.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                From wired Orchid models to the wireless Butterfly series — every Admetec headlight delivers consistent, daylight-quality visibility for even the most demanding procedures.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Wireless & wired options available",
                                    "True daylight color rendering",
                                    "Ultra-lightweight for all-day comfort",
                                    "Long-lasting battery life",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-neutral-600">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-600">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                <Image
                                    src="/images/products/admetec/Lights/Flamingo/Flamingo-with-Loupes-and-PowerPack.webp"
                                    alt="Admetec Flamingo headlight with loupes"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Admetec ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Professionals Choose Admetec</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Built on Six Pillars</h2>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-primary-600">
                                    {f.icon}
                                    <h3 className="text-sm font-bold text-neutral-900">{f.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-neutral-500">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-14 text-white md:py-28" style={{ background: "linear-gradient(135deg, #001926 0%, #002f43 50%, #00465e 100%)" }}>
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Try Before You Order
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Book a fitting call — our team measures your working distance and interpupillary distance so your loupes are dialed in before they ship.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/product-category/admetec">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg hover:bg-primary-50">
                                Browse Products
                            </Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-10 text-white hover:border-white hover:bg-white/10">
                                Book a Fitting Call
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
