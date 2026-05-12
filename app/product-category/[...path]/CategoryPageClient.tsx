"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryBrowser, type CategoryWithPath, type ProductWithPath } from "@/components/products";
import { fetchCategoryContentsAction } from "@/app/actions/catalog";

interface CategoryPageClientProps {
    initialItems: CategoryWithPath[] | ProductWithPath[];
    initialType: "categories" | "products";
}

export function CategoryPageClient({ initialItems, initialType }: CategoryPageClientProps) {
    // If we have categories, use the CategoryBrowser
    if (initialType === "categories") {
        return <CategoryBrowser initialCategories={initialItems as CategoryWithPath[]} fetchCategoryContents={fetchCategoryContentsAction} />;
    }

    // If we have products directly, render them in a simple grid
    const products = initialItems as ProductWithPath[];

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary-50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <svg className="text-primary-400 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">Products Coming Soon</h3>
                <p className="text-muted mb-6 max-w-sm text-sm">
                    We&apos;re updating our catalogue for this category. Contact us for availability and pricing.
                </p>
                <a
                    href="/support/contact"
                    className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
                >
                    Contact Us
                </a>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Section heading */}
            <div className="my-6 sm:my-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-500 h-6 w-1 rounded-full" />
                    <h2 className="text-foreground text-xl font-semibold sm:text-2xl">Products</h2>
                </div>
                <div className="mt-3 h-px bg-neutral-100" />
            </div>

            {/* Products Grid */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
                {products.map((product) => {
                    const productImage =
                        product.defaultImage ||
                        (product.variants && product.variants.length > 0 ? product.variants[0].image : "") ||
                        (product.gallery && product.gallery.length > 0 ? product.gallery[0] : "") ||
                        "/images/placeholder.jpg";
                    const productPath = product.path || `/product/${product.slug}`;

                    return (
                        <Link key={product.id} href={productPath} className="group flex flex-col items-center p-4 text-center transition-transform hover:scale-105">
                            <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full transition-shadow sm:h-28 sm:w-28 md:h-32 md:w-32">
                                <Image src={productImage} alt={product.name} fill className="object-contain p-2" sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px" />
                            </div>
                            <span className="group-hover:text-primary-600 line-clamp-2 max-w-30 text-sm font-medium text-gray-700 transition-colors">{product.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
