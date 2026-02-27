import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, Button } from "@/components/ui";
import { HeartPulse, ArrowDownUp, Brain, Armchair, Activity, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Salli | Ergonomic Saddle Chairs for Dental Professionals",
    description:
        "Salli Systems — pioneers in ergonomic saddle chair design. Solving sitting-related problems through research-driven innovation for dental and medical professionals.",
};

const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Salli", path: "/about/salli" },
];

const sittingProblems = [
    "Lower back and shoulder pain",
    "Poor posture during procedures",
    "Sitting fatigue and discomfort",
    "Reduced circulation in lower limbs",
    "Hip and knee joint problems",
    "Slower bowel movement",
    "Restricted breathing while seated",
    "Headaches and poor pelvic circulation",
];

const pillars = [
    {
        icon: <Brain className="h-7 w-7" />,
        title: "Research in Sitting Physiology",
        description: "Decades of scientific research into how sitting affects the body, informing every design decision.",
    },
    {
        icon: <ArrowDownUp className="h-7 w-7" />,
        title: "Continuous Innovation",
        description: "Relentless product development to deliver cutting-edge ergonomic solutions for modern professionals.",
    },
    {
        icon: <Armchair className="h-7 w-7" />,
        title: "High-Quality Manufacturing",
        description: "Premium materials and precise engineering ensure durability, comfort, and long-lasting performance.",
    },
    {
        icon: <HeartPulse className="h-7 w-7" />,
        title: "Customer-Oriented Approach",
        description: "Solving real sitting problems through an integrated, user-focused design philosophy.",
    },
];

const products = [
    {
        name: "Salli SwayFit",
        image: "/images/products/salli/salli-swayfit-main.jpg",
        description: "Dynamic saddle chair with a split seat that promotes active sitting and natural spinal alignment.",
    },
    {
        name: "Salli TripleLift",
        image: "/images/products/salli/salli-triplelift-main.jpg",
        description: "Versatile height-adjustable saddle chair designed for optimal pelvic tilt and pressure distribution.",
    },
    {
        name: "Salli Ultra",
        image: "/images/products/salli/salli-ultra-main.jpg",
        description: "Premium option with ultra-smooth tilt mechanisms for the most comfortable sitting experience.",
    },
];

export default function AboutSalliPage() {
    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="relative min-h-[480px] overflow-hidden bg-neutral-900">
                <Image
                    src="/images/products/salli/salli-banner.jpg"
                    alt="Salli ergonomic saddle chairs"
                    fill
                    className="object-cover opacity-35"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-neutral-900/20" />
                <div className="relative z-10 flex min-h-[480px] items-center">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                Ergonomic Excellence
                            </span>
                            <h1 className="heading-1 mb-6 text-white">Salli</h1>
                            <p className="text-body-lg mb-8 leading-relaxed text-neutral-200">
                                Advancing research in sitting physiology, continuous product innovation, high-quality manufacturing, and solving sitting-related problems through a customer-oriented, integrated approach.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="px-8">
                                        Explore Salli Chairs
                                    </Button>
                                </Link>
                                <Link href="/support/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 px-8 text-white hover:bg-white/10">
                                        Get in Touch
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="flex flex-col items-center gap-16 lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <span className="text-primary-600 mb-2 inline-block text-sm font-semibold uppercase tracking-wider">The Challenge</span>
                            <h2 className="heading-2 mb-6">Traditional Sitting Is Hurting You</h2>
                            <p className="text-body-lg text-muted mb-8 leading-relaxed">
                                Salli has demonstrated that traditional sitting is closely linked to numerous health issues. Their research-driven approach identifies and addresses these concerns at the core.
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {sittingProblems.map((problem) => (
                                    <div key={problem} className="flex items-start gap-3">
                                        <Activity className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                        <span className="text-sm text-neutral-700">{problem}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 shadow-lg">
                                <Image src="/images/products/salli/salli-swayfit-1.jpg" alt="Salli SwayFit saddle chair" fill className="object-contain p-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution Section */}
            <section className="section bg-primary-50">
                <div className="container">
                    <div className="mx-auto mb-6 max-w-3xl text-center">
                        <span className="text-primary-600 mb-2 inline-block text-sm font-semibold uppercase tracking-wider">The Solution</span>
                        <h2 className="heading-2 mb-4">Designed to Transform How You Sit</h2>
                        <p className="text-body-lg text-muted leading-relaxed">
                            The Salli saddle chair is designed to help users significantly reduce these concerns while enhancing overall sitting comfort and productivity. Here are the four pillars behind every Salli product.
                        </p>
                    </div>
                </div>
            </section>

            {/* Four Pillars */}
            <section className="section bg-neutral-50">
                <div className="container">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {pillars.map((pillar, index) => (
                            <div key={pillar.title} className="card card-hover relative overflow-hidden rounded-xl p-8">
                                <div className="absolute top-0 left-0 h-1 w-full bg-primary-gradient" />
                                <div className="text-primary-300 mb-3 text-5xl font-bold">0{index + 1}</div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">{pillar.icon}</div>
                                <h3 className="heading-4 mb-2">{pillar.title}</h3>
                                <p className="text-sm text-muted">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <h2 className="heading-2 mb-4">The Salli Range</h2>
                        <p className="text-body-lg text-muted">Purpose-built saddle chairs that redefine seated comfort for dental and medical professionals.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {products.map((product) => (
                            <div key={product.name} className="card card-hover group overflow-hidden rounded-xl">
                                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="heading-4 mb-2">{product.name}</h3>
                                    <p className="text-sm text-muted">{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Banner */}
            <section className="bg-primary-gradient section text-white">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center">
                            <h2 className="heading-2 mb-4">Invest in Your Health & Productivity</h2>
                            <p className="text-body-lg mb-8 text-primary-100">
                                Join thousands of dental and medical professionals who have transformed their practice with Salli ergonomic seating. Better posture, less pain, more focus.
                            </p>
                            <div className="mb-10 flex flex-wrap justify-center gap-6">
                                {["Better Posture", "Less Pain", "More Circulation", "Higher Productivity"].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary-200" />
                                        <span className="font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href="/products">
                                    <Button size="lg" className="bg-white px-10 text-primary-700 hover:bg-neutral-100">
                                        Shop Salli Chairs
                                    </Button>
                                </Link>
                                <Link href="/support/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 px-10 text-white hover:bg-white/10">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
