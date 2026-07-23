import Link from "next/link";
import { getRandomProductsForEachCategory, getProductPath } from "@/lib/catalog";
import { getGooglePlaceReviews } from "@/lib/google-reviews";
import { Button, ScrollReveal } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection, BrandsSection } from "@/components/misc";
import Image from "next/image";
import { ClockIcon, Headset, ArrowRight, ShieldCheck } from "lucide-react";

export default async function Home() {
    const products = await getRandomProductsForEachCategory(8);
    const featuredProducts = await Promise.all(
        products.map(async (p) => ({ ...p, path: await getProductPath(p) }))
    );

    // Live Google reviews only — see lib/google-reviews.ts. Returns an empty
    // array (never throws) if unconfigured or the API call fails, so the
    // section below just doesn't render rather than showing stale/fake data.
    const { reviews: googleReviews, rating: googleRating, totalReviews: googleReviewCount } = await getGooglePlaceReviews();

    return (
        <>
            {/* Visually-hidden H1 for SEO — the hero uses a video carousel with no visible heading */}
            <h1 className="sr-only">Premium Dental &amp; Medical Equipment — Haitech Medical Solutions</h1>

            {/* Hero Section */}
            <Hero />

            {/* Features Strip — compact Flipkart-style service badges */}
            <section className="border-b border-neutral-100 bg-white">
                <div className="container">
                    <div className="grid grid-cols-2 gap-px bg-neutral-100 md:grid-cols-4">
                        <ScrollReveal variant="up" delay={0}>
                            <div className="flex items-center gap-3 bg-white px-4 py-4 md:px-6 md:py-5">
                                <Image src="/svg/premium-badge.svg" alt="" width={20} height={20} className="shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Premium Quality</p>
                                    <p className="text-[11px] text-neutral-400">ISO certified products</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={80}>
                            <div className="flex items-center gap-3 bg-white px-4 py-4 md:px-6 md:py-5">
                                <ClockIcon className="h-5 w-5 shrink-0 text-primary-600" />
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">24-Hour Response</p>
                                    <p className="text-[11px] text-neutral-400">Order confirmed same day</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={160}>
                            <div className="flex items-center gap-3 bg-white px-4 py-4 md:px-6 md:py-5">
                                <Headset className="h-5 w-5 shrink-0 text-primary-600" />
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Expert Support</p>
                                    <p className="text-[11px] text-neutral-400">Specialist team on hand</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={240}>
                            <div className="flex items-center gap-3 bg-white px-4 py-4 md:px-6 md:py-5">
                                <ShieldCheck className="h-5 w-5 shrink-0 text-primary-600" />
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Certified Products</p>
                                    <p className="text-[11px] text-neutral-400">International standards</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <BrandsSection />

            {/* Why Section */}
            <WhySection />

            {/* Testimonials Section — hidden entirely if Google Places isn't configured or returns nothing */}
            {googleReviews.length > 0 && (
                <Testimonials testimonials={googleReviews} googleRating={googleRating} googleReviewCount={googleReviewCount} />
            )}

            {/* Featured Products Section */}
            <TrendingProducts products={featuredProducts} />

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-brand-gradient">
                <div className="section-lg container relative text-center">
                    <ScrollReveal variant="scale" duration={700}>
                        <h2 className="heading-1 mb-5 text-white">One Quote, Five Brands</h2>
                        <p className="text-body-lg mx-auto mb-10 max-w-xl text-primary-100/90">
                            Tell us what your clinic needs — loupes, chairs, instruments, or seating — and our team puts together a single quote across the full catalog.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="group gap-3 rounded-full bg-white px-8 font-semibold text-primary-700 shadow-lg hover:bg-primary-50 hover:shadow-xl w-full sm:w-auto"
                                >
                                    Browse Products
                                    <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/support/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-3 rounded-full border-white/30 px-8 font-semibold text-white hover:border-white hover:bg-white/10 w-full sm:w-auto"
                                >
                                    Request a Quote
                                </Button>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <SupportBanner />
        </>
    );
}
