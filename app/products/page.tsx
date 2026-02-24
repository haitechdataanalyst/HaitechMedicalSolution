import { getTopCategories } from "@/lib/catalog";
import { ProductsPageClient } from "./ProductsPageClient";
import { Breadcrumbs } from "@/components/ui";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata = getMetadata("products");

export default function ProductsPage() {
    const categories = getTopCategories();
    const breadcrumbs = getBreadcrumbs("products");

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <div className="container mx-auto px-4 py-6 sm:py-8">
                {/* Page Header - Centered */}
                <div className="mb-6 text-center sm:mb-8">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Products</h1>
                    <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">Explore our comprehensive range of premium medical and dental equipment</p>
                </div>

                {/* Category Browser */}
                <ProductsPageClient initialCategories={categories} />
            </div>
        </>
    );
}
