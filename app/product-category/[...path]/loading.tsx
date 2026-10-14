import { BreadcrumbSkeleton, LoadingShell, SkeletonBar, SkeletonGrid } from "@/components/catalog/listing";

// Mirrors the redesigned category page: header, pill toolbar, quiet count, calm card grid.
// No sidebar — the real page only shows one when a price range exists.
export default function CategoryPageLoading() {
    return (
        <LoadingShell label="Loading category">
            <BreadcrumbSkeleton />
            <div className="container py-8 md:py-12">
                <div className="mb-8 md:mb-10">
                    <SkeletonBar className="h-9 w-56 sm:h-10 sm:w-80" />
                    <SkeletonBar className="mt-4 h-4 w-72 max-w-full sm:w-[28rem]" />
                </div>

                <div className="flex gap-3">
                    <SkeletonBar className="h-12 flex-1 bg-white ring-1 ring-neutral-900/[0.06]" />
                    <SkeletonBar className="h-12 w-36 bg-white ring-1 ring-neutral-900/[0.06]" />
                </div>
                <SkeletonBar className="mt-5 mb-4 h-3 w-20" />

                <SkeletonGrid count={9} className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4" />
            </div>
        </LoadingShell>
    );
}
