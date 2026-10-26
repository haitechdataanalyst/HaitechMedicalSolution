import { Breadcrumbs } from "@/components/ui";
import { getAllFrames } from "@/lib/catalog";
import Link from "next/link";
import { FrameCard } from "@/components/frames/FrameCard";
import BalancedGrid from "@/components/catalog/BalancedGrid";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { ArrowRight } from "lucide-react";
import { PILL_GHOST_ON_DARK, PILL_ON_DARK } from "@/components/ui/surfaces";
import AdmetecBrandBadge from "@/components/brand/AdmetecBrandBadge";
import { SECTION_H2, SECTION_LEAD } from "@/components/catalog/listing";

export const metadata = getMetadata("ourFrames");

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default async function OurFramesPage() {
    const frames = await getAllFrames();
    const breadcrumbs = getBreadcrumbs("ourFrames");
    // Worded from the frame list itself, so adding or retiring a family never leaves a stale count or name behind.
    const count = NUMBER_WORDS[frames.length] ?? String(frames.length);
    const names = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(frames.map((frame) => frame.name));

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero: the frames themselves are the visual, so the grid follows straight away */}
            <section className="bg-white">
                <div className="container pt-6 pb-10 md:pt-10 md:pb-14">
                    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                        <p className="text-primary-700 text-[15px] font-medium md:text-base">Frame styles</p>
                        <h1 className="mt-3 text-[3rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-neutral-900 sm:text-7xl md:text-8xl">Frames built for all-day wear</h1>
                        {/* Admetec requires its logo, linked to admetec.com, on every page about its products */}
                        <div className="mt-2">
                            <AdmetecBrandBadge size="brand" />
                        </div>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-xl">
                            {count} frame families — {names} — in a range of colors and fits, included free with every Admetec loupe.
                        </p>
                    </div>
                </div>

                <div className="container pb-16 md:pb-24">
                    <BalancedGrid layout="half" className="md:gap-5 lg:gap-6">
                        {frames.map((frame, index) => (
                            <ScrollReveal key={frame.id} variant="up" delay={(index % 2) * 90} className="w-full">
                                <FrameCard frame={frame} priority={index < 2} />
                            </ScrollReveal>
                        ))}
                    </BalancedGrid>
                </div>
            </section>

            {/* Intro */}
            <section className="bg-neutral-50">
                <div className="section container">
                    <ScrollReveal variant="fade">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className={SECTION_H2}>Premium Frames for Every Professional</h2>
                            <p className={SECTION_LEAD}>
                                All our Admetec loupes can be customized with your choice of frame style and color. Whether you prefer the classic elegance of Blues, the bold statement of Jazz, or the
                                timeless appeal of Soul — we have the perfect frame waiting for you.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Next step */}
            <section className="bg-white">
                <div className="container pb-16 md:pb-24">
                    <ScrollReveal variant="scale">
                        <div className="bg-navy-gradient rounded-3xl px-6 py-14 text-center md:px-16 md:py-20">
                            <h2 className="mx-auto max-w-2xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-balance text-white md:text-[2.5rem]">
                                Pick a Loupe, Then Pick Your Frame
                            </h2>
                            <p className="text-navy-200 mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg">
                                Frame selection happens during checkout on any Ergo or Galilean loupe — start with the magnification you need.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link href="/product-category/admetec/ergo-loupes" className={`${PILL_ON_DARK} group`}>
                                    Explore Ergo Loupes
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                                <Link href="/product-category/admetec/galilean-loupes" className={PILL_GHOST_ON_DARK}>
                                    Explore Galilean Loupes
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
