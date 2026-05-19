"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { TeamMember } from "@/components/about/TeamMember";
import type { TeamMemberData } from "@/components/about/TeamMember";

// ── Hooks ──────────────────────────────────────────────────────────────────

function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}

function useScrollProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const fn = () => {
            const d = document.documentElement.scrollHeight - window.innerHeight;
            setP(d > 0 ? window.scrollY / d : 0);
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);
    return p;
}

// ── Static data ────────────────────────────────────────────────────────────

const TIMELINE = [
    { year: "2013", title: "Founded in Mumbai", body: "Haitech Medical Solutions incorporated with a focus on importing precision dental instruments." },
    { year: "2015", title: "First Brand Partnership", body: "Became the authorised distributor for Admetec surgical loupes across India." },
    { year: "2018", title: "Network Expansion", body: "Grew to 15+ dealer partners spanning major metros — Delhi, Bangalore, Chennai, Pune." },
    { year: "2024", title: "5 Brands · 27+ Dealers", body: "Now India's most trusted partner for five world-class global dental brands." },
];

const BRANDS = [
    { name: "Admetec",  logo: "/BrandLogo/AdmetecLogo.png",  cat: "Loupes · Optics",      desc: "Surgical loupes & LED headlights built for precision." },
    { name: "Strauss",  logo: "/BrandLogo/StraussLogo.jpg",  cat: "Burs · Rotary",        desc: "High-performance diamond burs & rotary instruments." },
    { name: "Medesy",   logo: "/BrandLogo/MedesyLogo.jpg",   cat: "Instruments",           desc: "Italian-crafted dental instruments of unmatched quality." },
    { name: "Salli",    logo: "/BrandLogo/SalliLogo.png",    cat: "Ergonomic Seating",    desc: "Saddle chairs that protect posture over long procedures." },
    { name: "Almadent", logo: "/BrandLogo/AlmadentLogo.jpg", cat: "Dental Chairs",        desc: "Feature-rich chairs designed for the modern clinic." },
];

const STATS = [
    { value: "13+",   label: "Years in Business" },
    { value: "27+",   label: "Dealer Partners" },
    { value: "5",     label: "Global Brands" },
    { value: "1000+", label: "Professionals Served" },
];

// ── Chapter label ──────────────────────────────────────────────────────────

function ChapterLabel({ n, title, light }: { n: string; title: string; light?: boolean }) {
    return (
        <div data-reveal="fade" className="mb-8 flex items-center gap-3">
            <span className={`font-mono text-xs font-black tracking-[0.2em] ${light ? "text-white/30" : "text-primary-400"}`}>{n}</span>
            <span className={`h-px w-8 ${light ? "bg-white/15" : "bg-primary-200"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-white/40" : "text-neutral-400"}`}>{title}</span>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AboutPageClient({ teamMembers }: { teamMembers: TeamMemberData[] }) {
    useReveal();
    const progress = useScrollProgress();

    return (
        <>
            {/* Scroll progress bar */}
            <div
                className="fixed left-0 top-0 z-[60] h-[3px] bg-primary-500 transition-[width] duration-75"
                style={{ width: `${progress * 100}%` }}
            />

            {/* ── 01 · Hero ──────────────────────────────────────────────── */}
            <section className="relative flex min-h-[94vh] flex-col justify-center overflow-hidden bg-navy-gradient px-6 py-28">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-primary-500/8 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-white/3 blur-3xl" />

                {/* Large background chapter number */}
                <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[20vw] font-black leading-none text-white/[0.03]">01</span>

                <div className="container relative z-10">
                    <p data-reveal="fade" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                        Est. 2013 · Mumbai, India
                    </p>

                    <h1 data-reveal="up" className="mb-6 font-extrabold leading-[0.9] tracking-tight text-white" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}>
                        Haitech
                        <br />
                        <span className="text-primary-400">Medical</span>
                    </h1>

                    <p data-reveal="up" className="reveal-d1 mb-12 max-w-md text-lg leading-relaxed text-white/55">
                        India&apos;s most trusted partner for premium dental &amp; medical equipment — empowering professionals since 2013.
                    </p>

                    <a data-reveal="fade" href="#origin" className="reveal-d2 group inline-flex items-center gap-2 text-sm font-semibold text-white/40 transition-colors hover:text-white/80">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-white/30">
                            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                        </span>
                        Scroll to explore
                    </a>
                </div>
            </section>

            {/* ── 02 · Origin ────────────────────────────────────────────── */}
            <section id="origin" className="relative overflow-hidden bg-white px-6 py-28 md:py-36">
                <span className="pointer-events-none absolute right-0 top-0 select-none text-[18vw] font-black leading-none text-neutral-900/[0.025]">02</span>

                <div className="container relative">
                    <ChapterLabel n="01" title="Origin" />

                    <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
                        {/* Left — headline + body */}
                        <div>
                            <h2 data-reveal="up" className="mb-6 font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                                A company built on
                                <span className="block text-primary-500">clinical excellence</span>
                            </h2>
                            <p data-reveal="up" className="reveal-d1 mb-5 text-lg leading-relaxed text-neutral-500">
                                At <strong className="text-neutral-700">Haitech Medical Solutions Pvt. Ltd.</strong>, we import and market top-tier dental solutions across India. Founded in Mumbai in 2013, we&apos;ve grown from a vision into a trusted network connecting 27+ dealers and thousands of dental professionals nationwide.
                            </p>
                            <p data-reveal="up" className="reveal-d2 text-lg leading-relaxed text-neutral-500">
                                Every product we carry is chosen with one goal: helping clinicians deliver the highest standard of care to their patients.
                            </p>
                        </div>

                        {/* Right — timeline */}
                        <div className="relative pl-2">
                            {TIMELINE.map((item, i) => (
                                <div key={item.year} data-reveal="right" className={`reveal-d${Math.min(i + 1, 5)} relative flex gap-6 pb-10 last:pb-0`}>
                                    {/* Connector */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-xs font-black text-primary-600">
                                            {item.year.slice(2)}
                                        </div>
                                        {i < TIMELINE.length - 1 && (
                                            <div className="mt-2 w-px flex-1 bg-gradient-to-b from-primary-200 to-transparent" />
                                        )}
                                    </div>
                                    <div className="pt-1.5">
                                        <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">{item.year}</p>
                                        <p className="mb-1 font-semibold text-neutral-800">{item.title}</p>
                                        <p className="text-sm leading-relaxed text-neutral-400">{item.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 03 · Brands ────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-neutral-50 px-6 py-28 md:py-36">
                <span className="pointer-events-none absolute right-0 top-0 select-none text-[18vw] font-black leading-none text-neutral-900/[0.025]">03</span>

                <div className="container relative">
                    <ChapterLabel n="02" title="Our Brands" />

                    <div className="mb-14 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <h2 data-reveal="up" className="font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                            5 World-Class Brands,
                            <span className="block text-primary-500">One Partner</span>
                        </h2>
                        <p data-reveal="fade" className="reveal-d1 max-w-xs text-base text-neutral-500">
                            Every brand is handpicked for clinical precision and proven outcomes.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {BRANDS.map((brand, i) => (
                            <div
                                key={brand.name}
                                data-reveal="scale"
                                className={`reveal-d${Math.min(i + 1, 5)} group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_8px_32px_-8px_rgba(31,182,205,0.2)]`}
                            >
                                <div className="mb-5 flex h-10 items-center">
                                    <Image src={brand.logo} alt={brand.name} width={80} height={32} className="h-8 w-auto object-contain" />
                                </div>
                                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary-500">{brand.cat}</p>
                                <p className="mt-auto text-sm leading-relaxed text-neutral-500">{brand.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 04 · Impact numbers ────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-navy-gradient px-6 py-28 md:py-36">
                <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[20vw] font-black leading-none text-white/[0.03]">04</span>

                <div className="container relative">
                    <ChapterLabel n="03" title="Our Impact" light />
                    <h2 data-reveal="up" className="mb-20 font-extrabold leading-tight text-white" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                        Numbers that
                        <span className="block text-primary-300">speak for themselves</span>
                    </h2>

                    <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                        {STATS.map((stat, i) => (
                            <div key={stat.label} data-reveal="up" className={`reveal-d${i + 1}`}>
                                <div className="mb-2 font-extrabold leading-none text-white" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 05 · Purpose ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-white px-6 py-28 md:py-36">
                <span className="pointer-events-none absolute right-0 top-0 select-none text-[18vw] font-black leading-none text-neutral-900/[0.025]">05</span>

                <div className="container relative">
                    <ChapterLabel n="04" title="Our Purpose" />
                    <h2 data-reveal="up" className="mb-14 font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                        What drives
                        <span className="text-primary-500"> us forward</span>
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div data-reveal="left" className="flex flex-col rounded-3xl border border-neutral-100 bg-neutral-50 p-8 md:p-10">
                            <p className="mb-5 text-5xl font-black leading-none text-primary-200">&ldquo;</p>
                            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-primary-500">Mission</p>
                            <p className="flex-1 text-lg leading-relaxed text-neutral-600">
                                To enhance the lives of dental and medical professionals — dentists, hygienists, surgeons, and veterinarians — by equipping them with cutting-edge tools to deliver exceptional care and healthier outcomes.
                            </p>
                        </div>
                        <div data-reveal="right" className="reveal-d1 flex flex-col rounded-3xl bg-primary-gradient p-8 md:p-10">
                            <p className="mb-5 text-5xl font-black leading-none text-white/25">&ldquo;</p>
                            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-primary-200">Vision</p>
                            <p className="flex-1 text-lg leading-relaxed text-white/80">
                                To be the most trusted partner in advancing dental and medical excellence — providing innovative, ergonomic, and precision-driven solutions that empower professionals to deliver the highest standard of care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 06 · Team ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-neutral-50 px-6 py-28 md:py-36">
                <span className="pointer-events-none absolute right-0 top-0 select-none text-[18vw] font-black leading-none text-neutral-900/[0.025]">06</span>

                <div className="container relative">
                    <ChapterLabel n="05" title="The People" />
                    <h2 data-reveal="up" className="mb-3 font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
                        Meet Our Team
                    </h2>
                    <p data-reveal="up" className="reveal-d1 mb-14 max-w-lg text-lg text-neutral-500">
                        The dedicated professionals behind Haitech Medical who work tirelessly to support your success.
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {teamMembers.map((member, i) => (
                            <div key={member.id} data-reveal="scale" className={`reveal-d${Math.min((i % 5) + 1, 5)}`}>
                                <TeamMember member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 07 · CTA ───────────────────────────────────────────────── */}
            <section className="overflow-hidden bg-primary-gradient px-6 py-28">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <p data-reveal="fade" className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-primary-200">
                            Partner With Us
                        </p>
                        <h2 data-reveal="up" className="mb-6 font-extrabold leading-tight text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            Join Our Growing Network
                        </h2>
                        <p data-reveal="up" className="reveal-d1 mb-10 text-lg text-white/60">
                            Connect with India&apos;s leading dental equipment partner and grow your practice with world-class products.
                        </p>
                        <div data-reveal="up" className="reveal-d2 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/support/contact"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Contact Us
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                            >
                                Explore Products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
