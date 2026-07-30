import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HeartHandshake, Target, Lightbulb, GraduationCap, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bondent | German Dental Technology Group",
    description: "Bondent Group — German-registered dental technology group offering endodontic equipment, imaging systems, implants, and digital workflow solutions built on over a decade of in-house R&D.",
};

const pillars = [
    { icon: <HeartHandshake className="h-6 w-6" />, title: "Compassion", description: "Patient-first product design focused on better clinical outcomes." },
    { icon: <Target className="h-6 w-6" />, title: "Determination", description: "Continuous long-term investment in research, engineering, and product development." },
    { icon: <Lightbulb className="h-6 w-6" />, title: "Innovation", description: "Ongoing development of modern dental technologies across multiple specialties." },
    { icon: <GraduationCap className="h-6 w-6" />, title: "Appreciation", description: "Supporting clinicians through education, workshops, and Bondent Academy." },
];

const flagshipProducts = [
    "Semorr Dental Microscope",
    "CBCT Imaging Systems",
    "UDG Endodontic Files",
    "iEZ Implant System",
    "Dr. Clear Invisible Aligner",
];

export default function BondentAboutPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
                <Image
                    src="/images/products/bondent/Bondent CBCT-1030 Pro.png"
                    alt="Bondent dental technology"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/55 to-neutral-950" />

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
                        A full-spectrum dental technology group offering equipment, consumables, and digital solutions—from diagnostic imaging to implant surgery—built on over a decade of in-house research and manufacturing.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-1">
                        <Link href="/product-category/bondent">
                            <Button size="lg" className="rounded-full px-8">Explore Bondent Range</Button>
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
            <section className="bg-[#071c30] py-10 md:py-20 lg:py-28">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl lg:text-3xl">
                        &ldquo;Integrated dental technology, engineered to help clinicians treat with more confidence.&rdquo;
                    </p>
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-4">
                        {[
                            { v: "6",        l: "Product Categories" },
                            { v: "CE",       l: "Certified"          },
                            { v: "180,000+", l: "Academy Learners"   },
                            { v: "15+",      l: "Years in R&D"       },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-2xl font-bold text-[#3B9CE8] md:text-3xl lg:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 01 Endo & Ortho ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
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
                                    <span key={t} className="rounded-full bg-[#0F5EA8]/8 px-4 py-2 text-sm font-bold text-[#0F5EA8]">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                <Image
                                    src="/images/products/bondent/CC Premium.jpg"
                                    alt="Bondent rotary endodontic files"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 02 Imaging & Optics ── */}
            <section className="bg-neutral-950 py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-800 shadow-2xl">
                                <Image
                                    src="/images/products/bondent/DOM 3000D-4K PRO.png"
                                    alt="Bondent Semorr dental microscope"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/30">02 / Imaging & Optics</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                                See More.<br />Miss Nothing.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-white/55 md:text-lg">
                                High-resolution CBCT systems with advanced metal-artifact reduction technology, Semorr dental microscopes, and surgical loupes built for enhanced clinical precision.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "CBCT with metal-artifact reduction",
                                    "Semorr dental microscopes",
                                    "Surgical loupes for precision work",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                                        <CheckCircle className="h-4 w-4 shrink-0 text-[#3B9CE8]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 03 Implants & Digital Workflow ── */}
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">03 / Implants & Digital Workflow</span>
                            <h2 className="mb-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl lg:text-5xl">
                                Plan Digital.<br />Place Precisely.
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-neutral-500 md:text-lg">
                                iEZ implant systems, semi-circular surgical guides, modern dental chair units, and the Dr. Clear invisible aligner supporting complete digital dentistry workflows.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["iEZ Implants", "Surgical Guides", "Dental Chair Units", "Dr. Clear Aligner"].map((t) => (
                                    <span key={t} className="rounded-full bg-[#0F5EA8]/8 px-4 py-2 text-sm font-bold text-[#0F5EA8]">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="overflow-hidden rounded-3xl bg-neutral-50 shadow-2xl shadow-neutral-200">
                                <Image
                                    src="/images/products/bondent/iEZ Dental Implant.jpg"
                                    alt="Bondent iEZ implant system"
                                    width={700}
                                    height={525}
                                    className="h-auto w-full object-contain p-6 md:p-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Bondent ── */}
            <section className="bg-neutral-50 py-12 md:py-24">
                <div className="container">
                    <div className="mb-8 text-center md:mb-14">
                        <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">Why Choose Bondent</span>
                        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">Built on Four Values</h2>
                    </div>
                    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="border-t border-neutral-200 pt-5">
                                <div className="mb-2 flex items-center gap-2.5 text-[#0F5EA8]">
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
            <section className="bg-white py-12 md:py-24 lg:py-32">
                <div className="container">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-neutral-400">About Bondent Group</span>
                            <p className="text-base leading-relaxed text-neutral-500 md:text-lg">
                                Bondent Group GmbH is a German-registered dental technology company established in 2021, with operational roots dating back to 2009. Headquartered in Shanghai, Bondent develops products across six major dental categories including Endodontics, Optics, Orthodontics, Imaging, Dental Units, and Implant Systems.
                            </p>
                            <p className="mt-4 text-base leading-relaxed text-neutral-500 md:text-lg">
                                The company also operates <strong className="font-semibold text-neutral-700">Bondent Academy</strong>, an educational platform dedicated to clinician training and professional development.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 md:p-8">
                                <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-neutral-400">Flagship Portfolio</span>
                                <ul className="space-y-3">
                                    {flagshipProducts.map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-sm text-neutral-700">
                                            <CheckCircle className="h-4 w-4 shrink-0 text-[#0F5EA8]" />
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
            <section className="py-14 text-white md:py-28" style={{ background: "linear-gradient(135deg, #071c30 0%, #0a3a63 50%, #0F5EA8 100%)" }}>
                <div className="container text-center">
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                        Interested in Bondent equipment for your clinic?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base text-white/55 md:text-lg">
                        Talk to our team about endodontic systems, imaging equipment, or digital implant workflows for your practice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/support/contact">
                            <Button size="lg" className="rounded-full bg-white px-10 font-bold text-[#0F5EA8] shadow-lg hover:bg-neutral-50">
                                Request a Quote
                            </Button>
                        </Link>
                        <Link href="/product-category/bondent">
                            <Button size="lg" variant="outline" className="rounded-full border-white/25 px-10 text-white hover:border-white hover:bg-white/10">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
