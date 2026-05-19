export default function OurInstrumentsLoading() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumb */}
            <div className="border-b border-neutral-100 bg-white px-4 py-3">
                <div className="container mx-auto flex gap-2">
                    <div className="h-4 w-16 rounded bg-neutral-200" />
                    <div className="h-4 w-3 rounded bg-neutral-200" />
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                </div>
            </div>

            {/* Hero banner */}
            <div className="h-56 bg-neutral-200 sm:h-72" />

            {/* Category tabs */}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex gap-3 overflow-hidden">
                    {[120, 100, 140, 110, 90].map((w, i) => (
                        <div key={i} className="h-10 shrink-0 rounded-full bg-neutral-100" style={{ width: w }} />
                    ))}
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
                            <div className="aspect-square bg-neutral-100" />
                            <div className="space-y-2 p-3">
                                <div className="h-3 w-3/4 rounded bg-neutral-100" />
                                <div className="h-4 w-1/2 rounded bg-neutral-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
