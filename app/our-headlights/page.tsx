import { Breadcrumbs } from "@/components/ui";
import { getHeadlightsData } from "@/lib/catalog";
import Link from "next/link";
import { Button } from "@/components/ui";
import { HeadlightsSelector } from "./HeadlightsSelector";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata = getMetadata("ourHeadlights");

export default async function OurHeadlightsPage() {
    const headlightsData = await getHeadlightsData();

    const breadcrumbs = getBreadcrumbs("ourHeadlights");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="bg-primary-gradient relative overflow-hidden text-white">
                <div className="section-lg container">
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <h1 className="heading-1 mb-6">{headlightsData.intro.title}</h1>
                        <p className="text-body-lg text-primary-100">{headlightsData.intro.description}</p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-10 md:w-1/3">
                    <svg viewBox="0 0 400 400" className="h-full w-full">
                        <circle cx="300" cy="300" r="200" fill="white" />
                    </svg>
                </div>
                <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 opacity-10">
                    <svg viewBox="0 0 400 400" className="h-full w-full">
                        <circle cx="100" cy="100" r="150" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="section container">
                <div className="mx-auto max-w-4xl">
                    <h2 className="heading-2 mb-8 text-center">Premium Quality Lighting</h2>
                    <p className="text-body mb-8 text-center text-gray-600">All our lights are of premium quality and designed to be ultra-lightweight while providing the illumination you need:</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {headlightsData.intro.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                <div className="bg-primary-100 text-primary-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-800">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Headlights Selection Section */}
            <section className="section-md container mb-10">
                <div className="mb-10 text-center">
                    <h2 className="heading-2 mb-4">Choose Your Lighting Solution</h2>
                    <p className="text-body mx-auto max-w-2xl text-gray-600">Select between wireless freedom or reliable wired power. Click on a category to explore the available options.</p>
                </div>

                <HeadlightsSelector categories={headlightsData.categories} />
            </section>

            {/* CTA Section */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="heading-3 mb-4">Complete Your Loupe Setup</h2>
                        <p className="text-body mb-8 text-gray-600">
                            Pair your headlight with our premium loupes for the ultimate clinical experience. Browse our loupe collections to find your perfect match.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/product-category/admetec/ergo-loupes">
                                <Button variant="primary" size="lg">
                                    Explore Ergo Loupes
                                </Button>
                            </Link>
                            <Link href="/product-category/admetec/galilean-loupes">
                                <Button variant="outline" size="lg">
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
