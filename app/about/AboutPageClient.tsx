"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TeamMember } from "@/components/about/TeamMember";
import type { TeamMemberData } from "@/components/about/TeamMember";
import { TeamMemberDialog } from "@/components/about/TeamMemberDialog";
import { CountUp, MaskReveal, Reveal, ScrollRail } from "@/components/about/motion";
import SectionHeader from "@/components/misc/SectionHeader";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_GHOST_ON_DARK, PILL_ON_DARK, PILL_PRIMARY } from "@/components/ui/surfaces";

// ── Static data ────────────────────────────────────────────────────────────

const TIMELINE = [
    { year: "2013", title: "Founded in Mumbai", body: "Haitech Medical Solutions incorporated with a focus on importing precision dental instruments." },
    { year: "2015", title: "First Brand Partnership", body: "Became the authorised distributor for Admetec surgical loupes across India." },
    { year: "2018", title: "Network Expansion", body: "Grew to 15+ dealer partners spanning major metros — Delhi, Bangalore, Chennai, Pune." },
    { year: "2026", title: "6 Brands · 27+ Dealers", body: "Now India's most trusted partner for six world-class global dental brands." },
];

const BRANDS = [
    { name: "Admetec", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308413/haitech/images/products/admetec/loupes-ergo-5-0x/blues-frame/blues-black-ergo-5.jpg", logo: "/BrandLogo/AdmetecLogo.jpeg", cat: "Loupes & Optics", desc: "Surgical loupes & LED headlights built for precision.", href: "/product/admetec" },
    { name: "Bondent", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308052/haitech/images/products/bondent/actor-i-pro.png", logo: "/BrandLogo/BondentGroupLogo.jpg", cat: "Endo & Imaging", desc: "German-registered endodontics, imaging & digital implant systems.", href: "/product/bondent" },
    { name: "Medesy", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308213/haitech/images/products/medesy/elevator/700slash8.jpg", logo: "/BrandLogo/MedesyLogo.jpeg", cat: "Instruments", desc: "Italian-crafted dental instruments of unmatched quality.", href: "/product/medesy" },
    { name: "Salli", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308128/haitech/images/products/salli/triple-fit-black.jpg", logo: "/BrandLogo/SalliLogo.jpeg", cat: "Ergonomic Seating", desc: "Saddle chairs that protect posture over long procedures.", href: "/product/salli" },
    { name: "Almadent", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308202/haitech/images/products/almadent/chairs/ay-6000-1.jpg", logo: "/BrandLogo/AlmadentLogo.jpeg", cat: "Dental Chairs", desc: "Feature-rich treatment chairs for the modern clinic.", href: "/product/almadent" },
    { name: "Strauss", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308257/haitech/images/products/strauss/a-series/a1c.jpg", logo: "/BrandLogo/StraussLogo.jpeg", cat: "Burs & Rotary", desc: "High-performance diamond burs & rotary instruments.", href: "/product/strauss" },
];

const STATS = [
    { value: "2013", label: "Year we were founded", fixed: true },
    { value: "27+", label: "Dealer partners" },
    { value: "6", label: "Global brands" },
    { value: "1000+", label: "Professionals served" },
];

const brandPhoto = (name: string) => BRANDS.find((b) => b.name === name)?.photo ?? "";

const HERO_COLLAGE = [
    { src: brandPhoto("Admetec"), alt: "Admetec Ergo loupes", className: "col-span-2 row-span-2", fit: "p-8 md:p-14" },
    { src: brandPhoto("Almadent"), alt: "Almadent dental treatment chair", className: "col-span-1 row-span-1", fit: "p-4 md:p-7" },
    { src: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308054/haitech/images/products/bondent/bondent-cbct-1030-pro.png", alt: "Bondent CBCT-1030 Pro imaging system", className: "col-span-1 row-span-1", fit: "p-4 md:p-7" },
];

const MISSION = "To enhance the lives of dental and medical professionals — dentists, hygienists, surgeons, and veterinarians — by equipping them with cutting-edge tools to deliver exceptional care and healthier outcomes.";
const VISION = "To be the most trusted partner in advancing dental and medical excellence — providing innovative, ergonomic, and precision-driven solutions that empower professionals to deliver the highest standard of care.";

// ── Sections ───────────────────────────────────────────────────────────────

function Hero() {
    return (
        <section className="bg-white">
            <div className="container pt-12 pb-10 text-center md:pt-20 md:pb-14">
                <Reveal>
                    <p className="text-primary-700 text-[15px] font-medium">Est. 2013 · Mumbai, India</p>
                </Reveal>
                <h1 className="mx-auto mt-4 max-w-4xl text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-neutral-900 md:text-7xl">
                    <MaskReveal delay={120}>Haitech Medical</MaskReveal>
                </h1>
                <Reveal delay={320}>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-balance text-neutral-600 md:text-[1.375rem] md:leading-[1.5]">
                        India&apos;s most trusted partner for premium dental &amp; medical equipment — empowering professionals since 2013.
                    </p>
                </Reveal>
                <Reveal delay={460} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/products" className={PILL_PRIMARY}>
                        Explore products
                    </Link>
                    <Link href="/support/contact" className="btn btn-secondary btn-lg">
                        Contact us
                    </Link>
                </Reveal>
            </div>

            <div className="container pb-16 md:pb-24">
                <Reveal variant="scale" delay={200}>
                    <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-3 md:aspect-[16/8] md:gap-5">
                        {HERO_COLLAGE.map((tile, i) => (
                            <div key={tile.alt} className={`relative overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-neutral-900/[0.05] ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}>
                                <Image src={tile.src} alt={tile.alt} fill priority={i === 0} sizes={i === 0 ? "(min-width: 768px) 66vw, 66vw" : "(min-width: 768px) 33vw, 33vw"} className={`object-contain mix-blend-multiply ${tile.fit}`} />
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function Origin() {
    return (
        <section id="origin" className="bg-white">
            <div className="section container">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
                    <Reveal className="max-w-[60ch] lg:sticky lg:top-28 lg:self-start">
                        <p className="text-primary-700 text-[15px] font-medium">Our story</p>
                        <h2 className="mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">A company built on clinical excellence</h2>
                        <p className="mt-6 text-[17px] leading-relaxed text-neutral-600">
                            At <strong className="font-semibold text-neutral-900">Haitech Medical Solutions Pvt. Ltd.</strong>, we import and market top-tier dental solutions across India. Founded in
                            Mumbai in 2013, we&apos;ve grown from a vision into a trusted network connecting 27+ dealers and thousands of dental professionals nationwide.
                        </p>
                        <p className="mt-5 text-[17px] leading-relaxed text-neutral-600">
                            Every product we carry is chosen with one goal: helping clinicians deliver the highest standard of care to their patients.
                        </p>
                    </Reveal>

                    <ScrollRail>
                        <ol className="divide-y divide-neutral-900/[0.06]" aria-label="Company timeline">
                            {TIMELINE.map((item, i) => (
                                <Reveal as="li" key={item.year} delay={i * 90} className="relative grid grid-cols-[4.5rem_1fr] gap-4 py-5">
                                    <span aria-hidden="true" className="absolute top-[1.7rem] -left-8 h-2 w-2 -translate-x-1/2 rounded-full bg-white ring-2 ring-neutral-900/20" />
                                    <span className="text-primary-700 text-[15px] font-semibold tabular-nums">{item.year}</span>
                                    <div>
                                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{item.title}</h3>
                                        <p className="mt-1 text-[15px] leading-relaxed text-neutral-600">{item.body}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </ol>
                    </ScrollRail>
                </div>
            </div>
        </section>
    );
}

function Brands() {
    return (
        <section className="bg-neutral-50">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="6 world-class brands, one partner" subtitle="Every brand is selected for clinical precision and proven outcomes." />
                </Reveal>
                <ul className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {BRANDS.map((brand, i) => (
                        <Reveal as="li" key={brand.name} variant="scale" delay={(i % 3) * 100} className="flex">
                            <Link href={brand.href} className={`${INTERACTIVE_CARD} w-full`}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-neutral-50">
                                    <Image src={brand.photo} alt={`${brand.name} ${brand.cat.toLowerCase()}`} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]" />
                                </div>
                                <div className="flex flex-1 flex-col p-6 md:p-7">
                                    <Image src={brand.logo} alt="" width={96} height={40} className="h-8 w-auto self-start object-contain mix-blend-multiply" />
                                    <p className="mt-5 text-[13px] font-medium text-neutral-500">{brand.cat}</p>
                                    <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-700">{brand.desc}</p>
                                    <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-5 text-[15px] font-medium">
                                        Explore {brand.name}
                                        <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function Numbers() {
    return (
        <section className="bg-navy-gradient">
            <div className="section container">
                <Reveal>
                    <SectionHeader tone="dark" title="By the numbers" subtitle="Over a decade building the infrastructure that connects India's dental professionals to the world's finest instruments." />
                </Reveal>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                    {STATS.map((stat, i) => (
                        <Reveal key={stat.label} delay={i * 110} className="flex flex-col-reverse">
                            <dt className="text-navy-200 mt-2 text-[15px] leading-snug">{stat.label}</dt>
                            <dd className="text-5xl leading-none font-semibold tracking-[-0.03em] text-white tabular-nums md:text-6xl">
                                {"fixed" in stat ? stat.value : <CountUp value={stat.value} />}
                            </dd>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
}

function Purpose() {
    const items = [
        { label: "Mission", text: MISSION },
        { label: "Vision", text: VISION },
    ];
    return (
        <section className="bg-white">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="What drives us forward" />
                </Reveal>
                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {items.map((item, i) => (
                        <Reveal key={item.label} delay={i * 120} variant="scale" className="flex">
                            <div className="flex w-full flex-col rounded-3xl bg-neutral-50 p-8 ring-1 ring-neutral-900/[0.05] md:p-11">
                                <h3 className="text-primary-700 text-[15px] font-semibold">{item.label}</h3>
                                <p className="mt-5 text-[1.375rem] leading-[1.35] font-semibold tracking-[-0.018em] text-neutral-900 md:text-[1.75rem]">{item.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Team({ members, onSelect }: { members: TeamMemberData[]; onSelect: (member: TeamMemberData) => void }) {
    return (
        <section id="team" className="bg-neutral-50">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="Meet our team" subtitle="Select any portrait to learn more." />
                </Reveal>
                <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 xl:grid-cols-5">
                    {members.map((member, i) => (
                        <Reveal as="li" key={member.id} variant="scale" delay={(i % 5) * 70}>
                            <TeamMember member={member} onClick={() => onSelect(member)} />
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function ClosingCta() {
    return (
        <section className="bg-white">
            <div className="container pb-16 md:pb-24">
                <Reveal variant="scale">
                    <div className="bg-navy-gradient rounded-3xl px-6 py-14 text-center md:px-16 md:py-20">
                        <h2 className="mx-auto max-w-2xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-balance text-white md:text-[2.5rem]">
                            Join India&apos;s growing dental professional network
                        </h2>
                        <p className="text-navy-200 mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg">Tell us what your clinic needs and our team will get back to you.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link href="/support/contact" className={PILL_ON_DARK}>
                                Contact us
                            </Link>
                            <Link href="/products" className={PILL_GHOST_ON_DARK}>
                                Explore products
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AboutPageClient({ teamMembers }: { teamMembers: TeamMemberData[] }) {
    const [activeMember, setActiveMember] = useState<TeamMemberData | null>(null);
    const closeDialog = useCallback(() => setActiveMember(null), []);

    return (
        <>
            <Hero />
            <Origin />
            <Brands />
            <Numbers />
            <Purpose />
            <Team members={teamMembers} onSelect={setActiveMember} />
            <TeamMemberDialog member={activeMember} onClose={closeDialog} />
            <ClosingCta />
        </>
    );
}
