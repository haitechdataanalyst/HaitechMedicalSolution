import Link from "next/link";
import { getAllProducts, getProductPath } from "@/lib/catalog";
import { Button } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection } from "@/components/misc";
import testimonialsData from "@/data/testimonials.json";
import Image from "next/image";
import { ClockIcon, Headset } from "lucide-react";

export default function Home() {
    const products = getAllProducts().slice(0, 8);
    // Add paths to products for client-side linking
    const featuredProducts = products.map((p) => ({ ...p, path: getProductPath(p) }));
    const testimonials = testimonialsData.testimonials;

    return (
        <>
            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <section className="section bg-surface-secondary">
                <div className="container p-0!">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                        <div className="p-6 text-center">
                            <div className="icon-container icon-container-3xl icon-container-primary icon-container-circle mx-auto mb-4">
                                <Image src="/svg/premium-badge.svg" alt="Premium Quality" width={"60"} height={"60"} />
                            </div>
                            <h3 className="heading-4 text-foreground mb-2">Premium Quality</h3>
                            <p className="text-muted">Only the finest optical components and materials in all our products.</p>
                        </div>
                        <div className="p-6 text-center">
                            <div className="icon-container icon-container-3xl icon-container-primary icon-container-circle mx-auto mb-4">
                                <ClockIcon className="h-16 w-16" />
                            </div>
                            <h3 className="heading-4 text-foreground mb-2">Fast Response</h3>
                            <p className="text-muted">Quote requests answered within 24 hours. Quick Australia-wide shipping.</p>
                        </div>
                        <div className="p-6 text-center sm:col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="icon-container icon-container-3xl icon-container-primary icon-container-circle mx-auto mb-4">
                                <Headset className="h-16 w-16" />
                            </div>
                            <h3 className="heading-4 text-foreground mb-2">Expert Support</h3>
                            <p className="text-muted">Dedicated support team to help you find the perfect equipment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Section */}
            <WhySection />

            {/* Testimonials Section */}
            <Testimonials testimonials={testimonials} />
            <br />
            {/* Featured Products Section */}
            <TrendingProducts products={featuredProducts} />

            {/* CTA Section */}
            <section className="section-lg bg-primary-600 text-white">
                <div className="container text-center">
                    <h2 className="heading-2 mb-4">Ready to Upgrade Your Practice?</h2>
                    <p className="text-body-lg text-primary-100 mx-auto mb-8 max-w-2xl">Get in touch with our team for personalized recommendations and competitive quotes on all our products.</p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button size="lg" className="text-primary-600 w-full bg-white hover:bg-neutral-100 sm:w-auto">
                                Browse Products
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button size="lg" variant="primary" className="flex w-full items-center justify-center gap-4 sm:w-auto">
                                Request a Quote
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <SupportBanner />
        </>
    );
}
