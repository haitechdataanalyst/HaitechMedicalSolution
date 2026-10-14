import { BreadcrumbSkeleton, LoadingShell, SkeletonBar, SkeletonGrid } from "@/components/catalog/listing";

export default function OurInstrumentsLoading() {
    return (
        <LoadingShell label="Loading instruments">
            <BreadcrumbSkeleton />
            <div className="container pt-10 pb-16 md:pt-16">
                <div className="mb-8 md:mb-10">
                    <SkeletonBar className="h-9 w-64 md:h-12 md:w-96" />
                    <SkeletonBar className="mt-4 h-4 w-72 max-w-full md:w-[28rem]" />
                </div>
                <div className="flex gap-3">
                    <SkeletonBar className="h-12 flex-1 bg-white ring-1 ring-neutral-900/[0.06]" />
                    <SkeletonBar className="h-12 w-44 bg-white ring-1 ring-neutral-900/[0.06]" />
                </div>
                <SkeletonBar className="mt-5 mb-4 h-3 w-20" />
                <SkeletonGrid count={8} className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4" />
            </div>
        </LoadingShell>
    );
}
