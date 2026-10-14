import { BreadcrumbSkeleton, LoadingShell, SkeletonBar } from "@/components/catalog/listing";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export default function OurFramesLoading() {
    return (
        <LoadingShell label="Loading frames">
            <BreadcrumbSkeleton />

            {/* Hero band */}
            <div className="h-64 bg-neutral-900/[0.06] sm:h-80" />

            {/* Frame cards grid */}
            <div className="container py-16">
                <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-4">
                    <SkeletonBar className="h-9 w-80 max-w-full" />
                    <SkeletonBar className="h-4 w-full" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`${SURFACE_CARD} p-2`}>
                            <div className="aspect-[4/3] rounded-xl bg-neutral-50" />
                            <div className="flex flex-col items-center gap-3 px-4 pt-5 pb-4">
                                <SkeletonBar className="h-5 w-24" />
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="h-8 w-8 rounded-full bg-neutral-900/[0.06]" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </LoadingShell>
    );
}
