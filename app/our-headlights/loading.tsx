import { BreadcrumbSkeleton, LoadingShell, SkeletonBar } from "@/components/catalog/listing";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export default function OurHeadlightsLoading() {
    return (
        <LoadingShell label="Loading headlights">
            <BreadcrumbSkeleton />

            {/* Hero band */}
            <div className="h-64 bg-neutral-900/[0.06] sm:h-80" />

            {/* Selector: two power-type tiles */}
            <div className="container py-16">
                <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-4">
                    <SkeletonBar className="h-9 w-72 max-w-full" />
                    <SkeletonBar className="h-4 w-full" />
                </div>
                <div className="mx-auto max-w-3xl">
                    <SkeletonBar className="mb-5 h-6 w-56" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                        {[1, 2].map((i) => (
                            <div key={i} className={`${SURFACE_CARD} p-2`}>
                                <div className="aspect-[4/3] rounded-xl bg-neutral-50" />
                                <div className="flex items-center justify-between px-3 pt-4 pb-3">
                                    <SkeletonBar className="h-5 w-28" />
                                    <div className="h-6 w-6 rounded-full bg-neutral-900/[0.06]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LoadingShell>
    );
}
