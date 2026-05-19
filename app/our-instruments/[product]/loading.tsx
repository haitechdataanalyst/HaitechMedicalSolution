export default function InstrumentProductLoading() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumb */}
            <div className="border-b border-neutral-100 bg-white px-4 py-3">
                <div className="container mx-auto flex gap-2">
                    {[60, 12, 100, 12, 120].map((w, i) => (
                        <div key={i} className="h-4 rounded bg-neutral-200" style={{ width: w }} />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-10 lg:flex-row">
                    {/* Image gallery */}
                    <div className="lg:w-1/2">
                        <div className="aspect-square rounded-2xl bg-neutral-100" />
                        <div className="mt-3 flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square w-16 rounded-xl bg-neutral-100" />
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-5">
                        <div className="h-7 w-3/4 rounded bg-neutral-200" />
                        <div className="h-5 w-1/3 rounded bg-neutral-100" />
                        <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-neutral-100" />
                            <div className="h-3 w-5/6 rounded bg-neutral-100" />
                            <div className="h-3 w-4/5 rounded bg-neutral-100" />
                        </div>
                        <div className="h-12 rounded-xl bg-neutral-100" />
                        <div className="h-12 rounded-xl bg-neutral-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
