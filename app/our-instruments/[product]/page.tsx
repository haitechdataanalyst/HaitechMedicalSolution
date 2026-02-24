import { Banner, Breadcrumbs } from "@/components/ui";
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

    return (
        <>
            <Breadcrumbs items={getMedesyProductBreadcrumbs(product.name, productSlug)} />

            {/* Hero Section */}
            <Banner title={product.name} description={product.description || ""} />

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
