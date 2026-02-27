import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Button } from "@/components/ui";
import { Diamond, Zap, ThermometerSun, Target, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Strauss | Precision Diamond Burs for Dentistry",
    description:
        "Strauss Diamond Burs — precision-engineered rotary instruments delivering efficient cutting, smooth performance, and consistent clinical results for dental professionals.",
};

const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Strauss", path: "/about/strauss" },
];

const advantages = [
    {
        icon: <Diamond className="h-6 w-6" />,
        title: "Uniform Diamond Distribution",
        description: "Precisely distributed diamond particles ensure consistent cutting efficiency across the entire working surface.",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Efficient Cutting",
        description: "Advanced bonding technology delivers smooth, effortless cutting performance with every use.",
    },
    {
        icon: <ThermometerSun className="h-6 w-6" />,
        title: "Minimal Heat & Vibration",
        description: "Engineered to minimize heat generation and vibration for safer, more comfortable procedures.",
    },
    {
        icon: <Target className="h-6 w-6" />,
        title: "Consistent Geometry",
        description: "Stable handling and predictable performance when working with enamel, dentin, and restorative materials.",
    },
    {
        icon: <Clock className="h-6 w-6" />,
        title: "Long Service Life",
        description: "Known for exceptional sharpness and durability that outlast conventional diamond burs.",
    },
    {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: "Safety & Control",
        description: "Excellent control and visibility during procedures, prioritizing accuracy and patient safety.",
    },
];

const burSeries = [
    {
        name: "A-Series",
        description: "Standard diamond burs for general preparation and restorative procedures.",
        image: "/images/products/strauss/a-series/A1M.jpg",
        color: "from-blue-500 to-blue-700",
    },
    {
        name: "B-Series",
        description: "Fine-grit burs designed for contouring, adjustment, and finishing work.",
        image: "/images/products/strauss/b-series/B1M.jpg",
        color: "from-teal-500 to-teal-700",
    },
    {
        name: "P-Series",
        description: "Specialty shapes and configurations for specific clinical indications.",
        image: "/images/products/strauss/p-series/PR13M.jpg",
        color: "from-purple-500 to-purple-700",
    },
];

export default function AboutStraussPage() {
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="relative min-h-[480px] overflow-hidden bg-neutral-900">
                <Image
                    src="/images/products/strauss/strauss-banner.jpg"
                    alt="Strauss diamond burs"
                    fill
                    className="object-cover opacity-35"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-transparent" />
                <div className="relative z-10 flex min-h-[480px] items-center">
                    <div className="container">
                        <div className="max-w-2xl">
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                Precision Diamond Technology
                            </span>
                            <h1 className="heading-1 mb-6 text-white">Strauss Diamond Burs</h1>
                            <p className="text-body-lg mb-8 leading-relaxed text-neutral-200">
                                Precision-engineered rotary instruments designed to deliver efficient cutting, smooth performance, and consistent clinical results for the modern dental practice.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="px-8">
                                        Explore Diamond Burs
                                    </Button>
                                </Link>
                                <Link href="/support/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 px-8 text-white hover:bg-white/10">
                                        Request Samples
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Content - Split Layout */}
            <section className="section bg-white">
                <div className="container">
                    <div className="flex flex-col items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <span className="text-primary-600 mb-2 inline-block text-sm font-semibold uppercase tracking-wider">About the Brand</span>
                            <h2 className="heading-2 mb-6">Engineering Excellence in Every Bur</h2>
                            <p className="text-body-lg text-muted mb-6 leading-relaxed">
                                Manufactured using high-quality materials and advanced bonding technology, Strauss burs provide excellent durability and uniform diamond distribution for reliable cutting efficiency.
                            </p>
                            <p className="text-body text-muted mb-6 leading-relaxed">
                                Strauss FG diamond burs are specifically developed for precise cutting and controlled material removal in restorative dentistry. The range includes multiple shapes, grits, and configurations to support preparation, adjustment, and finishing across common clinical indications.
                            </p>
                            <p className="text-body text-muted leading-relaxed">
                                Known for their sharpness and long service life, Strauss Diamond Burs minimize vibration and heat generation while offering excellent control and visibility. They are a dependable choice for modern dental practices that prioritize accuracy, safety, and performance.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-md">
                                    <Image src="/images/products/strauss/a-series/A2M.jpg" alt="Strauss A-series diamond bur" fill className="object-contain p-4" />
                                </div>
                                <div className="relative mt-8 aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-md">
                                    <Image src="/images/products/strauss/b-series/B2M.jpg" alt="Strauss B-series diamond bur" fill className="object-contain p-4" />
                                </div>
                                <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-md">
                                    <Image src="/images/products/strauss/p-series/PR24M.jpg" alt="Strauss P-series diamond bur" fill className="object-contain p-4" />
                                </div>
                                <div className="relative mt-8 aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-md">
                                    <Image src="/images/products/strauss/a-series/A4M.jpg" alt="Strauss diamond bur closeup" fill className="object-contain p-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages Grid */}
            <section className="section bg-neutral-50">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Why Choose Strauss</h2>
                        <p className="text-body-lg text-muted">
                            Every Strauss Diamond Bur is crafted to deliver measurable clinical advantages.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {advantages.map((advantage) => (
                            <div key={advantage.title} className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                    {advantage.icon}
                                </div>
                                <div>
                                    <h3 className="heading-4 mb-1">{advantage.title}</h3>
                                    <p className="text-sm text-muted">{advantage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Series */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Diamond Bur Range</h2>
                        <p className="text-body-lg text-muted">Multiple series covering preparation, adjustment, and finishing across all common clinical indications.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {burSeries.map((series) => (
                            <div key={series.name} className="card card-hover group overflow-hidden rounded-xl">
                                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                                    <Image
                                        src={series.image}
                                        alt={`Strauss ${series.name}`}
                                        fill
                                        className="object-contain p-8 transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="border-t p-6">
                                    <h3 className="heading-4 mb-2">{series.name}</h3>
                                    <p className="text-sm text-muted">{series.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clinical Applications Banner */}
            <section className="section bg-neutral-900 text-white">
                <div className="container">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="heading-2 mb-8">Clinical Applications</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {["Crown Preparation", "Cavity Preparation", "Material Adjustment", "Surface Finishing"].map((app) => (
                                <div key={app} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <Diamond className="mx-auto mb-3 h-8 w-8 text-primary-400" />
                                    <h3 className="font-medium">{app}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-gradient section text-white">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">Cut with Confidence</h2>
                        <p className="text-body-lg mb-8 text-primary-100">
                            Experience the precision and reliability of Strauss Diamond Burs. A dependable choice for dental practices that prioritize accuracy, safety, and performance.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/products">
                                <Button size="lg" className="bg-white px-10 text-primary-700 hover:bg-neutral-100">
                                    Shop Diamond Burs
                                </Button>
                            </Link>
                            <Link href="/support/contact">
                                <Button size="lg" variant="outline" className="border-white/30 px-10 text-white hover:bg-white/10">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
