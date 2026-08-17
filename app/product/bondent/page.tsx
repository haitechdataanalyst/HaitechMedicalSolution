import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Target, Lightbulb, GraduationCap, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bondent | German Dental Technology Group",
    description: "Bondent Group — German-registered dental technology group offering endodontic equipment and imaging systems built on over a decade of in-house R&D.",
};

const pillars = [
    { icon: <HeartHandshake className="h-6 w-6" />, title: "Compassion", description: "Patient-first product design focused on better clinical outcomes." },
    { icon: <Target className="h-6 w-6" />, title: "Determination", description: "Continuous long-term investment in research, engineering, and product development." },
    { icon: <Lightbulb className="h-6 w-6" />, title: "Innovation", description: "Ongoing development of modern dental technologies across multiple specialties." },
    { icon: <GraduationCap className="h-6 w-6" />, title: "Appreciation", description: "Supporting clinicians through education, workshops, and Bondent Academy." },
];

const flagshipProducts = [
    "CBCT Imaging Systems",
    "UDG Endodontic Files",
];

export default function BondentAboutPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-[calc(100dvh-98px)] flex-col items-center justify-center overflow-hidden bg-navy-gradient md:min-h-[calc(100dvh-139px)]">
                <Image
                    src="/images/products/bondent/Bondent CBCT-1030 Pro.png"
                    alt="Bondent dental technology"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/30 via-navy-900/55 to-navy-900" />

                <nav className="absolute left-0 top-0 z-20 px-6 py-5 text-xs text-white/40">
                    <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <Link href="/products" className="transition-colors hover:text-white/70">Products</Link>
                    <span className="mx-2 opacity-40">/</span>
                    <span className="text-white/60">Bondent</span>
                </nav>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        German-Registered · Global Dental Innovation
                    </span>
                    <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-9xl">
                        Bondent
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        A full-spectrum dental technology group offering equipment, consumables, and digital solutions—from diagnostic imaging to precision endodontics—built on over a decade of in-house research and manufacturing.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/bondent" className="btn btn-lg btn-primary rounded-full px-8">
                            Explore Bondent Range
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
                        &ldquo;Integrated dental technology, engineered to help clinicians treat with more confidence.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "5",        l: "Product Categories" },
                            { v: "CE",       l: "Certified"          },
                            { v: "180,000+", l: "Academy Learners"   },
                            { v: "15+",      l: "Years in R&D"       },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-primary-400 md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Endo & Ortho ── */}
            <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">01 / Endo & Ortho</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Root to Crown,<br />Every Angle.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                Rotary root canal files, obturation instruments, endodontic accessories, orthodontic brackets, archwires, and molar bands designed for reliable everyday clinical performance.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Rotary Files", "Hand Files & Obturation", "Orthodontics", "Endo Accessories"].map((t) => (
                                    <span key={t} className="rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <Link
                                href="/product-category/bondent/endo-files/rotary-files/cc-premium"
                                className="group block overflow-hidden rounded-3xl bg-white shadow-2xl shadow-neutral-200"
                            >
                                <Image
                                    src="/images/products/bondent/CC Premium.jpg"
                                    alt="Bondent rotary endodontic files"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105 md:p-10"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Imaging & Optics ── */}
            <section className="bg-navy-gradient py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <Link href="/product-category/bondent/imaging/cbct-1020ms" className="group block overflow-hidden rounded-3xl bg-navy-800 shadow-2xl">
                                <Image
                                    src="/images/products/bondent/CBCT 1020MS.png"
                                    alt="Bondent CBCT imaging system"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105 md:p-10"
                                />
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Imaging & Optics</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                                See More.<br />Miss Nothing.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-white/55 md:text-lg">
                                High-resolution CBCT systems with advanced metal-artifact reduction technology and surgical loupes built for enhanced clinical precision.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "CBCT with metal-artifact reduction",
                                    "Surgical loupes for precision work",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                                        <CheckCircle className="h-4 w-4 shrink-0 text-primary-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Bondent ── */}
            <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Choose Bondent</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Built on Four Values</h2>
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

            {/* ── Brand Background ── */}
            <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">About Bondent Group</span>
                            <p className="text-base leading-relaxed text-neutral-500 md:text-lg">
                                Bondent Group GmbH is a German-registered dental technology company established in 2021, with operational roots dating back to 2009. Headquartered in Shanghai, Bondent develops products across five major dental categories including Endodontics, Optics, Orthodontics, Imaging, and Dental Units.
                            </p>
                            <p className="mt-4 text-base leading-relaxed text-neutral-500 md:text-lg">
                                The company also operates <strong className="font-semibold text-neutral-700">Bondent Academy</strong>, an educational platform dedicated to clinician training and professional development.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm md:p-8">
                                <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-neutral-400">Flagship Portfolio</span>
                                <ul className="space-y-3">
                                    {flagshipProducts.map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-sm text-neutral-700">
                                            <CheckCircle className="h-4 w-4 shrink-0 text-primary-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-brand-gradient py-14 text-white md:py-28">
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Interested in Bondent equipment for your clinic?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Talk to our team about endodontic systems or imaging equipment for your practice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/support/contact"
                            className="btn btn-lg rounded-full bg-white px-10 font-bold text-primary-700 shadow-lg transition-all hover:bg-primary-50"
                        >
                            Request a Quote
                        </Link>
                        <Link
                            href="/product-category/bondent"
                            className="btn btn-lg rounded-full border border-white/25 px-10 text-white transition-all hover:border-white hover:bg-white/10"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
