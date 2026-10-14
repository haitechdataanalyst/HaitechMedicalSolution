import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageWindow, storiesHref } from "@/lib/customer-story-listing";
import type { PageSlice, StoryFilters } from "@/lib/customer-story-listing";

const BASE =
    "focus-visible:outline-primary-500 inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-4 text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2";
const IDLE = "text-neutral-700 hover:bg-neutral-900/[0.06]";
const CURRENT = "bg-neutral-900 text-white";
const DISABLED = "cursor-not-allowed text-neutral-400";

interface StoryPaginationProps {
    slice: Pick<PageSlice<unknown>, "page" | "pageCount">;
    filters: StoryFilters;
}

/** Numbered pagination that keeps the active filters. Renders nothing for a single page. */
export default function StoryPagination({ slice, filters }: StoryPaginationProps) {
    const { page, pageCount } = slice;
    if (pageCount <= 1) return null;

    return (
        <nav aria-label="Customer stories pages" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
            {page > 1 ? (
                <Link href={storiesHref(filters, page - 1)} rel="prev" className={`${BASE} ${IDLE}`}>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="max-sm:sr-only">Previous</span>
                </Link>
            ) : (
                <span aria-disabled="true" className={`${BASE} ${DISABLED}`}>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="max-sm:sr-only">Previous</span>
                </span>
            )}

            {/* Phones: a compact position label. From sm: the numbered window. */}
            <span className="px-3 text-[15px] text-neutral-700 tabular-nums sm:hidden">
                Page {page} of {pageCount}
            </span>
            <div className="hidden items-center gap-1.5 sm:contents">
                {pageWindow(page, pageCount).map((entry, index) =>
                    entry === "gap" ? (
                        <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-neutral-400">
                            …
                        </span>
                    ) : (
                        <Link
                            key={entry}
                            href={storiesHref(filters, entry)}
                            aria-label={`Page ${entry}`}
                            aria-current={entry === page ? "page" : undefined}
                            className={`${BASE} tabular-nums ${entry === page ? CURRENT : IDLE}`}
                        >
                            {entry}
                        </Link>
                    )
                )}
            </div>

            {page < pageCount ? (
                <Link href={storiesHref(filters, page + 1)} rel="next" className={`${BASE} ${IDLE}`}>
                    <span className="max-sm:sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            ) : (
                <span aria-disabled="true" className={`${BASE} ${DISABLED}`}>
                    <span className="max-sm:sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
            )}
        </nav>
    );
}
