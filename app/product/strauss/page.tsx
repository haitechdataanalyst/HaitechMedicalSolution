import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Diamond, Zap, ThermometerSun, Target, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Strauss | Precision Diamond Burs for Dentistry",
    description: "Strauss Diamond Burs — precision-engineered rotary instruments delivering efficient cutting, smooth performance, and consistent clinical results for dental professionals.",
};

const advantages = [
    { icon: <Diamond className="h-6 w-6" />, title: "Uniform Diamond Distribution", description: "Precisely distributed diamond particles ensure consistent cutting efficiency across the entire working surface." },
    { icon: <Zap className="h-6 w-6" />, title: "Efficient Cutting", description: "Advanced bonding technology delivers smooth, effortless cutting performance with every use." },
    { icon: <ThermometerSun className="h-6 w-6" />, title: "Minimal Heat & Vibration", description: "Engineered to minimize heat generation and vibration for safer, more comfortable procedures." },
    { icon: <Target className="h-6 w-6" />, title: "Consistent Geometry", description: "Stable handling and predictable performance when working with enamel, dentin, and restorative materials." },
    { icon: <Clock className="h-6 w-6" />, title: "Long Service Life", description: "Known for exceptional sharpness and durability that outlast conventional diamond burs." },
    { icon: <ShieldCheck className="h-6 w-6" />, title: "Safety & Control", description: "Excellent control and visibility during procedures, prioritizing accuracy and patient safety." },
];

const burSeries = [
    { name: "A-Series", description: "Standard diamond burs for general preparation and restorative procedures.", image: "/images/products/strauss/a-series/A1M.jpg" },
    { name: "B-Series", description: "Fine-grit burs designed for contouring, adjustment, and finishing work.", image: "/images/products/strauss/b-series/B1M.jpg" },
    { name: "P-Series", description: "Specialty shapes and configurations for specific clinical indications.", image: "/images/products/strauss/p-series/PR13M.jpg" },
];

export default function AboutStraussPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/strauss/strauss-banner.jpg"
                    alt="Strauss diamond burs"
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
                    <span className="text-white/60">Strauss</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Precision Diamond Technology · ISO 9001
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        Strauss
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Precision-engineered rotary instruments designed to deliver efficient cutting, smooth performance, and consistent clinical results for the modern dental practice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/strauss">
                            <Button size="lg" className="rounded-full px-8">Explore Diamond Burs</Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-8 text-white hover:bg-white/10">
                                Request Samples
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Statement ── */}
            <section className="bg-[#001926] py-10 md:py-20 lg:py-28">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl lg:text-3xl">
                        &ldquo;Diamond-sharp precision. Built to outlast, built to perform.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "ISO 9001", l: "Certified Quality"  },
                            { v: "3",        l: "Bur Series"         },
                            { v: "Min.",     l: "Heat & Vibration"   },
                            { v: "Long",     l: "Service Life"       },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-primary-400 md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Engineering ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / Engineering</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Excellence in<br />Every Bur.
                            </h2>
                            <p className="mb-4 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Manufactured using high-quality materials and advanced bonding technology, Strauss burs provide excellent durability and uniform diamond distribution for reliable cutting efficiency.
                            </p>
                            <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                                Specifically developed for precise cutting and controlled material removal in restorative dentistry — multiple shapes, grits, and configurations to support preparation, adjustment, and finishing across all common clinical indications.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/strauss/a-series/A2M.jpg" alt="Strauss A-series bur" width={350} height={350} className="h-auto w-full object-contain p-4" />
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/strauss/b-series/B2M.jpg" alt="Strauss B-series bur" width={350} height={350} className="h-auto w-full object-contain p-4" />
                                </div>
                                <div className="overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/strauss/p-series/PR24M.jpg" alt="Strauss P-series bur" width={350} height={350} className="h-auto w-full object-contain p-4" />
                                </div>
                                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-50 shadow-lg">
                                    <Image src="/images/products/strauss/a-series/A4M.jpg" alt="Strauss bur closeup" width={350} height={350} className="h-auto w-full object-contain p-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Bur Series ── */}
            <section className="bg-neutral-950 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Bur Series</span>
                        <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            Three Series.<br />Every Indication.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
                            Covering preparation, adjustment, and finishing across all common clinical indications.
                        </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {burSeries.map((series) => (
                            <div key={series.name} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:border-primary-500/30 hover:bg-white/10">
                                <div className="relative aspect-square overflow-hidden bg-white/5">
                                    <Image
                                        src={series.image}
                                        alt={`Strauss ${series.name}`}
                                        fill
                                        className="object-contain p-10 transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="border-t border-white/10 p-5 md:p-6">
                                    <h3 className="mb-2 text-base font-bold text-white">{series.name}</h3>
                                    <p className="text-sm leading-relaxed text-white/50">{series.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 03 Clinical Applications ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / Clinical Applications</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Built for the Chair</h2>
                    </div>
                    <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
                        {["Crown Preparation", "Cavity Preparation", "Material Adjustment", "Surface Finishing"].map((app) => (
                            <span key={app} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700">
                                {app}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Strauss ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Choose Strauss</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Six Clinical Advantages</h2>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        {advantages.map((a) => (
                            <div key={a.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-primary-600">
                                    {a.icon}
                                    <h3 className="text-sm font-bold text-neutral-900">{a.title}</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-neutral-500">{a.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[#001926] py-14 text-white md:py-28">
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Cut with Confidence
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Request a sample set for your next case and see the difference in cutting efficiency and finish.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/product-category/strauss">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg hover:bg-primary-50">
                                Shop Diamond Burs
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
