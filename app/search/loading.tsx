import { LoadingShell, SkeletonBar, SkeletonGrid } from "@/components/catalog/listing";

export default function SearchLoading() {
    return (
        <LoadingShell label="Loading search results">
            <div className="container pt-6 pb-8 md:pb-10">
                <SkeletonBar className="h-3.5 w-28" />
                <SkeletonBar className="mt-8 h-9 w-72 max-w-full md:mt-12 md:h-12 md:w-[28rem]" />
                <SkeletonBar className="mt-6 h-14 max-w-2xl bg-white ring-1 ring-neutral-900/[0.06]" />
            </div>
            <div className="container pb-16">
                <div className="flex gap-2">
                    {["w-20", "w-28", "w-24", "w-32"].map((w) => (
                        <SkeletonBar key={w} className={`h-11 ${w}`} />
                    ))}
                </div>
                <SkeletonBar className="mt-5 mb-4 h-3 w-32" />
                <SkeletonGrid count={8} />
            </div>
        </LoadingShell>
    );
}
