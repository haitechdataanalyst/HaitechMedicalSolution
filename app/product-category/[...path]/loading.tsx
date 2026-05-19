export default function CategoryPageLoading() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumb */}
            <div className="border-b border-neutral-100 bg-white px-4 py-3">
                <div className="container mx-auto flex gap-2">
                    {[60, 12, 80, 12, 100].map((w, i) => (
                        <div key={i} className="h-4 rounded bg-neutral-200" style={{ width: w }} />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar */}
                    <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
                        <div className="h-6 w-32 rounded bg-neutral-100" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-5 rounded bg-neutral-100" style={{ width: `${60 + i * 8}%` }} />
                        ))}
                    </aside>

                    {/* Main */}
                    <div className="flex-1">
                        {/* Page header */}
                        <div className="mb-6 space-y-2">
                            <div className="h-8 w-48 rounded bg-neutral-200" />
                            <div className="h-4 w-64 rounded bg-neutral-100" />
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
                                    <div className="aspect-square bg-neutral-100" />
                                    <div className="space-y-2 p-3">
                                        <div className="h-3 w-3/4 rounded bg-neutral-100" />
                                        <div className="h-3 w-1/2 rounded bg-neutral-100" />
                                        <div className="h-8 rounded-lg bg-neutral-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
