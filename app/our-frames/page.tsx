import { Breadcrumbs } from "@/components/ui";
import { getAllFrames } from "@/lib/catalog";
import Link from "next/link";
import { FrameCard } from "@/components/frames/FrameCard";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { ArrowRight } from "lucide-react";
import { PILL_PRIMARY } from "@/components/ui/surfaces";
import { SECTION_H2, SECTION_LEAD } from "@/components/catalog/listing";

export const metadata = getMetadata("ourFrames");

export default async function OurFramesPage() {
    const frames = await getAllFrames();
    const breadcrumbs = getBreadcrumbs("ourFrames");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero */}
            <section className="bg-brand-gradient text-white">
                <div className="section container">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="label-tag label-tag-white mb-5 inline-flex">Frame Styles</span>
                        <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance md:text-5xl">Frames Built for All-Day Wear</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                            Four frame families — Blues, Indie, Jazz and Soul — in a range of colors and fits, included free with every Admetec loupe.
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro + Frames Grid */}
            <section className="section bg-neutral-50/60">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
                        <h2 className={SECTION_H2}>Premium Frames for Every Professional</h2>
                        <p className={SECTION_LEAD}>
                            All our Admetec loupes can be customized with your choice of frame style and color. Whether you prefer the classic elegance of Blues, the bold statement of Jazz, or the timeless appeal of Soul — we have the perfect frame waiting for you.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-5 md:gap-6">
                        {frames.map((frame) => (
                            <div key={frame.id} className="w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                <FrameCard frame={frame} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">Choose Your Loupes</span>
                        <h2 className={SECTION_H2}>Pick a Loupe, Then Pick Your Frame</h2>
                        <p className={SECTION_LEAD}>
                            Frame selection happens during checkout on any Ergo or Galilean loupe — start with the magnification you need.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link href="/product-category/admetec/ergo-loupes" className={`${PILL_PRIMARY} group`}>
                                Explore Ergo Loupes
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                            </Link>
                            <Link href="/product-category/admetec/galilean-loupes" className="btn btn-lg btn-outline">
                                Explore Galilean Loupes
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
