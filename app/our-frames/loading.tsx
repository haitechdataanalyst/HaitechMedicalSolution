export default function OurFramesLoading() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumb */}
            <div className="border-b border-neutral-100 bg-white px-4 py-3">
                <div className="container mx-auto flex gap-2">
                    <div className="h-4 w-16 rounded bg-neutral-200" />
                    <div className="h-4 w-3 rounded bg-neutral-200" />
                    <div className="h-4 w-24 rounded bg-neutral-200" />
                </div>
            </div>

            {/* Hero banner */}
            <div className="h-56 bg-neutral-200 sm:h-72" />

            {/* Frame cards grid */}
            <div className="container mx-auto px-4 py-10">
                <div className="mb-6 h-7 w-48 rounded bg-neutral-100" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
                            <div className="aspect-[4/3] bg-neutral-100" />
                            <div className="space-y-3 p-5">
                                <div className="h-5 w-3/4 rounded bg-neutral-100" />
                                <div className="h-3 w-full rounded bg-neutral-100" />
                                <div className="h-3 w-5/6 rounded bg-neutral-100" />
                                <div className="flex gap-2 pt-1">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="h-6 w-6 rounded-full bg-neutral-200" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
