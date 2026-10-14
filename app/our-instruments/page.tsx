import { Breadcrumbs } from "@/components/ui";
import { getCategoryBySlug, getChildCategories, getCategoryPath, getCategoryBreadcrumbs } from "@/lib/catalog";
import { CategoryPageClient } from "@/components/catalog/CategoryPageClient";
import { PAGE_SUBTITLE, PAGE_TITLE } from "@/components/catalog/listing";
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

            <section className="min-h-screen bg-neutral-50/50">
                <div className="container pt-10 pb-16 md:pt-16 md:pb-24">
                    <div className="mb-8 md:mb-10">
                        <h1 className={PAGE_TITLE}>{medesyCategory.name}</h1>
                        {medesyCategory.description && <p className={`${PAGE_SUBTITLE} line-clamp-2`}>{medesyCategory.description}</p>}
                    </div>

                    <CategoryPageClient initialItems={itemsWithPaths} initialType="categories" />
                </div>
            </section>
        </>
    );
}
