import { Breadcrumbs } from "@/components/ui";
import { getAllFrames } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FrameCard } from "./FrameCard";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { ArrowRight } from "lucide-react";

export const metadata = getMetadata("ourFrames");

export default async function OurFramesPage() {
    const frames = await getAllFrames();
    const breadcrumbs = getBreadcrumbs("ourFrames");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero */}
            <section className="bg-brand-gradient relative overflow-hidden text-white">
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-primary-400/8 blur-2xl" />
                <div className="section-lg container relative">
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <span className="label-tag label-tag-white mb-5 inline-flex">Frame Styles</span>
                        <h1 className="heading-1 mb-5">What Style Makes Your Heart Sing?</h1>
                        <p className="text-body-lg text-white/80">
                            Every professional has their own style. Our premium frames complement your personality while delivering all-day comfort and durability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">Admetec Frames</span>
                        <h2 className="heading-2 mb-5 text-neutral-900">Premium Frames for Every Professional</h2>
                        <p className="text-body-lg text-neutral-500 leading-relaxed">
                            All our Admetec loupes can be customized with your choice of frame style and color. Whether you prefer the classic elegance of Blues, the bold statement of Jazz, or the timeless appeal of Soul — we have the perfect frame waiting for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Frames Grid */}
            <section className="section bg-neutral-50/60">
                <div className="container">
                    <div className="flex flex-wrap justify-center gap-8">
                        {frames.map((frame) => (
                            <div key={frame.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]">
                                <FrameCard frame={frame} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section border-t border-neutral-100 bg-white">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">Choose Your Loupes</span>
                        <h2 className="heading-3 mb-4 text-neutral-900">Ready to Find Your Perfect Match?</h2>
                        <p className="mb-8 text-sm leading-relaxed text-neutral-500">
                            Browse our loupe collections and customize your perfect pair with your favourite frame style and color.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/product-category/admetec/ergo-loupes">
                                <Button variant="primary" size="lg" className="group gap-2.5 rounded-full px-8">
                                    Explore Ergo Loupes
                                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                            <Link href="/product-category/admetec/galilean-loupes">
                                <Button variant="outline" size="lg" className="rounded-full px-8">
                                    Explore Galilean Loupes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
