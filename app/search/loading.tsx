export default function SearchLoading() {
    return (
        <div className="container mx-auto animate-pulse px-4 py-8">
            {/* Search bar */}
            <div className="mx-auto mb-8 max-w-2xl">
                <div className="h-14 rounded-2xl bg-neutral-100" />
            </div>

            {/* Results label */}
            <div className="mb-4 h-5 w-40 rounded bg-neutral-100" />

            {/* Product list */}
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-4 rounded-xl border border-neutral-100 bg-white p-4">
                        <div className="h-20 w-20 shrink-0 rounded-xl bg-neutral-100" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 w-2/3 rounded bg-neutral-100" />
                            <div className="h-3 w-1/3 rounded bg-neutral-100" />
                            <div className="h-3 w-1/2 rounded bg-neutral-100" />
                        </div>
                        <div className="h-8 w-20 shrink-0 self-center rounded-xl bg-neutral-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}
