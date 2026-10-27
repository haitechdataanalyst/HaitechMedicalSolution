import { linkAdmetec } from "@/components/brand/AdmetecText";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeadlightCategory, HeadlightsData } from "@/types";
import { cleanText, headlightFigures, seriesMaxIntensity } from "@/lib/headlight-specs";
import { PILL_GHOST_ON_DARK, PILL_ON_DARK } from "@/components/ui/surfaces";
import ScrollReveal from "@/components/ui/ScrollReveal";

const HEADLIGHTS_PATH = "/our-headlights";

function SeriesCard({ category }: { category: HeadlightCategory }) {
    const models = category.products.filter((p) => !p.isAccessory);
    const peak = seriesMaxIntensity(category);
    return (
        <Link
            href={`${HEADLIGHTS_PATH}#${category.id}`}
            className="group focus-visible:outline-primary-300 flex h-full flex-col rounded-3xl bg-white/[0.06] p-2 ring-1 ring-white/10 transition-[transform,background-color] duration-200 ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.985]"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
                <Image
                    src={category.image}
                    alt={`${category.name} Admetec headlight`}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-contain p-8 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03] md:p-10"
                />
            </div>
            <div className="flex flex-1 flex-col px-5 pt-6 pb-5">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">{category.name}</h3>
                <p className="mt-1 text-[15px] text-white/70">{category.description}</p>
                <p className="mt-4 text-[13px] text-white/60">
                    {models.length} {models.length === 1 ? "model" : "models"}
                    {peak ? ` · up to ${peak}` : ""}
                </p>
                <p className="mt-auto flex items-center gap-1.5 pt-5 text-[15px] font-medium text-white">
                    Explore {category.name.toLowerCase()} lights
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
            </div>
        </Link>
    );
}

/** The Admetec headlight range as a full-width band on the brand page: both series, headline figures and a way into the full lights page. */
export function AdmetecLights({ intro, categories }: HeadlightsData) {
    const figures = headlightFigures(categories);
    const stats = [
        { v: String(figures.models), l: "Light models" },
        { v: figures.maxIntensity, l: "Peak intensity" },
        { v: figures.lightestWeight, l: "Lightest model" },
        { v: figures.colorTemperature, l: "Colour temperature" },
    ].filter((s): s is { v: string; l: string } => Boolean(s.v));

    return (
        <section aria-labelledby="admetec-lights-heading" className="bg-navy-gradient">
            <div className="section container">
                <ScrollReveal variant="fade">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-[15px] font-medium text-white/70">{linkAdmetec(intro.title, { onDark: true })}</p>
                        <h2 id="admetec-lights-heading" className="mt-2 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-white md:text-5xl">
                            Loupes and lights, as one solution.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{cleanText(intro.description)}</p>
                    </div>
                </ScrollReveal>

                {stats.length > 1 && (
                    <ScrollReveal variant="fade" delay={80}>
                        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-4">
                            {stats.map((stat) => (
                                <li key={stat.l} className="text-center">
                                    <p className="text-3xl font-semibold tracking-[-0.02em] text-white tabular-nums md:text-4xl">{stat.v}</p>
                                    <p className="mt-1.5 text-[13px] text-white/60">{stat.l}</p>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                )}

                <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
                    {categories.map((category, index) => (
                        <li key={category.id}>
                            <ScrollReveal delay={index * 90} className="h-full">
                                <SeriesCard category={category} />
                            </ScrollReveal>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
                    <Link href={HEADLIGHTS_PATH} className={PILL_ON_DARK}>
                        Explore all lights
                    </Link>
                    <Link href="/support/contact" className={PILL_GHOST_ON_DARK}>
                        Request a quote
                    </Link>
                </div>
            </div>
        </section>
    );
}
