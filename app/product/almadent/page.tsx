import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Button } from "@/components/ui";
import { Armchair, Wrench, Cog, Wind, ShieldCheck, Sparkles, HeartPulse, Settings2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Almadent | Complete Dental Equipment Solutions",
    description:
        "Almadent by Haitech — reliable dental chairs, handpieces, implant motors, and auxiliary equipment engineered for clinical efficiency, durability, and patient comfort.",
};

const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Almadent", path: "/about/almadent" },
];

const pillars = [
    {
        icon: <ShieldCheck className="h-7 w-7" />,
        title: "Performance",
        description:
            "Every Almadent product is built to perform consistently under the demands of daily clinical use, providing reliability when it matters most.",
    },
    {
        icon: <HeartPulse className="h-7 w-7" />,
        title: "Ergonomics",
        description:
            "Designed with practitioner comfort in mind, our equipment reduces strain and fatigue during long procedures.",
    },
    {
        icon: <Settings2 className="h-7 w-7" />,
        title: "Functionality",
        description:
            "Intuitive controls and streamlined workflows ensure smooth operation so you can focus on patient care.",
    },
    {
        icon: <Sparkles className="h-7 w-7" />,
        title: "Durability",
        description:
            "Premium materials and rigorous quality testing guarantee equipment that stands the test of time.",
    },
];

const productCategories = [
    {
        title: "Dental Chairs",
        description:
            "The AY-series dental chairs combine ergonomic design with advanced functionality. Multiple configurations available to suit every practice style and space.",
        image: "/images/products/almadent/chairs/chairs-category.jpg",
        icon: <Armchair className="h-6 w-6" />,
        highlight: "AY-3000 · AY-6000 · AY-8000",
    },
    {
        title: "Handpieces",
        description:
            "Precision-engineered handpieces delivering smooth torque and reliable performance for restorative, endodontic, and surgical procedures.",
        image: "/images/products/almadent/handpiece/tealth-handpiece.png",
        icon: <Wrench className="h-6 w-6" />,
        highlight: "High-Speed · Low-Speed · Electric",
    },
    {
        title: "Implant Motors",
        description:
            "Advanced implant motor systems with precise torque control and intuitive interfaces for safe, predictable implant placement.",
        image: "/images/products/almadent/auxiliary/implant-motor-1.jpg",
        icon: <Cog className="h-6 w-6" />,
        highlight: "Programmable · Torque Control",
    },
    {
        title: "Auxiliary Equipment",
        description:
            "Suction systems, lubricators, and specialized tools that keep your practice running efficiently day after day.",
        image: "/images/products/almadent/auxiliary/ptx-main.png",
        icon: <Wind className="h-6 w-6" />,
        highlight: "Suction · Lubrication · PTX",
    },
];

export default function AlmadentAboutPage() {
    return (
        <main className="bg-white">
            {/* Breadcrumbs */}
            <div className="container pt-4">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
                <div className="absolute inset-0">
                    <Image
                        src="/images/products/almadent/almadent-banner.jpg"
                        alt="Almadent dental equipment"
                        fill
                        className="object-cover opacity-25"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
                </div>

                <div className="container relative z-10 grid min-h-130 items-center gap-12 py-20 lg:grid-cols-2">
                    <div className="max-w-xl">
                        <span className="mb-4 inline-block rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
                            By Haitech Medical
                        </span>
                        <h1 className="heading-1 mb-6 text-white!">
                            Complete Dental
                            <span className="block text-primary-400">Equipment Solutions</span>
                        </h1>
                        <p className="text-body-lg text-slate-300!">
                            Almadent is a specialized product series by Haitech, developed to provide
                            reliable and efficient solutions for modern dental practices. From dental chairs
                            to handpieces, every product is designed with a focus on performance,
                            ergonomics, and day-to-day clinical convenience.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button size="lg">Browse Products</Button>
                            </Link>
                            <Link href="/support/contact">
                                <Button variant="outline" size="lg" className="border-white/20! text-white! hover:bg-white/10!">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl bg-primary-500/10 blur-2xl" />
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                                <Image
                                    src="/images/products/almadent/chairs/ay-3000-1.jpg"
                                    alt="Almadent AY-3000 dental chair"
                                    width={600}
                                    height={450}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="section bg-linear-to-b from-slate-50 to-white">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="heading-2 mb-6">
                            Designed for the
                            <span className="text-primary-500"> Modern Practice</span>
                        </h2>
                        <p className="text-body-lg mx-auto max-w-3xl text-neutral-600">
                            The Almadent portfolio includes dental chairs, handpieces, implant motors, and
                            suction systems — offering clinics a cohesive setup that supports smooth workflow
                            and dependable operation. Built to meet the practical needs of dental
                            professionals, Almadent products combine functionality, durability, and
                            user-friendly design to enhance clinical efficiency and patient comfort.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
                        {[
                            { value: "4+", label: "Product Categories" },
                            { value: "3", label: "Chair Series" },
                            { value: "100%", label: "Quality Tested" },
                            { value: "24/7", label: "Support Available" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold text-primary-500 md:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm font-medium text-neutral-500">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="section">
                <div className="container">
                    <div className="mb-14 text-center">
                        <h2 className="heading-2 mb-4">Why Choose Almadent?</h2>
                        <p className="text-body mx-auto max-w-2xl text-neutral-600">
                            Four core principles guide every product in the Almadent range.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                        {pillars.map((pillar, index) => (
                            <div
                                key={pillar.title}
                                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-primary-200 hover:shadow-lg"
                            >
                                <div className="absolute right-6 top-6 text-7xl font-black text-neutral-100/50 transition-colors group-hover:text-primary-100/60">
                                    0{index + 1}
                                </div>
                                <div className="relative">
                                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                                        {pillar.icon}
                                    </div>
                                    <h3 className="heading-4 mb-2">{pillar.title}</h3>
                                    <p className="text-body text-neutral-600">{pillar.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Categories Showcase */}
            <section className="section bg-slate-900 text-white">
                <div className="container">
                    <div className="mb-14 text-center">
                        <h2 className="heading-2 mb-4 text-white!">The Almadent Portfolio</h2>
                        <p className="text-body-lg mx-auto max-w-2xl text-slate-400!">
                            A comprehensive range designed for every aspect of your dental practice.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {productCategories.map((category) => (
                            <div
                                key={category.title}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary-400/30 hover:bg-white/10"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="mb-3 text-sm leading-relaxed text-slate-400">
                                        {category.description}
                                    </p>
                                    <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-400">
                                        {category.highlight}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chair Series Highlight */}
            <section className="section">
                <div className="container">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-500">
                                Flagship Series
                            </span>
                            <h2 className="heading-2 mb-6">AY-Series Dental Chairs</h2>
                            <p className="text-body mb-6 text-neutral-600">
                                The AY-series represents the pinnacle of the Almadent range. Available in
                                three configurations — AY-3000, AY-6000, and AY-8000 — each model is
                                built to deliver outstanding comfort for patients while providing dentists
                                with ergonomic positioning and intuitive controls.
                            </p>
                            <ul className="mb-8 space-y-3">
                                {[
                                    "Smooth, whisper-quiet hydraulic movements",
                                    "Integrated LED operating light",
                                    "Memory positions for quick adjustments",
                                    "Durable upholstery in multiple color options",
                                    "Compact footprint for space efficiency",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                                        <span className="text-body text-neutral-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/products">
                                <Button>View All Chairs</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="overflow-hidden rounded-2xl">
                                    <Image
                                        src="/images/products/almadent/chairs/ay-3000-2.jpg"
                                        alt="AY-3000 dental chair"
                                        width={300}
                                        height={400}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-2xl">
                                    <Image
                                        src="/images/products/almadent/chairs/ay-6000-1.jpg"
                                        alt="AY-6000 dental chair"
                                        width={300}
                                        height={250}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="overflow-hidden rounded-2xl">
                                    <Image
                                        src="/images/products/almadent/chairs/ay-8000-1.jpg"
                                        alt="AY-8000 dental chair"
                                        width={300}
                                        height={250}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-2xl">
                                    <Image
                                        src="/images/products/almadent/auxiliary/implant-motor-1.jpg"
                                        alt="Almadent implant motor"
                                        width={300}
                                        height={400}
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-sm bg-primary-gradient text-white">
                <div className="container text-center">
                    <h2 className="heading-2 mx-auto max-w-2xl text-white!">
                        Ready to Upgrade Your Practice?
                    </h2>
                    <p className="text-body-lg mx-auto mt-4 max-w-xl text-white/80!">
                        Explore the complete Almadent range and discover equipment that works as hard as you do.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href="/products">
                            <Button size="lg" variant="secondary">Explore Products</Button>
                        </Link>
                        <Link href="/support/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30! text-white! hover:bg-white/10!"
                            >
                                Request a Quote
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
