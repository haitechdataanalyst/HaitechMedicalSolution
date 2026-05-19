export default function CatalogLoading() {
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

            <div className="container mx-auto px-4 py-8">
                {/* Search + filter bar */}
                <div className="mb-6 flex gap-3">
                    <div className="h-11 flex-1 rounded-xl bg-neutral-100" />
                    <div className="h-11 w-28 rounded-xl bg-neutral-100" />
                </div>

                {/* Filter chips */}
                <div className="mb-6 flex gap-2">
                    {[80, 96, 72, 88].map((w) => (
                        <div key={w} className="h-8 rounded-full bg-neutral-100" style={{ width: w }} />
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
                            <div className="aspect-square bg-neutral-100" />
                            <div className="space-y-2 p-3">
                                <div className="h-3 w-3/4 rounded bg-neutral-100" />
                                <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                <div className="h-4 w-1/3 rounded bg-neutral-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
