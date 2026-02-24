import { Breadcrumbs } from "@/components/ui";
import { getProductBySlug } from "@/lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { MedesyVariantsGrid } from "./MedesyVariantsGrid";
import { getDynamicMetadata, getMetadata } from "@/lib/metadata";
import { getMedesyProductBreadcrumbs } from "@/lib/breadcrumbs";

interface PageProps {
    params: Promise<{ product: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { product: productSlug } = await params;
    const product = getProductBySlug(productSlug);

    if (!product) {
        return getMetadata("productNotFound");
    }

    return getDynamicMetadata(`${product.name} - Medesy Instruments`, product.description);
}

export default async function MedesyProductPage({ params }: PageProps) {
    const { product: productSlug } = await params;
    const product = getProductBySlug(productSlug);

    if (!product) {
        notFound();
    }

    const breadcrumbs = getMedesyProductBreadcrumbs(product.name, productSlug);

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            {/* Hero Section */}
            <section className="bg-primary-gradient relative overflow-hidden text-white">
                <div className="section-lg container">
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <h1 className="heading-1 mb-6">{product.name}</h1>
                        <p className="text-body-lg text-primary-100">{product.description}</p>
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

            {/* Variants Section */}
            <section className="section container">
                <div className="mb-10 text-center">
                    <h2 className="heading-2 mb-4">Available Models</h2>
                    <p className="text-body mx-auto max-w-2xl text-gray-600">
                        {product.hasVariants && product.variants && product.variants.length > 0
                            ? `Choose from ${product.variants.length} available models. Click "Get a Quote" to request pricing.`
                            : 'Click "Get a Quote" to request pricing for this instrument.'}
                    </p>
                </div>

                <MedesyVariantsGrid product={product} />
            </section>

            {/* Back to Categories */}
            <section className="section-sm container">
                <div className="flex justify-center">
                    <Link href="/our-instruments">
                        <Button variant="outline" size="lg">
                            ← Back to All Categories
                        </Button>
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="heading-3 mb-4">Need More Information?</h2>
                        <p className="text-body mb-8 text-gray-600">Our team is here to help you find the right instruments for your practice.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/support/contact">
                                <Button variant="primary" size="lg">
                                    Contact Us
                                </Button>
                            </Link>
                            <Link href="/our-instruments">
                                <Button variant="outline" size="lg">
                                    Browse Other Categories
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
