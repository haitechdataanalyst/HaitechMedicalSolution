import Link from "next/link";
import { EmptyState, RESULT_COUNT } from "@/components/catalog/listing";
import { STORIES_PAGE_PATH, STORIES_PAGE_SIZE, applyFilters, getFilterGroups, hasActiveFilters, paginate, parseFilters, parsePage } from "@/lib/customer-story-listing";
import type { CustomerStory } from "@/lib/customer-stories";
import StoryFilters from "./StoryFilters";
import StoryGrid from "./StoryGrid";
import StoryPagination from "./StoryPagination";
import { consentLine, toCardData } from "./story-view";

interface CustomerStoriesBrowserProps {
    /** Every story that passed the publish gate. The browser filters and pages them. */
    stories: CustomerStory[];
    searchParams: Record<string, string | string[] | undefined>;
}

/**
 * The customer-stories listing: filters (only for fields the data supports), a count, the responsive grid and
 * pagination. Driven entirely by the `stories` it is given, so it scales from a handful to 100+ profiles.
 */
export default function CustomerStoriesBrowser({ stories, searchParams }: CustomerStoriesBrowserProps) {
    const groups = getFilterGroups(stories);
    const filters = parseFilters(searchParams, groups);
    const filtered = applyFilters(stories, filters);
    const slice = paginate(filtered, parsePage(searchParams.page), STORIES_PAGE_SIZE);
    const isFiltered = hasActiveFilters(filters);

    const noun = isFiltered ? "matching stories" : "customer stories";
    const summary = slice.total === 0 ? "No stories found" : slice.pageCount > 1 ? `Showing ${slice.from}–${slice.to} of ${slice.total} ${noun}` : `${slice.total} ${noun}`;

    return (
        <div>
            {groups.length > 0 && <StoryFilters groups={groups} active={filters} />}

            <p className={`${RESULT_COUNT} ${groups.length > 0 ? "mt-4" : ""} mb-5`} aria-live="polite">
                {summary}
            </p>

            {slice.items.length > 0 ? (
                <StoryGrid cards={slice.items.map(toCardData)} />
            ) : (
                <EmptyState title="No stories match these filters" body="Try a different speciality, city or product category.">
                    <Link href={STORIES_PAGE_PATH} className="btn btn-secondary btn-md">
                        Clear filters
                    </Link>
                </EmptyState>
            )}

            <StoryPagination slice={slice} filters={filters} />

            <p className="mt-10 text-center text-[13px] leading-relaxed text-neutral-500">{consentLine(stories)}</p>
        </div>
    );
}
