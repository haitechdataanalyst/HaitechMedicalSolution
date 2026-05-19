import { Breadcrumbs } from "@/components/ui";
import { getMedesyData } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MedesySelector } from "./MedesySelector";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import { ArrowRight } from "lucide-react";

export const metadata = getMetadata("ourInstruments");

export default async function OurInstrumentsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const resolvedParams = await searchParams;
    const medesyData = await getMedesyData();
    const initialCategory = resolvedParams.category || null;
    const breadcrumbs = getBreadcrumbs("ourInstruments");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero */}
            <section className="bg-brand-gradient relative overflow-hidden text-white">
                <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 left-1/4 h-48 w-48 rounded-full bg-primary-400/8 blur-2xl" />
                <div className="section-lg container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="label-tag label-tag-white mb-5 inline-flex">Medesy Collection</span>
                        <h1 className="heading-1 mb-5">{medesyData.intro.title}</h1>
                        <p className="text-body-lg text-white/80">{medesyData.intro.description}</p>
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="section bg-white">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-10 text-center">
                            <span className="label-tag label-tag-primary mb-4 inline-flex">Italian Craftsmanship</span>
                            <h2 className="heading-2 text-neutral-900">Premium Surgical Instruments</h2>
                            <p className="mt-3 text-sm text-neutral-500">
                                Crafted in Maniago, Italy — where 600+ years of blade-making excellence meets modern clinical precision.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {medesyData.intro.features.map((feature, index) => (
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

            {/* Instruments Selector */}
            <section className="section bg-neutral-50/60">
                <div className="container">
                    <div className="mb-10 text-center">
                        <span className="label-tag label-tag-primary mb-4 inline-flex">Browse Instruments</span>
                        <h2 className="heading-2 text-neutral-900">Instrument Categories</h2>
                        <p className="mt-3 text-sm text-neutral-500 mx-auto max-w-xl">
                            Select a category to explore the available instruments. Click on a category card to view all products within that range.
                        </p>
                    </div>
                    <MedesySelector key={initialCategory || "default"} categories={medesyData.categories} initialCategorySlug={initialCategory} />
                </div>
            </section>

            {/* CTA */}
            <section className="section border-t border-neutral-100 bg-white">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">Complete Your Practice</span>
                        <h2 className="heading-3 mb-4 text-neutral-900">Complete Your Practice Setup</h2>
                        <p className="mb-8 text-sm leading-relaxed text-neutral-500">
                            Pair your surgical instruments with our premium dental equipment and loupes for a complete clinical solution.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/product-category/admetec/ergo-loupes">
                                <Button variant="primary" size="lg" className="group gap-2.5 rounded-full px-8">
                                    Explore Loupes
                                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                            <Link href="/product-category/almadent/dental-chairs">
                                <Button variant="outline" size="lg" className="rounded-full px-8">
                                    Explore Dental Chairs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
