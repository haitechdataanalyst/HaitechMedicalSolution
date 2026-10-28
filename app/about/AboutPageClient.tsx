"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/components/about/TeamMember";
import type { TeamMemberData } from "@/components/about/TeamMember";
import { TeamMemberDialog } from "@/components/about/TeamMemberDialog";
import { MaskReveal, Reveal } from "@/components/about/motion";
import { linkAdmetec } from "@/components/brand/AdmetecText";
import ChapterNav from "@/components/about/ChapterNav";
import BrandCarousel from "@/components/about/BrandCarousel";
import SectionHeader from "@/components/misc/SectionHeader";
import StatsPanel from "@/components/misc/StatsPanel";
import BalancedGrid from "@/components/catalog/BalancedGrid";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_GHOST_ON_DARK, PILL_ON_DARK, PILL_PRIMARY } from "@/components/ui/surfaces";

// ── Static data ────────────────────────────────────────────────────────────

const TIMELINE = [
    { year: "2011", title: "Founded in Mumbai", body: "Haitech Medical Solutions incorporated with a focus on importing precision dental instruments." },
    { year: "2015", title: "First Brand Partnership", body: "Became the authorised distributor for Admetec surgical loupes across India." },
    { year: "2018", title: "Network Expansion", body: "Grew to 15+ dealer partners spanning major metros — Delhi, Bangalore, Chennai, Pune." },
    { year: "2026", title: "6 Brands · 27+ Dealers", body: "Now India's most trusted partner for six world-class global dental brands." },
];

const BRANDS = [
    { name: "Admetec", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308413/haitech/images/products/admetec/loupes-ergo-5-0x/blues-frame/blues-black-ergo-5.jpg", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308664/haitech/brandlogo/admeteclogo.jpg", cat: "Loupes & Optics", desc: "Surgical loupes & LED headlights built for precision.", href: "/product/admetec" },
    { name: "Bondent", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308052/haitech/images/products/bondent/actor-i-pro.png", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308665/haitech/brandlogo/bondentgrouplogo.jpg", cat: "Endo & Imaging", desc: "German-registered endodontics, imaging & digital implant systems.", href: "/product/bondent" },
    { name: "Medesy", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308213/haitech/images/products/medesy/elevator/700slash8.jpg", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308666/haitech/brandlogo/medesylogo.jpg", cat: "Instruments", desc: "Italian-crafted dental instruments of unmatched quality.", href: "/product/medesy" },
    { name: "Salli", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308128/haitech/images/products/salli/triple-fit-black.jpg", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308667/haitech/brandlogo/sallilogo.jpg", cat: "Ergonomic Seating", desc: "Saddle chairs that protect posture over long procedures.", href: "/product/salli" },
    { name: "Almadent", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308202/haitech/images/products/almadent/chairs/ay-6000-1.jpg", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308664/haitech/brandlogo/almadentlogo.jpg", cat: "Dental Chairs", desc: "Feature-rich treatment chairs for the modern clinic.", href: "/product/almadent" },
    { name: "Strauss", photo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308257/haitech/images/products/strauss/a-series/a1c.jpg", logo: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308668/haitech/brandlogo/strausslogo.jpg", cat: "Burs & Rotary", desc: "High-performance diamond burs & rotary instruments.", href: "/product/strauss" },
];

const STATS = [
    { value: "2011", label: "Year we were founded", fixed: true },
    { value: "27+", label: "Dealer partners" },
    { value: "6", label: "Global brands" },
    { value: "1000+", label: "Professionals served" },
];

const brandPhoto = (name: string) => BRANDS.find((b) => b.name === name)?.photo ?? "";

// Three of the six brands, as the first look at what Haitech supplies. Each tile goes to that brand's page.
const LINEUP = [
    { brand: "Admetec", src: brandPhoto("Admetec"), alt: "Admetec Ergo loupes" },
    { brand: "Almadent", src: brandPhoto("Almadent"), alt: "Almadent dental treatment chair" },
    { brand: "Bondent", src: "https://res.cloudinary.com/gwnakzdo/image/upload/v1785308054/haitech/images/products/bondent/bondent-cbct-1030-pro.png", alt: "Bondent CBCT-1030 Pro imaging system" },
].map((item) => {
    const brand = BRANDS.find((b) => b.name === item.brand)!;
    return { ...item, cat: brand.cat, href: brand.href };
});

const CHAPTERS = [
    { id: "story", label: "Our story" },
    { id: "brands", label: "Brands" },
    { id: "numbers", label: "Numbers" },
    { id: "mission", label: "Mission" },
    { id: "team", label: "Team" },
];




// ── Sections ───────────────────────────────────────────────────────────────

const MISSION = "To enhance the lives of dental and medical professionals — dentists, hygienists, surgeons, and veterinarians — by equipping them with cutting-edge tools to deliver exceptional care and healthier outcomes.";
const VISION = "To be the most trusted partner in advancing dental and medical excellence — providing innovative, ergonomic, and precision-driven solutions that empower professionals to deliver the highest standard of care.";

function Hero() {
    return (
        <section className="bg-white">
            <div className="container pt-12 pb-10 text-center md:pt-20 md:pb-14">
                <Reveal>
                    <p className="text-primary-700 text-[15px] font-medium">Est. 2011 · Mumbai, India</p>
                </Reveal>
                <h1 className="mx-auto mt-4 max-w-4xl text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-neutral-900 md:text-7xl">
                    <MaskReveal delay={120}>Haitech Medical</MaskReveal>
                </h1>
                <Reveal delay={320}>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-balance text-neutral-600 md:text-[1.375rem] md:leading-[1.5]">
                        India&apos;s most trusted partner for premium dental &amp; medical equipment — empowering professionals since 2011.
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

            {/* A first look at the range: three equal tiles, each a way into that brand */}
            <div className="container pb-12 md:pb-16">
                <ul className="grid gap-4 sm:grid-cols-3 md:gap-5">
                    {LINEUP.map((item, i) => (
                        <Reveal as="li" key={item.brand} variant="scale" delay={i * 100} className="flex">
                            <Link href={item.href} className={`${INTERACTIVE_CARD} w-full`}>
                                <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-neutral-50 sm:aspect-[4/5]">
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        priority={i === 0}
                                        sizes="(min-width: 640px) 33vw, 100vw"
                                        className="object-contain p-8 mix-blend-multiply transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
                                    />
                                </div>
                                <div className="p-5 md:p-6">
                                    <p className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">{item.brand}</p>
                                    <p className="mt-1 text-[15px] text-neutral-500">{item.cat}</p>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function Story() {
    return (
        <section id="story" className="scroll-mt-32 bg-white">
            <div className="section container">
                <Reveal className="max-w-3xl">
                    <p className="text-primary-700 text-[15px] font-medium">Our story</p>
                    <h2 className="mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">A company built on clinical excellence</h2>
                    <p className="mt-6 text-[17px] leading-relaxed text-neutral-600 md:text-lg">
                        At <strong className="font-semibold text-neutral-900">Haitech Medical Solutions Pvt. Ltd.</strong>, we import and market top-tier dental solutions across India. Founded in
                        Mumbai in 2011, we&apos;ve grown from a vision into a trusted network connecting 27+ dealers and thousands of dental professionals nationwide.
                    </p>
                    <p className="mt-5 text-[17px] leading-relaxed text-neutral-600 md:text-lg">Every product we carry is chosen with one goal: helping clinicians deliver the highest standard of care to their patients.</p>
                </Reveal>

                {/* Four moments, each led by its year */}
                <ol aria-label="Company timeline" className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-4">
                    {TIMELINE.map((item, i) => (
                        <Reveal as="li" key={item.year} variant="scale" delay={i * 90} className="flex">
                            <div className="flex w-full flex-col rounded-3xl bg-neutral-50 p-6 md:p-7">
                                <span className="text-primary-700 text-[2.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums md:text-5xl">{item.year}</span>
                                <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{item.title}</h3>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{linkAdmetec(item.body)}</p>
                            </div>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </section>
    );
}

function Brands() {
    return (
        <section id="brands" className="scroll-mt-32 bg-neutral-50">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="6 world-class brands, one partner" subtitle="Every brand is selected for clinical precision and proven outcomes." />
                </Reveal>
                <BrandCarousel brands={BRANDS} />
            </div>
        </section>
    );
}

function Mission() {
    const items = [
        { label: "Mission", text: MISSION },
        { label: "Vision", text: VISION },
    ];
    return (
        <section id="mission" className="scroll-mt-32 bg-neutral-50">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="What drives us forward" />
                </Reveal>
                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {items.map((item, i) => (
                        <Reveal key={item.label} delay={i * 120} variant="scale" className="flex">
                            <div className="flex w-full flex-col rounded-3xl bg-white p-8 ring-1 ring-neutral-900/[0.04] md:p-11">
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
        <section id="team" className="scroll-mt-32 bg-white">
            <div className="section container">
                <Reveal>
                    <SectionHeader title="Meet our team" subtitle="Select any portrait to learn more." />
                </Reveal>
                {/* An unfinished last row is centred, so the grid never ends with one tile alone at the left. */}
                <BalancedGrid layout="team" list className="gap-y-8 md:gap-y-10">
                    {members.map((member, i) => (
                        <Reveal key={member.id} variant="scale" delay={(i % 5) * 70}>
                            <TeamMember member={member} onClick={() => onSelect(member)} />
                        </Reveal>
                    ))}
                </BalancedGrid>
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

// ── Page ──────────────────────────────────────────────────────────────────

export default function AboutPageClient({ teamMembers }: { teamMembers: TeamMemberData[] }) {
    const [activeMember, setActiveMember] = useState<TeamMemberData | null>(null);
    const closeDialog = useCallback(() => setActiveMember(null), []);

    return (
        <>
            <Hero />
            {/* The chapters share one parent, so the navigation stays in view from the story to the team. */}
            <div>
                <ChapterNav chapters={CHAPTERS} />
                <Story />
                <Brands />
                <StatsPanel id="numbers" title="By the numbers" subtitle="Over a decade building the infrastructure that connects India's dental professionals to the world's finest instruments." stats={STATS} />
                <Mission />
                <Team members={teamMembers} onSelect={setActiveMember} />
            </div>
            <TeamMemberDialog member={activeMember} onClose={closeDialog} />
            <ClosingCta />
        </>
    );
}
