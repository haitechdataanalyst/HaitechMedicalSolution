import Link from "next/link";
import { getRandomProductsForEachCategory, getProductPath } from "@/lib/catalog";
import { Button } from "@/components/ui";
import { Hero, SupportBanner, Testimonials, TrendingProducts, WhySection } from "@/components/misc";
import { testimonials } from "@/data/testimonials.json";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const brands = [
    {
        num: "01",
        name: "Admetec",
        headline: ["See Every Detail", "With Precision"],
        tagline: "World-leading manufacturer of dental loupes, surgical magnification systems, and LED headlights — empowering professionals with unmatched clarity.",
        credential: "ISO Certified · Israeli-made",
        href: "/product/admetec",
        logo: "/BrandLogo/AdmetecLogo.png",
        image: "/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg",
        bg: "bg-[#001926]",
        dark: true,
        accent: "text-[#1fb6cd]",
    },
    {
        num: "02",
        name: "Almadent",
        headline: ["Complete Dental", "Equipment"],
        tagline: "Dental chairs, handpieces, implant motors, and auxiliary equipment — every product engineered for performance, ergonomics, and day-to-day convenience.",
        credential: "CE Marked · Clinical-grade",
        href: "/product/almadent",
        logo: "/BrandLogo/AlmadentLogo.jpg",
        image: "/images/products/almadent/chairs/ay-3000-1.jpg",
        bg: "bg-neutral-50",
        dark: false,
        accent: "text-primary-600",
    },
    {
        num: "03",
        name: "Medesy",
        headline: ["600 Years of", "Italian Craft"],
        tagline: "Precision stainless steel instruments from Maniago — where six centuries of blade-making heritage meets modern dental innovation.",
        credential: "Made in Italy · Hospital Approved",
        href: "/product/medesy",
        logo: "/BrandLogo/MedesyLogo.jpg",
        image: "/images/products/medesy/forceps/forceps-category.jpg",
        bg: "bg-neutral-950",
        dark: true,
        accent: "text-emerald-400",
    },
    {
        num: "04",
        name: "Salli",
        headline: ["Sit Better.", "Work Longer."],
        tagline: "Finnish-engineered saddle chairs that restore healthy posture and protect you through decades of clinical practice — because your body matters.",
        credential: "Finnish-engineered · Clinically Proven",
        href: "/product/salli",
        logo: "/BrandLogo/SalliLogo.png",
        image: "/images/products/salli/salli-swayfit-main.jpg",
        bg: "bg-white",
        dark: false,
        accent: "text-amber-500",
    },
    {
        num: "05",
        name: "Strauss",
        headline: ["Diamond-Sharp", "Precision"],
        tagline: "ISO 9001 certified rotary instruments delivering efficient cutting, minimal heat, and consistent clinical results for the modern dental practice.",
        credential: "ISO 9001 · Industry Standard",
        href: "/product/strauss",
        logo: "/BrandLogo/StraussLogo.jpg",
        image: "/images/products/strauss/a-series/A2M.jpg",
        bg: "bg-neutral-900",
        dark: true,
        accent: "text-violet-400",
    },
];

export default function Home() {
    const products = getRandomProductsForEachCategory(8);
    const featuredProducts = products.map((p) => ({ ...p, path: getProductPath(p) }));

    return (
        <>
            {/* ── Hero ── */}
            <Hero />

            {/* ── Mission Pull Quote ── */}
            <section className="bg-neutral-950 py-14 md:py-24">
                <div className="container">
                    <p className="mx-auto max-w-4xl text-center text-xl font-light italic leading-relaxed text-white/60 md:text-2xl lg:text-4xl">
                        &ldquo;We connect dental professionals with the world&rsquo;s finest equipment — so you can focus on what matters most.&rdquo;
                    </p>
                    <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-5 md:mt-16 md:grid-cols-4 md:gap-8">
                        {[
                            { v: "5",     l: "Global Brands"       },
                            { v: "13+",   l: "Years of Excellence"  },
                            { v: "1000+", l: "Clinics Served"       },
                            { v: "30+",   l: "Industry Partners"    },
                        ].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-3xl font-black text-white md:text-4xl">{s.v}</p>
                                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/30">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brand Showcase ── */}
            <section className="bg-neutral-950 py-6 md:py-10">
                <div className="container text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/20">Our Brands</span>
                    <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Five World-Class Brands</h2>
                </div>
            </section>

            {brands.map((brand, i) => (
                <section key={brand.name} className={`${brand.bg} py-12 md:py-20`}>
                    <div className="container">
                        <div className={`flex flex-col items-center gap-8 lg:gap-16 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>

                            {/* Text */}
                            <div className="w-full lg:w-1/2">
                                <span className={`mb-3 block text-xs font-bold uppercase tracking-widest ${brand.dark ? "text-white/30" : "text-neutral-400"}`}>
                                    {brand.num} / {brand.name}
                                </span>
                                <h2 className={`mb-4 text-3xl font-black leading-tight md:text-4xl lg:text-5xl ${brand.dark ? "text-white" : "text-neutral-900"}`}>
                                    {brand.headline[0]}<br />
                                    <span className={brand.accent}>{brand.headline[1]}</span>
                                </h2>
                                <p className={`mb-5 text-base leading-relaxed md:text-lg ${brand.dark ? "text-white/55" : "text-neutral-500"}`}>
                                    {brand.tagline}
                                </p>
                                <p className={`mb-6 text-[11px] font-semibold uppercase tracking-widest ${brand.dark ? "text-white/25" : "text-neutral-400"}`}>
                                    {brand.credential}
                                </p>
                                <Link
                                    href={brand.href}
                                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                                        brand.dark
                                            ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                                            : "bg-primary-500 text-white hover:bg-primary-600 shadow-md"
                                    }`}
                                >
                                    Explore {brand.name}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Image */}
                            <div className="w-full lg:w-1/2">
                                <div className={`overflow-hidden rounded-3xl shadow-2xl ${brand.dark ? "bg-white/5" : "bg-neutral-100"}`}>
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={brand.image}
                                            alt={brand.name}
                                            fill
                                            className="object-contain p-6 transition-transform duration-700 hover:scale-105 md:p-10"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                    <div className={`flex items-center gap-3 border-t px-5 py-3.5 ${brand.dark ? "border-white/10" : "border-neutral-200/60"}`}>
                                        <div className="relative h-7 w-20 shrink-0">
                                            <Image src={brand.logo} alt={`${brand.name} logo`} fill className="object-contain object-left" sizes="80px" />
                                        </div>
                                        <span className={`text-[11px] font-medium ${brand.dark ? "text-white/30" : "text-neutral-400"}`}>{brand.credential}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            ))}

            {/* ── Track Record / Stats ── */}
            <WhySection />

            {/* ── Featured Products ── */}
            <TrendingProducts products={featuredProducts} />

            {/* ── Testimonials ── */}
            <Testimonials testimonials={testimonials} />

            {/* ── Final CTA ── */}
            <section className="relative overflow-hidden bg-brand-gradient py-16 md:py-24">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary-400/10 blur-2xl" />
                <div className="container relative text-center">
                    <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                        Get Started Today
                    </span>
                    <h2 className="mx-auto mb-5 max-w-3xl text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                        Ready to Upgrade Your Practice?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                        Get personalised recommendations and competitive quotes from our specialist team — tailored to your clinic.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/products">
                            <Button size="lg" className="group w-full gap-3 rounded-full bg-white px-8 font-semibold text-primary-700 shadow-lg hover:bg-primary-50 sm:w-auto">
                                Browse Products
                                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button size="lg" variant="outline" className="w-full gap-3 rounded-full border-white/30 px-8 font-semibold text-white hover:border-white hover:bg-white/10 sm:w-auto">
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
