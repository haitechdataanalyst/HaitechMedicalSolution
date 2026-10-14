import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";
import SectionHeader from "./SectionHeader";

const brands = [
    {
        name: "Admetec",
        tagline: "Surgical loupes & LED headlights engineered for dental professionals.",
        image: "/BrandLogo/AdmetecLogo.jpeg",
        href: "/product/admetec",
        badge: "Optical",
        productCount: 12,
        credibility: "Israeli-made · ISO certified",
        priceFrom: "₹1,12,000",
    },
    {
        name: "Almadent",
        tagline: "Premium dental chairs & units for the modern clinic.",
        image: "/BrandLogo/AlmadentLogo.jpeg",
        href: "/product/almadent",
        badge: "Dental Chairs",
        productCount: 7,
        credibility: "CE marked · Clinical-grade",
        priceFrom: null,
    },
    {
        name: "Medesy",
        tagline: "Precision stainless steel instruments trusted by surgeons worldwide.",
        image: "/BrandLogo/MedesyLogo.jpeg",
        href: "/product/medesy",
        badge: "Surgical",
        productCount: 21,
        credibility: "Italian-made · Hospital approved",
        priceFrom: null,
    },
    {
        name: "Salli",
        tagline: "Ergonomic saddle chairs designed for the modern clinic.",
        image: "/BrandLogo/SalliLogo.jpeg",
        href: "/product/salli",
        badge: "Ergonomic",
        productCount: 5,
        credibility: "Finnish-engineered · Clinically proven",
        priceFrom: "₹23,999",
    },
    {
        name: "Strauss",
        tagline: "Diamond burs & precision cutting instruments for every procedure.",
        image: "/BrandLogo/StraussLogo.jpeg",
        href: "/product/strauss",
        badge: "Burs",
        productCount: 39,
        credibility: "ISO 9001 · Industry standard",
        priceFrom: null,
    },
    {
        name: "Bondent",
        tagline: "German-registered endodontics, imaging & digital implant systems.",
        image: "/BrandLogo/BondentGroupLogo.jpg",
        href: "/product/bondent",
        badge: "Endo & Imaging",
        productCount: 50,
        credibility: "German-registered · CE certified",
        priceFrom: null,
    },
];

type BrandItem = (typeof brands)[number];

function BrandCard({ brand }: { brand: BrandItem }) {
    return (
        <Link href={brand.href} className={`${INTERACTIVE_CARD} h-full p-2`}>
            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 33vw, 400px"
                    className="object-contain p-6 mix-blend-multiply transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]"
                />
            </div>

            <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
                <p className="text-primary-700 text-[13px] font-medium">{brand.badge}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.015em] text-neutral-900">{brand.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-500">{brand.tagline}</p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[13px]">
                    <span className="text-neutral-500 tabular-nums">
                        {brand.productCount} products
                        {brand.priceFrom && (
                            <>
                                {" · from "}
                                <span className="font-medium text-neutral-800">{brand.priceFrom}</span>
                            </>
                        )}
                    </span>
                    <ArrowRight className="text-primary-700 h-4 w-4 shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
            </div>
        </Link>
    );
}

export default function BrandsSection() {
    return (
        <section className="bg-white">
            <div className="section container">
                <ScrollReveal variant="fade">
                    <SectionHeader title="Shop by Brand" subtitle="Six specialist manufacturers, one supplier." link={{ href: "/products", label: "View all" }} />
                </ScrollReveal>

                {/* Mobile: a snapping shelf that bleeds to the screen edge */}
                <ul className="scrollbar-hide -mx-(--container-padding) flex snap-x snap-mandatory scroll-px-(--container-padding) gap-4 overflow-x-auto px-(--container-padding) pb-4 md:hidden">
                    {brands.map((brand) => (
                        <li key={brand.name} className="w-[78%] max-w-[300px] flex-none snap-start">
                            <BrandCard brand={brand} />
                        </li>
                    ))}
                </ul>

                {/* md+: calm 3 × 2 grid */}
                <ul className="hidden gap-5 md:grid md:grid-cols-3 lg:gap-6">
                    {brands.map((brand) => (
                        <li key={brand.name}>
                            <BrandCard brand={brand} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
