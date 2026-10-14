import Link from "next/link";
import { getFeaturedProducts, getProductPath } from "@/lib/catalog";
import { getGooglePlaceReviews } from "@/lib/google-reviews";
import { ScrollReveal } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection, BrandsSection } from "@/components/misc";
import { PILL_GHOST_ON_DARK, PILL_ON_DARK } from "@/components/ui/surfaces";
import CustomerStories from "@/components/stories/CustomerStories";
import { Award, ClockIcon, Headset, ArrowRight, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/ui";
import { getDynamicMetadata } from "@/lib/metadata";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

export const metadata = {
    ...getDynamicMetadata(
        "Haitech Medical | Dental Equipment Supplier in India",
        "Dental loupes, dental chairs, saddle chairs, endodontics, CBCT, burs and surgical instruments from Admetec, Almadent, Salli, Bondent, Strauss and Medesy.",
        { path: "/" }
    ),
    // Absolute so the root "%s | Haitech Medical" template does not repeat the brand.
    title: { absolute: "Haitech Medical | Dental Equipment Supplier in India" },
};

const SERVICE_PROMISES = [
    { icon: Award, title: "Premium Quality", detail: "ISO certified products" },
    { icon: ClockIcon, title: "24-Hour Response", detail: "Order confirmed same day" },
    { icon: Headset, title: "Expert Support", detail: "Specialist team on hand" },
    { icon: ShieldCheck, title: "Certified Products", detail: "International standards" },
];

export default async function Home() {
    // Fixed editorial pick list — see data/trending.json.
    const products = await getFeaturedProducts();
    const featuredProducts = await Promise.all(products.map(async (p) => ({ ...p, path: await getProductPath(p) })));

    // Live Google reviews only — see lib/google-reviews.ts. Returns an empty
    // array (never throws) if unconfigured or the API call fails, so the
    // section below just doesn't render rather than showing stale/fake data.
    const { reviews: googleReviews, rating: googleRating, totalReviews: googleReviewCount } = await getGooglePlaceReviews();

    return (
        <>
            <JsonLd data={organizationSchema()} />
            <JsonLd data={websiteSchema()} />

            {/* Visually-hidden H1 for SEO — the hero uses a video carousel with no visible heading */}
            <h1 className="sr-only">Premium Dental &amp; Medical Equipment — Haitech Medical Solutions</h1>

            {/* Hero Section */}
            <Hero />

            {/* Service promises — rendered immediately, no reveal: it sits right under the hero */}
            <section aria-label="Our service promises" className="border-b border-neutral-900/[0.06] bg-white">
                <div className="container">
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 md:grid-cols-4 md:py-10">
                        {SERVICE_PROMISES.map(({ icon: Icon, title, detail }) => (
                            <li key={title} className="flex items-start gap-3">
                                <span className="bg-primary-50 text-primary-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-[15px] leading-snug font-semibold text-neutral-900">{title}</p>
                                    <p className="mt-0.5 text-[13px] leading-snug text-neutral-500">{detail}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Browsing is the primary task, so brands and products come before proof */}
            <BrandsSection />

            <TrendingProducts products={featuredProducts} />

            <WhySection />

            {/* Renders nothing until real, approved clinician stories exist — see lib/customer-stories.ts */}
            <CustomerStories />

            {/* Testimonials Section — hidden entirely if Google Places isn't configured or returns nothing */}
            {googleReviews.length > 0 && <Testimonials testimonials={googleReviews} googleRating={googleRating} googleReviewCount={googleReviewCount} />}

            {/* CTA Section */}
            <section className="bg-brand-gradient">
                <div className="section-lg container text-center">
                    <ScrollReveal variant="fade">
                        <h2 className="mx-auto max-w-2xl text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-white md:text-5xl">One Quote, Six Brands</h2>
                        <p className="text-primary-100/90 mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg">
                            Tell us what your clinic needs — loupes, chairs, instruments, or seating — and our team puts together a single quote across the full catalog.
                        </p>
                        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                            <Link href="/products" className={`group ${PILL_ON_DARK}`}>
                                Browse Products
                                <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" />
                            </Link>
                            <Link href="/support/contact" className={PILL_GHOST_ON_DARK}>
                                Request a Quote
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <SupportBanner />
        </>
    );
}
