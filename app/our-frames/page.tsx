import { Breadcrumbs } from "@/components/ui";
import { getAllFrames } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FrameCard } from "./FrameCard";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata = getMetadata("ourFrames");

export default async function OurFramesPage() {
    const frames = await getAllFrames();

    const breadcrumbs = getBreadcrumbs("ourFrames");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="bg-primary-gradient relative overflow-hidden text-white">
                <div className="section-lg container">
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <h1 className="heading-1 mb-6">What Style Makes Your Heart Sing?</h1>
                        <p className="text-body-lg text-primary-100">
                            Every professional has their own style. Our premium frames are designed to complement your personality while providing the comfort and durability you need for long working
                            hours.
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-10 md:w-1/3">
                    <svg viewBox="0 0 400 400" className="h-full w-full">
                        <circle cx="300" cy="300" r="200" fill="white" />
                    </svg>
                </div>
                <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 opacity-10">
                    <svg viewBox="0 0 400 400" className="h-full w-full">
                        <circle cx="100" cy="100" r="150" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="section container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="heading-2 mb-6">Premium Frames for Every Professional</h2>
                    <p className="text-body text-gray-600">
                        All our Admetec loupes can be customized with your choice of frame style and color. Whether you prefer the classic elegance of Blues, the bold statement of Jazz, or the
                        timeless appeal of Soul, we have the perfect frame waiting for you.
                    </p>
                </div>
            </section>

            {/* Frames Grid */}
            <section className="section-md container mb-10">
                <div className="flex flex-wrap justify-center gap-8">
                    {frames.map((frame) => (
                        <div key={frame.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]">
                            <FrameCard frame={frame} />
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="heading-3 mb-4">Ready to Find Your Perfect Match?</h2>
                        <p className="text-body mb-8 text-gray-600">Browse our loupe collections and customize your perfect pair with your favorite frame style and color.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/product-category/admetec/ergo-loupes">
                                <Button variant="primary" size="lg">
                                    Explore Ergo Loupes
                                </Button>
                            </Link>
                            <Link href="/product-category/admetec/galilean-loupes">
                                <Button variant="outline" size="lg">
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
