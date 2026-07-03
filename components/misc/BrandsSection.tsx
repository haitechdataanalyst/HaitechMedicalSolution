"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CSSProperties } from "react";

type FilterCategory = "All" | "Optical" | "Dental Chairs" | "Surgical" | "Ergonomic" | "Burs";

const brands = [
    {
        name: "Admetec",
        tagline: "Surgical loupes & LED headlights engineered for dental professionals.",
        image: "/BrandLogo/AdmetecLogo.jpeg",
        href: "/product/admetec",
        accentColor: "bg-teal-500",
        badge: "Optical",
        filter: "Optical" as FilterCategory,
        productCount: 12,
        credibility: "Israeli-made · ISO certified",
        priceFrom: "₹1,12,000",
    },
    {
        name: "Almadent",
        tagline: "Premium dental chairs & units for the modern clinic.",
        image: "/BrandLogo/AlmadentLogo.jpeg",
        href: "/product/almadent",
        accentColor: "bg-blue-500",
        badge: "Dental Chairs",
        filter: "Dental Chairs" as FilterCategory,
        productCount: 7,
        credibility: "CE marked · Clinical-grade",
        priceFrom: null,
    },
    {
        name: "Medesy",
        tagline: "Precision stainless steel instruments trusted by surgeons worldwide.",
        image: "/BrandLogo/MedesyLogo.jpeg",
        href: "/product/medesy",
        accentColor: "bg-emerald-500",
        badge: "Surgical",
        filter: "Surgical" as FilterCategory,
        productCount: 21,
        credibility: "Italian-made · Hospital approved",
        priceFrom: null,
    },
    {
        name: "Salli",
        tagline: "Ergonomic saddle chairs designed for the modern clinic.",
        image: "/BrandLogo/SalliLogo.jpeg",
        href: "/product/salli",
        accentColor: "bg-amber-500",
        badge: "Ergonomic",
        filter: "Ergonomic" as FilterCategory,
        productCount: 4,
        credibility: "Finnish-engineered · Clinically proven",
        priceFrom: "₹23,999",
    },
    {
        name: "Strauss",
        tagline: "Diamond burs & precision cutting instruments for every procedure.",
        image: "/BrandLogo/StraussLogo.jpeg",
        href: "/product/strauss",
        accentColor: "bg-violet-500",
        badge: "Burs",
        filter: "Burs" as FilterCategory,
        productCount: 39,
        credibility: "ISO 9001 · Industry standard",
        priceFrom: null,
    },
];

const FILTER_TABS: FilterCategory[] = ["All", "Optical", "Dental Chairs", "Surgical", "Ergonomic", "Burs"];

type BrandItem = typeof brands[number];

function BrandCard({ brand }: { brand: BrandItem }) {
    return (
        <Link
            href={brand.href}
            className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-all duration-200 hover:border-neutral-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.11)]"
        >
            {/* Top accent bar */}
            <div className={cn("h-0.5 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100", brand.accentColor)} />

            {/* Image */}
            <div className="relative h-36 w-full overflow-hidden bg-white sm:h-40">
                <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 180px, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col border-t border-neutral-100 px-3.5 py-3.5">
                <span className="mb-2 w-fit rounded-full border border-primary-100 bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-700">
                    {brand.badge}
                </span>

                <h3 className="mb-1 text-sm font-bold text-neutral-900 transition-colors group-hover:text-primary-700">
                    {brand.name}
                </h3>
                <p className="mb-2.5 flex-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500">
                    {brand.tagline}
                </p>

                <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-neutral-400">{brand.productCount} products</span>
                    {brand.priceFrom && (
                        <span className="text-[11px] font-semibold text-neutral-700">from {brand.priceFrom}</span>
                    )}
                </div>

                <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-primary-600 transition-all duration-150 group-hover:gap-1.5">
                    Explore
                    <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
            </div>
        </Link>
    );
}

export default function BrandsSection() {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

    const filteredBrands = activeFilter === "All" ? brands : brands.filter((b) => b.filter === activeFilter);

    const gridClass = cn(
        "gap-3 md:gap-4",
        filteredBrands.length >= 4
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            : filteredBrands.length === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : filteredBrands.length === 2
            ? "grid-cols-2 max-w-lg mx-auto"
            : "grid-cols-1 max-w-xs mx-auto"
    );

    return (
        <section className="bg-white py-10 md:py-14">
            <div className="container">

                {/* Section header */}
                <ScrollReveal variant="up">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-600">Trusted Manufacturers</p>
                            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">Shop by Brand</h2>
                        </div>
                        <Link href="/products" className="group flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
                            View all
                            <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Filter pills */}
                <ScrollReveal variant="fade" delay={100}>
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150",
                                    activeFilter === tab
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary-200 hover:text-primary-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Mobile: horizontal scroll */}
                <div
                    className="flex gap-3 overflow-x-auto pb-3 md:hidden [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" } as CSSProperties}
                >
                    {filteredBrands.map((brand) => (
                        <div key={`mob-${brand.name}`} className="w-[180px] flex-none">
                            <BrandCard brand={brand} />
                        </div>
                    ))}
                </div>

                {/* md+: grid */}
                <div className={cn("hidden md:grid", gridClass)}>
                    {filteredBrands.map((brand, i) => (
                        <ScrollReveal key={brand.name} variant="up" delay={i * 75} threshold={0.05}>
                            <BrandCard brand={brand} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
