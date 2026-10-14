import { BreadcrumbSkeleton, LoadingShell, PageIntroSkeleton, SkeletonBar, SkeletonGrid } from "@/components/catalog/listing";

export default function CatalogLoading() {
    return (
        <LoadingShell label="Loading catalog">
            <BreadcrumbSkeleton />
            <PageIntroSkeleton />
            <div className="container pb-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="hidden w-64 shrink-0 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-neutral-900/[0.05] lg:block">
                        <SkeletonBar className="h-12 w-full" />
                        {["w-3/4", "w-1/2", "w-4/5", "w-3/5", "w-2/3"].map((w) => (
                            <SkeletonBar key={w} className={`h-3.5 ${w}`} />
                        ))}
                    </div>
                    <div className="min-w-0 flex-1">
                        <SkeletonBar className="mb-5 h-3 w-40" />
                        <SkeletonGrid count={12} />
                    </div>
                </div>
            </div>
        </LoadingShell>
    );
}
