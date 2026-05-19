import { getTopCategories } from "@/lib/catalog";
import { ProductsPageClient } from "./ProductsPageClient";
import { getMetadata } from "@/lib/metadata";
import { getBreadcrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = getMetadata("products");

export default function ProductsPage() {
    const categories = getTopCategories();
    const breadcrumbs = getBreadcrumbs("products");

    return (
        <>
            {/* ── Compact page header ── */}
            <div className="border-b border-neutral-100 bg-white">
                <div className="container py-4">
                    <nav className="mb-3 flex items-center gap-1.5 text-sm text-neutral-400">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={crumb.path} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                                {i < breadcrumbs.length - 1 ? (
                                    <Link href={crumb.path} className="transition-colors hover:text-primary-600">
                                        {crumb.name}
                                    </Link>
                                ) : (
                                    <span className="font-semibold text-neutral-800">{crumb.name}</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    <h1 className="text-2xl font-bold text-neutral-900">All Products</h1>
                    <p className="mt-0.5 text-sm text-neutral-400">
                        Premium dental &amp; medical equipment · 5 global brands · 80+ products
                    </p>
                </div>
            </div>

            {/* ── Category browser ── */}
            <section className="bg-white py-6 md:py-8">
                <div className="container">
                    <ProductsPageClient initialCategories={categories} />
                </div>
            </section>
        </>
    );
}
