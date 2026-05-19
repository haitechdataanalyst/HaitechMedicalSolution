"use client";

import Link from "next/link";
import { Carousel } from "@/components/ui";

const heroSlides = [
    {
        video: "/vids/Website Carousal.mp4",
        href: "/product/admetec",
        badge: "Optical Excellence",
        headline: ["See Every Detail", "With Precision"],
        subtitle: "Surgical loupes and headlights engineered for dental professionals.",
        cta: "Explore Admetec",
    },
    {
        video: "/vids/Website Carousal (1).mp4",
        href: "/product/medesy",
        badge: "Surgical Instruments",
        headline: ["Crafted for", "Clinical Mastery"],
        subtitle: "Premium stainless steel instruments trusted by surgeons worldwide.",
        cta: "Discover Medesy",
    },
    {
        video: "/vids/Website Carousal (2).mp4",
        href: "/product/salli",
        badge: "Ergonomic Innovation",
        headline: ["Work Smarter,", "Live Better"],
        subtitle: "Salli ergonomic saddle chairs designed for the modern clinic.",
        cta: "Experience Salli",
    },
];

export default function Hero() {
    return (
        <section>
            <Carousel
                autoPlay
                autoPlayInterval={8000}
                showArrows={true}
                showDots
                loop
                slidesToShow={1}
                gap={0}
                arrowVariant="ghost"
                arrowSize="lg"
                noPadding
                dotsPosition="inside"
                className="hero-carousel"
            >
                {heroSlides.map((slide, index) => (
                    <div key={index} className="relative h-64 overflow-hidden md:h-96 lg:h-[680px] xl:min-h-screen">
                        {/* Video */}
                        <video
                            src={slide.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                            preload={index === 0 ? "auto" : "metadata"}
                        />

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Slide content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="container">
                                <div className="max-w-xl lg:max-w-2xl">
                                    {/* Badge */}
                                    <div className="mb-4 hidden items-center gap-2 md:inline-flex">
                                        <span className="label-tag label-tag-white tracking-widest">
                                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
                                            {slide.badge}
                                        </span>
                                    </div>

                                    {/* Headline */}
                                    <h1 className="mb-4 hidden font-bold leading-none tracking-tight text-white md:block"
                                        style={{ fontSize: "clamp(2.5rem, 4.5vw, 4.25rem)", letterSpacing: "-0.03em" }}>
                                        {slide.headline[0]}
                                        <br />
                                        <span className="text-primary-400">{slide.headline[1]}</span>
                                    </h1>

                                    {/* Mobile headline */}
                                    <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-white md:hidden">
                                        {slide.headline[0]}{" "}
                                        <span className="text-primary-400">{slide.headline[1]}</span>
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="mb-8 hidden max-w-md text-base leading-relaxed text-neutral-200 md:block lg:text-lg">
                                        {slide.subtitle}
                                    </p>

                                    {/* CTA */}
                                    <Link
                                        href={slide.href}
                                        className="inline-flex items-center gap-2.5 rounded-full bg-primary-500 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-primary-500/30 md:px-8 md:py-4 md:text-base"
                                        style={{ boxShadow: "0 8px 24px -4px rgb(31 182 205 / 0.45)" }}
                                    >
                                        {slide.cta}
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
