import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Button } from "@/components/ui";
import { Gem, Factory, Wrench, Microscope, Globe, Flame } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Medesy | Italian Dental Instruments & Equipment",
    description:
        "MEDESY — Italian dental instruments rooted in 600+ years of blade-making heritage from Maniago. Precision, craftsmanship, and innovation in every instrument.",
};

const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Medesy", path: "/about/medesy" },
];

const heritage = [
    {
        icon: <Flame className="h-6 w-6" />,
        title: "600+ Years of Heritage",
        description: "Rooted in Maniago, Italy — a town internationally recognized for six centuries as a center of excellence in blade production.",
    },
    {
        icon: <Factory className="h-6 w-6" />,
        title: "Family Legacy",
        description: "A brand built on generations of passion, precision, and craftsmanship — carrying forward a proud artisan tradition.",
    },
    {
        icon: <Gem className="h-6 w-6" />,
        title: "Artisan Expertise",
        description: "Blending centuries-old hand-crafting techniques with modern innovation to achieve unmatched quality.",
    },
    {
        icon: <Microscope className="h-6 w-6" />,
        title: "Advanced Design",
        description: "Continuous innovation in ergonomics, materials, and functionality for superior instrument performance.",
    },
    {
        icon: <Wrench className="h-6 w-6" />,
        title: "Reliable Functionality",
        description: "Every instrument engineered for consistent, dependable results in demanding clinical environments.",
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Trusted Worldwide",
        description: "A comprehensive range of dental solutions trusted by professionals globally for durability and precision.",
    },
];

const instrumentCategories = [
    {
        name: "Elevators",
        image: "/images/products/medesy/elevators/elevators-category.jpg",
        count: "20+ instruments",
    },
    {
        name: "Forceps",
        image: "/images/products/medesy/forceps/forceps-category.jpg",
        count: "30+ instruments",
    },
    {
        name: "Periosteal Elevators",
        image: "/images/products/medesy/periosteal/periosteal-category.jpg",
        count: "15+ instruments",
    },
    {
        name: "Scissors",
        image: "/images/products/medesy/scissors/scissors-category.jpg",
        count: "10+ instruments",
    },
];

export default function AboutMedesyPage() {
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="relative min-h-[480px] overflow-hidden bg-neutral-900">
                <Image
                    src="/images/products/medesy/medesy-banner.jpg"
                    alt="Medesy dental instruments"
                    fill
                    className="object-cover opacity-35"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/40 to-neutral-900/80" />
                <div className="relative z-10 flex min-h-[480px] items-center">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                Made in Italy
                            </span>
                            <h1 className="heading-1 mb-6 text-white">MEDESY</h1>
                            <p className="text-body-lg mb-8 leading-relaxed text-neutral-200">
                                An Italian company renowned for manufacturing high-quality dental instruments and equipment — blending centuries of artisan expertise with continuous innovation.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/our-instruments">
                                    <Button size="lg" className="px-8">
                                        Explore Instruments
                                    </Button>
                                </Link>
                                <Link href="/support/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 px-8 text-white hover:bg-white/10">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legacy Section - Alternating layout */}
            <section className="section bg-white">
                <div className="container">
                    <div className="flex flex-col items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <div className="relative">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-xl">
                                    <Image
                                        src="/images/products/medesy/forceps/forceps-category.jpg"
                                        alt="Medesy dental forceps craftsmanship"
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>
                                {/* Floating accent card */}
                                <div className="absolute -right-4 -bottom-4 rounded-xl bg-primary-600 px-6 py-4 text-white shadow-lg">
                                    <div className="text-3xl font-bold">600+</div>
                                    <div className="text-sm text-primary-100">Years of Heritage</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="text-primary-600 mb-2 inline-block text-sm font-semibold uppercase tracking-wider">Our Heritage</span>
                            <h2 className="heading-2 mb-6">A Legacy Forged in Steel</h2>
                            <p className="text-body-lg text-muted mb-6 leading-relaxed">
                                Rooted in the historic steel-making town of Maniago, the brand carries forward a family legacy built on passion, precision, and craftsmanship. For over 600 years, Maniago has been internationally recognized as a center of excellence in blade production, and MEDESY proudly reflects this heritage in every instrument it creates.
                            </p>
                            <p className="text-body text-muted leading-relaxed">
                                Blending centuries-old artisan expertise with continuous innovation, MEDESY focuses on advanced design, superior ergonomics, and reliable functionality. The result is a comprehensive range of dental solutions trusted by professionals worldwide for their durability, precision, and performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values/Features Grid */}
            <section className="section bg-neutral-50">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">The MEDESY Difference</h2>
                        <p className="text-body-lg text-muted">Where centuries of Italian craftsmanship meets modern dental innovation.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {heritage.map((item) => (
                            <div key={item.title} className="card card-hover rounded-xl p-8 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">{item.icon}</div>
                                <h3 className="heading-4 mb-3">{item.title}</h3>
                                <p className="text-sm text-muted">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instrument Categories */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Instrument Categories</h2>
                        <p className="text-body-lg text-muted">A comprehensive portfolio of precision dental instruments designed for every clinical need.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {instrumentCategories.map((category) => (
                            <Link href="/our-instruments" key={category.name} className="group">
                                <div className="card card-hover overflow-hidden rounded-xl">
                                    <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5 text-center">
                                        <h3 className="heading-4 mb-1">{category.name}</h3>
                                        <p className="text-sm text-muted">{category.count}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-gradient section text-white">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Experience Italian Precision</h2>
                        <p className="text-body-lg mb-8 text-primary-100">
                            Discover the full range of MEDESY instruments — crafted in Maniago, trusted worldwide. Durability, precision, and performance in every instrument.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/our-instruments">
                                <Button size="lg" className="bg-white px-10 text-primary-700 hover:bg-neutral-100">
                                    Browse Instruments
                                </Button>
                            </Link>
                            <Link href="/support/contact">
                                <Button size="lg" variant="outline" className="border-white/30 px-10 text-white hover:bg-white/10">
                                    Request Catalog
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
