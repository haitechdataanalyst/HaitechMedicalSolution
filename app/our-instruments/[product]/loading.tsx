import { BreadcrumbSkeleton, LoadingShell, SkeletonBar } from "@/components/catalog/listing";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export default function InstrumentProductLoading() {
    return (
        <LoadingShell label="Loading product">
            <BreadcrumbSkeleton />
            <div className="container py-8 md:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    {/* Image gallery */}
                    <div className="lg:w-1/2">
                        <div className={`${SURFACE_CARD} p-2`}>
                            <div className="aspect-square rounded-xl bg-neutral-50" />
                        </div>
                        <div className="mt-3 flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square w-16 rounded-xl bg-neutral-900/[0.05]" />
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-5">
                        <SkeletonBar className="h-9 w-3/4" />
                        <SkeletonBar className="h-4 w-1/3" />
                        <div className="space-y-2.5 pt-2">
                            <SkeletonBar className="h-3.5 w-full" />
                            <SkeletonBar className="h-3.5 w-5/6" />
                            <SkeletonBar className="h-3.5 w-4/5" />
                        </div>
                        <SkeletonBar className="h-12 w-full" />
                        <SkeletonBar className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </LoadingShell>
    );
}
