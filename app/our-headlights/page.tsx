import { Breadcrumbs } from "@/components/ui";
import { getHeadlightsData } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HeadlightsSelector } from "./HeadlightsSelector";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { ArrowRight } from "lucide-react";

export const metadata = getMetadata("ourHeadlights");

export default async function OurHeadlightsPage() {
    const headlightsData = await getHeadlightsData();

    return (
        <>
            <Breadcrumbs items={getBreadcrumbs("ourHeadlights")} />

            {/* Hero */}
            <section className="bg-brand-gradient relative overflow-hidden text-white">
                <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 left-1/4 h-56 w-56 rounded-full bg-primary-400/8 blur-2xl" />
                <div className="section-lg container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="label-tag label-tag-white mb-5 inline-flex">LED Technology</span>
                        <h1 className="heading-1 mb-5">{headlightsData.intro.title}</h1>
                        <p className="text-body-lg text-white/80">{headlightsData.intro.description}</p>
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-10 text-center">
                            <span className="label-tag label-tag-primary mb-4 inline-flex">Why Our Headlights</span>
                            <h2 className="heading-2 text-neutral-900">Premium Quality Lighting</h2>
                            <p className="mt-3 text-sm text-neutral-500">
                                All our lights are ultra-lightweight and engineered for demanding clinical environments.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {headlightsData.intro.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Headlights Selector */}
            <section className="section bg-neutral-50/60">
                <div className="container">
                    <div className="mb-10 text-center">
                        <span className="label-tag label-tag-primary mb-4 inline-flex">Choose Your Model</span>
                        <h2 className="heading-2 text-neutral-900">Lighting Solutions</h2>
                        <p className="mt-3 text-sm text-neutral-500 mx-auto max-w-xl">
                            Select between wireless freedom or reliable wired power. Click on a category to explore the available options.
                        </p>
                    </div>
                    <HeadlightsSelector categories={headlightsData.categories} />
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-white border-t border-neutral-100">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">Complete Your Setup</span>
                        <h2 className="heading-3 mb-4 text-neutral-900">Pair with Premium Loupes</h2>
                        <p className="mb-8 text-sm leading-relaxed text-neutral-500">
                            Pair your headlight with our premium loupes for the ultimate clinical experience. Browse our loupe collections to find your perfect match.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/product-category/admetec/ergo-loupes">
                                <Button variant="primary" size="lg" className="group gap-2.5 rounded-full px-8">
                                    Explore Ergo Loupes
                                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                            <Link href="/product-category/admetec/galilean-loupes">
                                <Button variant="outline" size="lg" className="rounded-full px-8">
                                    Explore Galilean Loupes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
