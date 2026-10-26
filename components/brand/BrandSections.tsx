import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, PILL_GHOST_ON_DARK, PILL_ON_DARK, PILL_PRIMARY, SURFACE_CARD } from "@/components/ui/surfaces";
import SectionHeader from "@/components/misc/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import JsonLd from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

// Building blocks shared by the brand landing pages (/product/admetec, /product/salli, …):
// a calm light hero, split feature sections, pillar cards, product cards and one closing band.

export interface BrandAction {
    href: string;
    label: string;
}

type Tone = "white" | "gray";

const TONE_BG: Record<Tone, string> = { white: "bg-white", gray: "bg-neutral-50" };

/** Secondary pill on a light surface. */
const PILL_SECONDARY_LIGHT =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold text-primary-800 ring-1 ring-inset ring-primary-800/25 transition-[transform,background-color] duration-200 ease-out hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:active:scale-[0.97] motion-safe:active:duration-100";

/** Lead paragraph inside a feature section. */
export const BRAND_LEAD = "text-base leading-relaxed text-neutral-600 md:text-lg";

export function BrandSection({ tone = "white", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
    return (
        <section className={TONE_BG[tone]}>
            <div className={cn("section container", className)}>{children}</div>
        </section>
    );
}

interface BrandHeroProps {
    name: string;
    tagline: string;
    description: string;
    image: string;
    imageAlt: string;
    /** "contain" for product shots on white; "cover" for wide banner photography. */
    imageFit?: "cover" | "contain";
    primary: BrandAction;
    secondary: BrandAction;
    /** The brand page's own route; defaults to /product/<name> (all brand pages follow that pattern). */
    path?: string;
    /** Shown directly under the name, e.g. a manufacturer's required logo and link. */
    underName?: ReactNode;
}

/** Brand hero: breadcrumb, name as the H1, one-line tagline, two actions, then a wide image tile. Renders immediately (no reveal). */
export function BrandHero({ name, tagline, description, image, imageAlt, imageFit = "cover", primary, secondary, path = `/product/${name.toLowerCase()}`, underName }: BrandHeroProps) {
    return (
        <section className="bg-white">
            {/* Same trail as the visible breadcrumb below */}
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Products", path: "/products" },
                    { name, path },
                ])}
            />
            <div className="container pt-4 pb-14 md:pb-20">
                <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-500">
                    <ol className="flex flex-wrap items-center">
                        <li>
                            <Link href="/" className="hover:text-primary-700 inline-flex min-h-11 items-center">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                            <Link href="/products" className="hover:text-primary-700 inline-flex min-h-11 items-center">
                                Products
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                            <span aria-current="page" className="text-neutral-900">
                                {name}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center md:mt-12">
                    <p className="text-primary-700 text-[15px] font-medium md:text-base">{tagline}</p>
                    <h1 className="mt-3 text-[3rem] leading-[1.02] font-semibold tracking-[-0.035em] text-neutral-900 sm:text-7xl md:text-8xl">{name}</h1>
                    {underName && <div className="mt-2">{underName}</div>}
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-xl">{description}</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href={primary.href} className={PILL_PRIMARY}>
                            {primary.label}
                        </Link>
                        <Link href={secondary.href} className={PILL_SECONDARY_LIGHT}>
                            {secondary.label}
                        </Link>
                    </div>
                </div>

                <div className={cn("relative mt-12 aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[16/9] md:mt-16 lg:aspect-[21/9]", imageFit === "contain" ? "bg-neutral-50" : "bg-neutral-100")}>
                    <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        priority
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className={imageFit === "contain" ? "object-contain p-8 mix-blend-multiply md:p-12" : "object-cover"}
                    />
                </div>
            </div>
        </section>
    );
}

/** A short brand statement with up to four headline figures. Light, no quote styling theatrics. */
export function BrandStatement({ quote, stats }: { quote: string; stats: { v: string; l: string }[] }) {
    return (
        <BrandSection tone="gray">
            <ScrollReveal variant="fade">
                <p className="mx-auto max-w-3xl text-center text-2xl leading-snug font-semibold tracking-[-0.02em] text-balance text-neutral-900 md:text-4xl">{quote}</p>
            </ScrollReveal>
            <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-4">
                {stats.map((s) => (
                    <li key={s.l} className="text-center">
                        <p className="text-primary-800 text-3xl font-semibold tracking-[-0.02em] tabular-nums md:text-4xl">{s.v}</p>
                        <p className="mt-1.5 text-[13px] text-neutral-500">{s.l}</p>
                    </li>
                ))}
            </ul>
        </BrandSection>
    );
}

interface BrandFeatureProps {
    eyebrow?: string;
    title: ReactNode;
    children: ReactNode;
    media: ReactNode;
    /** Put the media on the left at lg+. */
    reverse?: boolean;
    tone?: Tone;
}

/** Split section: copy on one side, media on the other. Stacks copy-first on mobile. */
export function BrandFeature({ eyebrow, title, children, media, reverse = false, tone = "white" }: BrandFeatureProps) {
    return (
        <BrandSection tone={tone}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={cn(reverse && "lg:order-2")}>
                    {eyebrow && <p className="text-primary-700 mb-2 text-[15px] font-medium">{eyebrow}</p>}
                    <h2 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">{title}</h2>
                    <div className="mt-5 space-y-6">{children}</div>
                </div>
                <div className={cn(reverse && "lg:order-1")}>{media}</div>
            </div>
        </BrandSection>
    );
}

/** Product photo tile; a whole-card link when href is given. */
export function MediaTile({ src, alt, href, aspect = "aspect-[4/3]", className }: { src: string; alt: string; href?: string; aspect?: string; className?: string }) {
    const inner = (
        <div className={cn("relative overflow-hidden rounded-xl bg-neutral-50", aspect)}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03] md:p-10"
            />
        </div>
    );

    if (!href) return <div className={cn(SURFACE_CARD, "p-2", className)}>{inner}</div>;
    return (
        <Link href={href} className={cn(INTERACTIVE_CARD, "p-2", className)}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            {inner}
        </Link>
    );
}

/** Links that read as selectable chips (e.g. magnifications). */
export function BrandChipLinks({ items }: { items: BrandAction[] }) {
    return (
        <div className="flex flex-wrap gap-2.5">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="focus-visible:outline-primary-500 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-medium text-neutral-900 ring-1 ring-neutral-900/10 transition-[transform,box-shadow] duration-200 ease-out hover:ring-neutral-900/25 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}

/** Static descriptive tags. */
export function BrandTags({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
                <li key={item} className="rounded-full bg-neutral-900/[0.05] px-4 py-2 text-[15px] text-neutral-700">
                    {item}
                </li>
            ))}
        </ul>
    );
}

export function BrandChecklist({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
    return (
        <ul className={cn("grid gap-x-6 gap-y-3", columns === 2 && "sm:grid-cols-2")}>
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
                    <Check className="text-primary-700 mt-1 h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2.5} />
                    {item}
                </li>
            ))}
        </ul>
    );
}

export interface BrandPillar {
    icon: ReactNode;
    title: string;
    description: string;
}

/** "Why choose X" grid: quiet cards, icon in brand colour, no numbering or icon tiles. */
export function BrandPillars({ title, subtitle, items, columns = 3, tone = "white" }: { title: string; subtitle?: string; items: BrandPillar[]; columns?: 3 | 4; tone?: Tone }) {
    return (
        <BrandSection tone={tone}>
            <ScrollReveal variant="fade">
                <SectionHeader title={title} subtitle={subtitle} />
            </ScrollReveal>
            <ul className={cn("grid gap-5 sm:grid-cols-2 md:gap-6", columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
                {items.map((item) => (
                    <li key={item.title} className={cn(SURFACE_CARD, "p-6 md:p-7")}>
                        <span className="text-primary-700 block [&_svg]:h-6 [&_svg]:w-6" aria-hidden="true">
                            {item.icon}
                        </span>
                        <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{item.title}</h3>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{item.description}</p>
                    </li>
                ))}
            </ul>
        </BrandSection>
    );
}

export interface BrandProduct {
    name: string;
    image: string;
    href: string;
    description?: string;
    meta?: string;
}

/** Product / category cards in the same material as the home page brand cards. */
export function BrandProductCards({ title, subtitle, items, columns = 3, tone = "white" }: { title: string; subtitle?: string; items: BrandProduct[]; columns?: 3 | 4; tone?: Tone }) {
    return (
        <BrandSection tone={tone}>
            <ScrollReveal variant="fade">
                <SectionHeader title={title} subtitle={subtitle} />
            </ScrollReveal>
            <ul className={cn("grid gap-5 sm:grid-cols-2 md:gap-6", columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
                {items.map((item) => (
                    <li key={item.name}>
                        <Link href={item.href} className={cn(INTERACTIVE_CARD, "h-full p-2")}>
                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                                    className="object-contain p-8 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                                />
                            </div>
                            <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
                                <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">{item.name}</h3>
                                {item.description && <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">{item.description}</p>}
                                {item.meta && <p className="mt-1 text-[13px] text-neutral-500">{item.meta}</p>}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </BrandSection>
    );
}

/** Closing call to action — the page's single dark band ("light" for brands that stay all-light). */
export function BrandCTA({ title, description, primary, secondary, tone = "dark" }: { title: string; description: string; primary: BrandAction; secondary: BrandAction; tone?: "dark" | "light" }) {
    const isDark = tone === "dark";
    return (
        <section className={isDark ? "bg-navy-gradient" : "bg-white"}>
            <div className="section container text-center">
                <ScrollReveal variant="fade">
                    <h2 className={cn("mx-auto max-w-3xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance md:text-5xl", isDark ? "text-white" : "text-neutral-900")}>
                        {title}
                    </h2>
                </ScrollReveal>
                <p className={cn("mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg", isDark ? "text-navy-200" : "text-neutral-500")}>{description}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href={primary.href} className={isDark ? PILL_ON_DARK : PILL_PRIMARY}>
                        {primary.label}
                    </Link>
                    <Link href={secondary.href} className={isDark ? PILL_GHOST_ON_DARK : PILL_SECONDARY_LIGHT}>
                        {secondary.label}
                    </Link>
                </div>
            </div>
        </section>
    );
}
