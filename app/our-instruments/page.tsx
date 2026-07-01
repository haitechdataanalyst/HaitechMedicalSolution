import { Breadcrumbs } from "@/components/ui";
import { getCategoryBySlug, getChildCategories, getCategoryPath, getCategoryBreadcrumbs } from "@/lib/catalog";
import { CategoryPageClient } from "@/components/catalog/CategoryPageClient";
import { getMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import type { Category } from "@/types";

export const metadata = getMetadata("ourInstruments");

interface CategoryWithPath extends Category {
    path?: string;
}

export default async function OurInstrumentsPage() {
    const medesyCategory = await getCategoryBySlug("medesy");
    if (!medesyCategory) notFound();

    const [subcategories, breadcrumbs] = await Promise.all([
        getChildCategories(medesyCategory.id),
        getCategoryBreadcrumbs(medesyCategory),
    ]);

    const itemsWithPaths: CategoryWithPath[] = await Promise.all(
        subcategories.map(async (cat) => ({
            ...cat,
            path: await getCategoryPath(cat),
        }))
    );

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />

            <section className="bg-neutral-50/50 min-h-screen">
                <div className="container py-6 md:py-8">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">{medesyCategory.name}</h1>
                        {medesyCategory.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{medesyCategory.description}</p>
                        )}
                    </div>

                    <CategoryPageClient initialItems={itemsWithPaths} initialType="categories" />
                </div>
            </section>
        </>
    );
}
