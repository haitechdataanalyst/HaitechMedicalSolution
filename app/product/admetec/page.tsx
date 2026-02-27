import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Button } from "@/components/ui";
import { Eye, Crosshair, Lightbulb, Sparkles, Award, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Admetec | Premium Dental Loupes & Headlights",
    description: "Discover Admetec — world-leading manufacturer of dental loupes, surgical magnification, and LED headlights. Galilean, Prismatic & Ergo systems for precision care.",
};

const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Admetec", path: "/about/admetec" },
];

const features = [
    {
        icon: <Eye className="h-6 w-6" />,
        title: "Superior Optics",
        description: "Crystal-clear magnification with edge-to-edge sharpness for precise clinical work.",
    },
    {
        icon: <Crosshair className="h-6 w-6" />,
        title: "Precision Engineering",
        description: "Each loupe is meticulously crafted with aerospace-grade materials for lasting performance.",
    },
    {
        icon: <Lightbulb className="h-6 w-6" />,
        title: "Advanced LED Lights",
        description: "Powerful, lightweight headlights delivering optimal illumination for any procedure.",
    },
    {
        icon: <Sparkles className="h-6 w-6" />,
        title: "Ergonomic Design",
        description: "Thoughtfully designed frames that reduce neck strain and enhance all-day comfort.",
    },
    {
        icon: <Award className="h-6 w-6" />,
        title: "Award-Winning Innovation",
        description: "Recognized globally for pioneering advancements in dental magnification technology.",
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Built to Last",
        description: "Premium materials and rigorous quality control ensure years of reliable performance.",
    },
];

const loupeTypes = [
    {
        name: "Galilean Loupes",
        description:
            "Lightweight and compact, Galilean loupes offer a wide field of view with excellent depth of field. Perfect for general dentistry and routine procedures, available in 2.5x, 2.7x, and 3.2x magnifications.",
        image: "/images/products/admetec/galilean/galilean-2.5x-blues-pink.jpg",
        magnifications: ["2.5x", "2.7x", "3.2x"],
    },
    {
        name: "Prismatic (Ergo) Loupes",
        description:
            "The Ergo series delivers higher magnification with superior optical clarity. Featuring an ergonomic declination angle that promotes better posture, these loupes are ideal for detailed procedures requiring precision.",
        image: "/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg",
        magnifications: ["3.0x", "4.0x", "5.0x", "6.0x", "7.5x", "10x"],
    },
];

export default function AboutAdmetecPage() {
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section with Background Image */}
            <section className="relative min-h-[480px] overflow-hidden bg-neutral-900">
                <Image src="/images/products/admetec/admetec-banner.jpg" alt="Admetec dental loupes and headlights" fill className="object-cover opacity-40" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-transparent" />
                <div className="relative z-10 flex min-h-[480px] items-center">
                    <div className="container">
                        <div className="max-w-2xl">
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">Premium Magnification</span>
                            <h1 className="heading-1 mb-6 text-white">Admetec</h1>
                            <p className="text-body-lg mb-8 leading-relaxed text-neutral-200">
                                World-leading manufacturer of dental loupes, surgical magnification systems, and LED headlights — empowering professionals with unmatched clarity and precision.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="px-8">
                                        Explore Loupes
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

            {/* Loupe Types Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Two Magnification Systems</h2>
                        <p className="text-body-lg text-muted">Admetec offers both Galilean and Prismatic magnification — each engineered for specific clinical needs and preferences.</p>
                    </div>

                    <div className="space-y-20">
                        {loupeTypes.map((loupe, index) => (
                            <div key={loupe.name} className={`flex flex-col items-center gap-12 lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                                <div className="w-full lg:w-1/2">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-lg">
                                        <Image src={loupe.image} alt={loupe.name} fill className="object-contain p-6" />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <h3 className="heading-3 mb-4">{loupe.name}</h3>
                                    <p className="text-body-lg text-muted mb-6 leading-relaxed">{loupe.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {loupe.magnifications.map((mag) => (
                                            <span key={mag} className="bg-primary-50 text-primary-700 rounded-lg px-3 py-1.5 text-sm font-medium">
                                                {mag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section bg-neutral-50">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Why Professionals Choose Admetec</h2>
                        <p className="text-body-lg text-muted">Every Admetec product is built on a foundation of innovation, comfort, and optical excellence.</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="card card-hover rounded-xl p-8">
                                <div className="bg-primary-100 text-primary-600 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">{feature.icon}</div>
                                <h3 className="heading-4 mb-2">{feature.title}</h3>
                                <p className="text-muted">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Headlights Highlight */}
            <section className="section bg-white">
                <div className="container">
                    <div className="flex flex-col items-center gap-12 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <span className="text-primary-600 mb-2 inline-block text-sm font-semibold tracking-wider uppercase">LED Technology</span>
                            <h2 className="heading-2 mb-6">Advanced Headlights</h2>
                            <p className="text-body-lg text-muted mb-6 leading-relaxed">
                                Admetec headlights combine powerful illumination with featherweight design. From wired Orchid models to the wireless Butterfly series, every light delivers consistent,
                                shadow-free visibility for even the most demanding procedures.
                            </p>
                            <ul className="space-y-3">
                                {["Wireless & wired options available", "True daylight color rendering", "Ultra-lightweight for all-day comfort", "Long-lasting battery life"].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <span className="bg-primary-100 text-primary-600 flex h-6 w-6 items-center justify-center rounded-full">✓</span>
                                        <span className="text-muted">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 shadow-lg">
                                <Image
                                    src="/images/products/admetec/Lights/Flamingo/Flamingo-with-Loupes-and-PowerPack.webp"
                                    alt="Admetec Flamingo headlight with loupes"
                                    fill
                                    className="object-contain p-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-gradient section text-white">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Experience the Admetec Difference</h2>
                        <p className="text-body-lg text-primary-100 mb-8">
                            Ready to elevate your clinical precision? Discover the full range of Admetec loupes and headlights, trusted by thousands of professionals worldwide.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/products">
                                <Button size="lg" className="text-primary-700 bg-white px-10 hover:bg-neutral-100">
                                    Browse Products
                                </Button>
                            </Link>
                            <Link href="/support/contact">
                                <Button size="lg" variant="outline" className="border-white/30 px-10 text-white hover:bg-white/10">
                                    Request a Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
