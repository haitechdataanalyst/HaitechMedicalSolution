export default function OurHeadlightsLoading() {
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

            {/* Category selector */}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-center gap-3">
                    {[110, 130, 100].map((w, i) => (
                        <div key={i} className="h-10 rounded-full bg-neutral-100" style={{ width: w }} />
                    ))}
                </div>

                {/* Detail card */}
                <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-neutral-100 bg-white">
                    <div className="grid sm:grid-cols-2">
                        <div className="aspect-square bg-neutral-100 sm:aspect-auto sm:min-h-72" />
                        <div className="space-y-4 p-6">
                            <div className="h-6 w-2/3 rounded bg-neutral-100" />
                            <div className="h-3 w-full rounded bg-neutral-100" />
                            <div className="h-3 w-5/6 rounded bg-neutral-100" />
                            <div className="h-3 w-4/5 rounded bg-neutral-100" />
                            <div className="mt-4 flex gap-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-8 flex-1 rounded-xl bg-neutral-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
