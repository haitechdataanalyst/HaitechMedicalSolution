"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { TeamMember } from "@/components/about/TeamMember";
import type { TeamMemberData } from "@/components/about/TeamMember";
import { TeamMemberDialog } from "@/components/about/TeamMemberDialog";

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

function useHorizontalDrag(ref: React.RefObject<HTMLDivElement | null>) {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        isDragging.current = true;
        startX.current = e.pageX;
        scrollStart.current = ref.current.scrollLeft;
        ref.current.style.cursor = "grabbing";
    }, [ref]);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging.current || !ref.current) return;
        e.preventDefault();
        ref.current.scrollLeft = scrollStart.current - (e.pageX - startX.current);
    }, [ref]);

    const stopDrag = useCallback(() => {
        isDragging.current = false;
        if (ref.current) ref.current.style.cursor = "grab";
    }, [ref]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            const atStart = el.scrollLeft <= 0;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
            if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [ref]);

    return { onMouseDown, onMouseMove, onMouseUp: stopDrag, onMouseLeave: stopDrag };
}

function useAutoScroll(ref: React.RefObject<HTMLDivElement | null>, speed = 1) {
    const paused = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let raf: number;
        const tick = () => {
            if (!paused.current) {
                el.scrollLeft += speed;
                if (el.scrollLeft >= el.scrollWidth / 2) {
                    el.scrollLeft -= el.scrollWidth / 2;
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        const pause = () => { paused.current = true; };
        const resume = () => { paused.current = false; };

        el.addEventListener("mouseenter", pause);
        el.addEventListener("mouseleave", resume);
        el.addEventListener("touchstart", pause, { passive: true });
        el.addEventListener("touchend", resume, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("mouseenter", pause);
            el.removeEventListener("mouseleave", resume);
            el.removeEventListener("touchstart", pause);
            el.removeEventListener("touchend", resume);
        };
    }, [ref, speed]);
}

// ── Static data ────────────────────────────────────────────────────────────

const TIMELINE = [
    { year: "2013", title: "Founded in Mumbai", body: "Haitech Medical Solutions incorporated with a focus on importing precision dental instruments." },
    { year: "2015", title: "First Brand Partnership", body: "Became the authorised distributor for Admetec surgical loupes across India." },
    { year: "2018", title: "Network Expansion", body: "Grew to 15+ dealer partners spanning major metros — Delhi, Bangalore, Chennai, Pune." },
    { year: "2024", title: "5 Brands · 27+ Dealers", body: "Now India's most trusted partner for five world-class global dental brands." },
];

const BRANDS = [
    { name: "Admetec",  logo: "/BrandLogo/AdmetecLogo.png",  cat: "Loupes & Optics",      desc: "Surgical loupes & LED headlights built for precision." },
    { name: "Strauss",  logo: "/BrandLogo/StraussLogo.png",  cat: "Burs & Rotary",        desc: "High-performance diamond burs & rotary instruments." },
    { name: "Medesy",   logo: "/BrandLogo/MedesyLogo.jpg",   cat: "Instruments",           desc: "Italian-crafted dental instruments of unmatched quality." },
    { name: "Salli",    logo: "/BrandLogo/SalliLogo.png",    cat: "Ergonomic Seating",     desc: "Saddle chairs that protect posture over long procedures." },
    { name: "Almadent", logo: "/BrandLogo/AlmadentLogo.jpg", cat: "Dental Chairs",         desc: "Feature-rich treatment chairs for the modern clinic." },
];

const STATS = [
    { value: "15+",   label: "Years in business" },
    { value: "27+",   label: "Dealer partners" },
    { value: "5",     label: "Global brands" },
    { value: "1000+", label: "Professionals served" },
];

// ── Section label ──────────────────────────────────────────────────────────

function SectionMeta({ index, title, light }: { index: string; title: string; light?: boolean }) {
    return (
        <div data-reveal="fade" className="mb-8 flex items-center gap-3">
            <span className={`font-mono text-[10px] font-bold tracking-[0.2em] ${light ? "text-white/25" : "text-neutral-300"}`}>{index}</span>
            <span className={`h-px w-6 ${light ? "bg-white/10" : "bg-neutral-200"}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${light ? "text-white/35" : "text-neutral-400"}`}>{title}</span>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AboutPageClient({ teamMembers }: { teamMembers: TeamMemberData[] }) {
    useReveal();
    const progress = useScrollProgress();
    const teamScrollRef = useRef<HTMLDivElement>(null);
    const teamDrag = useHorizontalDrag(teamScrollRef);
    useAutoScroll(teamScrollRef);

    const [activeMember, setActiveMember] = useState<TeamMemberData | null>(null);

    return (
        <>
            {/* Scroll progress */}
            <div
                className="fixed left-0 top-0 z-[60] h-[2px] bg-primary-500 transition-[width] duration-75"
                style={{ width: `${progress * 100}%` }}
            />

            {/* ── 01 · Hero ──────────────────────────────────────────────── */}
            <section className="relative flex min-h-[94vh] flex-col justify-center bg-navy-gradient px-6 py-28">
                <div className="container relative z-10">
                    <p data-reveal="fade" className="mb-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
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

                    <a data-reveal="fade" href="#origin" className="reveal-d2 group inline-flex items-center gap-2.5 text-sm text-white/35 transition-colors hover:text-white/70">
                        <span className="flex h-7 w-7 items-center justify-center border border-white/10 transition-colors group-hover:border-white/25">
                            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                        </span>
                        Scroll to explore
                    </a>
                </div>
            </section>

            {/* ── 02 · Origin ────────────────────────────────────────────── */}
            <section id="origin" className="bg-white px-6 py-24 md:py-32">
                <div className="container">
                    <SectionMeta index="01" title="Origin" />

                    <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
                        {/* Left — headline + body */}
                        <div>
                            <h2 data-reveal="up" className="mb-6 font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
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
                                <div key={item.year} data-reveal="right" className={`reveal-d${Math.min(i + 1, 5)} relative flex gap-5 pb-9 last:pb-0`}>
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-200 bg-white text-xs font-bold text-neutral-600">
                                            {item.year.slice(2)}
                                        </div>
                                        {i < TIMELINE.length - 1 && (
                                            <div className="mt-2 w-px flex-1 bg-neutral-100" />
                                        )}
                                    </div>
                                    <div className="pt-1">
                                        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-500">{item.year}</p>
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
            <section className="bg-neutral-50 px-6 py-24 md:py-32">
                <div className="container">
                    <SectionMeta index="02" title="Our Brands" />

                    <div className="mb-12 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <h2 data-reveal="up" className="font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            5 world-class brands,
                            <span className="block text-primary-500">one partner</span>
                        </h2>
                        <p data-reveal="fade" className="reveal-d1 max-w-xs text-base text-neutral-500">
                            Every brand is selected for clinical precision and proven outcomes.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {BRANDS.map((brand, i) => (
                            <div
                                key={brand.name}
                                data-reveal="scale"
                                className={`reveal-d${Math.min(i + 1, 5)} group flex flex-col rounded-xl border border-neutral-200 bg-white p-6 transition-colors duration-200 hover:border-neutral-300`}
                            >
                                <div className="mb-5 flex h-10 items-center">
                                    <Image src={brand.logo} alt={brand.name} width={80} height={32} className="h-8 w-auto object-contain" />
                                </div>
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{brand.cat}</p>
                                <p className="mt-auto text-sm leading-relaxed text-neutral-500">{brand.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 04 · Impact numbers ────────────────────────────────────── */}
            <section className="bg-navy-gradient px-6 py-24 md:py-32">
                <div className="container">
                    <SectionMeta index="03" title="By the numbers" light />

                    <p data-reveal="up" className="mb-16 max-w-lg text-lg leading-relaxed text-white/55">
                        Over a decade building the infrastructure that connects India&apos;s dental professionals to the world&apos;s finest instruments.
                    </p>

                    <div className="grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4">
                        {STATS.map((stat, i) => (
                            <div key={stat.label} data-reveal="up" className={`reveal-d${i + 1}`}>
                                <div className="mb-1.5 font-extrabold leading-none tracking-tight text-white" style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs font-medium text-white/35">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 05 · Purpose ───────────────────────────────────────────── */}
            <section className="bg-white px-6 py-24 md:py-32">
                <div className="container">
                    <SectionMeta index="04" title="Our purpose" />
                    <h2 data-reveal="up" className="mb-12 font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                        What drives
                        <span className="text-primary-500"> us forward</span>
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Mission */}
                        <div data-reveal="left" className="flex flex-col rounded-xl border border-neutral-100 bg-neutral-50 p-8 md:p-10">
                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Mission</p>
                            <p className="flex-1 text-[17px] leading-relaxed text-neutral-700">
                                To enhance the lives of dental and medical professionals — dentists, hygienists, surgeons, and veterinarians — by equipping them with cutting-edge tools to deliver exceptional care and healthier outcomes.
                            </p>
                        </div>

                        {/* Vision */}
                        <div data-reveal="right" className="reveal-d1 flex flex-col rounded-xl bg-primary-gradient p-8 md:p-10">
                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-200">Vision</p>
                            <p className="flex-1 text-[17px] leading-relaxed text-white/80">
                                To be the most trusted partner in advancing dental and medical excellence — providing innovative, ergonomic, and precision-driven solutions that empower professionals to deliver the highest standard of care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 06 · Team ──────────────────────────────────────────────── */}
            <section className="bg-neutral-50 px-6 py-24 md:py-32">
                <div className="container">
                    <SectionMeta index="05" title="The people" />
                    <div className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                        <h2 data-reveal="up" className="font-extrabold leading-tight text-neutral-900" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            Meet our team
                        </h2>
                        <p data-reveal="fade" className="reveal-d1 text-sm text-neutral-400">
                            Select any portrait to learn more
                        </p>
                    </div>

                    <div
                        ref={teamScrollRef}
                        {...teamDrag}
                        className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                    >
                        {[...teamMembers, ...teamMembers].map((member, i) => (
                            <div key={`${member.id}-${i}`} className="flex-none w-[148px] h-[230px] sm:w-[172px] sm:h-[255px] md:w-[190px] md:h-[270px] lg:w-[210px] lg:h-[290px]">
                                <TeamMember member={member} onClick={() => setActiveMember(member)} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TeamMemberDialog member={activeMember} onClose={() => setActiveMember(null)} />

            {/* ── 07 · CTA ───────────────────────────────────────────────── */}
            <section className="bg-primary-gradient px-6 py-20 md:py-28">
                <div className="container">
                    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-lg">
                            <p data-reveal="fade" className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-200">
                                Partner with us
                            </p>
                            <h2 data-reveal="up" className="font-extrabold leading-tight text-white" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>
                                Join India&apos;s growing<br />dental professional network
                            </h2>
                        </div>

                        <div data-reveal="up" className="reveal-d1 flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col md:items-end lg:flex-row">
                            <Link
                                href="/support/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-opacity hover:opacity-90"
                            >
                                Contact us
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                Explore products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
