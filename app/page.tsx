import Link from "next/link";
import { getRandomProductsForEachCategory, getProductPath } from "@/lib/catalog";
import { Button, ScrollReveal } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection, BrandsSection } from "@/components/misc";
import { testimonials } from "@/data/testimonials.json";
import Image from "next/image";
import { ClockIcon, Headset, ArrowRight, ShieldCheck } from "lucide-react";

export default async function Home() {
    const products = await getRandomProductsForEachCategory(8);
    const featuredProducts = await Promise.all(
        products.map(async (p) => ({ ...p, path: await getProductPath(p) }))
    );

    return (
        <>
            {/* Hero Section */}
            <Hero />

            {/* Features Strip — compact Flipkart-style service badges */}
            <section className="border-b border-neutral-100 bg-white">
                <div className="container">
                    <div className="grid grid-cols-2 gap-px bg-neutral-100 md:grid-cols-4">
                        <ScrollReveal variant="up" delay={0}>
                            <div className="group flex items-center gap-3 bg-white px-4 py-4 transition-colors hover:bg-neutral-50 md:px-6 md:py-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-200 group-hover:bg-primary-500">
                                    <Image src="/svg/premium-badge.svg" alt="Premium Quality" width={20} height={20} className="transition-[filter] duration-200 group-hover:brightness-0 group-hover:invert" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Premium Quality</p>
                                    <p className="text-[11px] text-neutral-400">ISO certified products</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={80}>
                            <div className="group flex items-center gap-3 bg-white px-4 py-4 transition-colors hover:bg-neutral-50 md:px-6 md:py-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-200 group-hover:bg-primary-500">
                                    <ClockIcon className="h-5 w-5 text-primary-600 transition-colors duration-200 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">24-Hour Response</p>
                                    <p className="text-[11px] text-neutral-400">Order confirmed same day</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={160}>
                            <div className="group flex items-center gap-3 bg-white px-4 py-4 transition-colors hover:bg-neutral-50 md:px-6 md:py-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-200 group-hover:bg-primary-500">
                                    <Headset className="h-5 w-5 text-primary-600 transition-colors duration-200 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Expert Support</p>
                                    <p className="text-[11px] text-neutral-400">Specialist team on hand</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal variant="up" delay={240}>
                            <div className="group flex items-center gap-3 bg-white px-4 py-4 transition-colors hover:bg-neutral-50 md:px-6 md:py-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-200 group-hover:bg-primary-500">
                                    <ShieldCheck className="h-5 w-5 text-primary-600 transition-colors duration-200 group-hover:text-white" />
                                </div>
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

            {/* Testimonials Section */}
            <Testimonials testimonials={testimonials} />

            {/* Featured Products Section */}
            <TrendingProducts products={featuredProducts} />

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-brand-gradient">
                <div className="section-lg container relative text-center">
                    <ScrollReveal variant="scale" duration={700}>
                        <span className="label-tag label-tag-white mb-6 inline-flex">
                            Get Started Today
                        </span>
                        <h2 className="heading-1 mb-5 text-white">Ready to Upgrade Your Practice?</h2>
                        <p className="text-body-lg mx-auto mb-10 max-w-xl text-primary-100/90">
                            Get personalised recommendations and competitive quotes from our specialist team — tailored to your clinic.
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
