"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TeamMember } from "@/components/about/TeamMember";
import type { TeamMemberData } from "@/components/about/TeamMember";
import { TeamMemberDialog } from "@/components/about/TeamMemberDialog";
import { CountUp, HeroScene, MaskReveal, Reveal, ScrollRail, ScrollWords } from "@/components/about/motion";
import SectionHeader from "@/components/misc/SectionHeader";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_PRIMARY } from "@/components/ui/surfaces";

// ── Static data ────────────────────────────────────────────────────────────

const TIMELINE = [
    { year: "2013", title: "Founded in Mumbai", body: "Haitech Medical Solutions incorporated with a focus on importing precision dental instruments." },
    { year: "2015", title: "First Brand Partnership", body: "Became the authorised distributor for Admetec surgical loupes across India." },
    { year: "2018", title: "Network Expansion", body: "Grew to 15+ dealer partners spanning major metros — Delhi, Bangalore, Chennai, Pune." },
    { year: "2026", title: "6 Brands · 27+ Dealers", body: "Now India's most trusted partner for six world-class global dental brands." },
];

const BRANDS = [
    { name: "Admetec", logo: "/BrandLogo/AdmetecLogo.jpeg", cat: "Loupes & Optics", desc: "Surgical loupes & LED headlights built for precision.", href: "/product/admetec" },
    { name: "Strauss", logo: "/BrandLogo/StraussLogo.jpeg", cat: "Burs & Rotary", desc: "High-performance diamond burs & rotary instruments.", href: "/product/strauss" },
    { name: "Medesy", logo: "/BrandLogo/MedesyLogo.jpeg", cat: "Instruments", desc: "Italian-crafted dental instruments of unmatched quality.", href: "/product/medesy" },
    { name: "Salli", logo: "/BrandLogo/SalliLogo.jpeg", cat: "Ergonomic Seating", desc: "Saddle chairs that protect posture over long procedures.", href: "/product/salli" },
    { name: "Almadent", logo: "/BrandLogo/AlmadentLogo.jpeg", cat: "Dental Chairs", desc: "Feature-rich treatment chairs for the modern clinic.", href: "/product/almadent" },
    { name: "Bondent", logo: "/BrandLogo/BondentGroupLogo.jpg", cat: "Endo & Imaging", desc: "German-registered endodontics, imaging & digital implant systems.", href: "/product/bondent" },
];

const STATS = [
    { value: "15+", label: "Years in business" },
    { value: "27+", label: "Dealer partners" },
    { value: "6", label: "Global brands" },
    { value: "1000+", label: "Professionals served" },
];

// ── Sections ───────────────────────────────────────────────────────────────

function Hero() {
    return (
        <HeroScene contentClassName="container pt-12 pb-16 md:pt-20 md:pb-24">
            <Reveal>
                <p className="text-primary-700 text-[15px] font-medium">Est. 2013 · Mumbai, India</p>
            </Reveal>
            <h1 className="mt-4 text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.035em] text-neutral-900 md:text-7xl">
                <MaskReveal delay={120}>Haitech Medical</MaskReveal>
            </h1>
            <Reveal delay={320}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-[1.375rem] md:leading-[1.5]">
                    India&apos;s most trusted partner for premium dental &amp; medical equipment — empowering professionals since 2013.
                </p>
            </Reveal>
        </HeroScene>
    );
}

function Origin() {
    return (
        <section id="origin" className="bg-white">
            <div className="container pb-20 md:pb-28">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
                    <Reveal className="max-w-[60ch]">
                        <h2 className="text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">A company built on clinical excellence</h2>
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
                            <Link href={brand.href} className={`${INTERACTIVE_CARD} w-full p-6 md:p-7`}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <div className="flex h-12 items-center">
                                    <Image src={brand.logo} alt={brand.name} width={96} height={40} className="h-9 w-auto object-contain mix-blend-multiply" />
                                </div>
                                <p className="mt-6 text-[13px] font-medium text-neutral-500">{brand.cat}</p>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-700">{brand.desc}</p>
                                <span className="text-primary-700 mt-5 inline-flex items-center gap-1 text-[15px] font-medium">
                                    Explore {brand.name}
                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </span>
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
                                <CountUp value={stat.value} />
                            </dd>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
}

const STATEMENT_CLASS = "mt-4 text-[1.625rem] leading-[1.25] font-semibold tracking-[-0.02em] text-neutral-900 md:text-[2.5rem]";

function Purpose() {
    return (
        <section className="bg-white">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="What drives us forward" />
                </Reveal>
                <div className="grid max-w-4xl gap-16 md:gap-24">
                    <div>
                        <h3 className="text-primary-700 text-[15px] font-semibold">Mission</h3>
                        <ScrollWords
                            className={STATEMENT_CLASS}
                            text="To enhance the lives of dental and medical professionals — dentists, hygienists, surgeons, and veterinarians — by equipping them with cutting-edge tools to deliver exceptional care and healthier outcomes."
                        />
                    </div>
                    <div>
                        <h3 className="text-primary-700 text-[15px] font-semibold">Vision</h3>
                        <ScrollWords
                            className={STATEMENT_CLASS}
                            text="To be the most trusted partner in advancing dental and medical excellence — providing innovative, ergonomic, and precision-driven solutions that empower professionals to deliver the highest standard of care."
                        />
                    </div>
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
            <div className="section container text-center">
                <Reveal>
                    <h2 className="mx-auto max-w-2xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">
                        Join India&apos;s growing dental professional network
                    </h2>
                </Reveal>
                <Reveal delay={150} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/support/contact" className={PILL_PRIMARY}>
                        Contact us
                    </Link>
                    <Link href="/products" className="btn btn-secondary btn-lg">
                        Explore products
                    </Link>
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
