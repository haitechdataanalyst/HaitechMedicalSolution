"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PILL_SELECT } from "@/components/catalog/listing";
import { STORIES_PAGE_PATH, hasActiveFilters, storiesHref } from "@/lib/customer-story-listing";
import type { FilterGroup, FilterKey, StoryFilters as Filters } from "@/lib/customer-story-listing";

interface StoryFiltersProps {
    groups: FilterGroup[];
    active: Filters;
}

/**
 * Filter bar. Only the groups the data supports are passed in. Changing a filter navigates to a shareable URL
 * (and back to page 1); without JavaScript the same form works as a plain GET with an Apply button.
 */
export default function StoryFilters({ groups, active }: StoryFiltersProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [shown, setShown] = useOptimistic(active);

    const change = (key: FilterKey, value: string) => {
        const next: Filters = { ...shown, [key]: value || undefined };
        startTransition(() => {
            setShown(next);
            router.push(storiesHref(next), { scroll: false });
        });
    };

    return (
        <form method="get" action={STORIES_PAGE_PATH} aria-busy={isPending} className="flex flex-wrap items-center gap-3">
            {groups.map((group) => (
                <div key={group.key}>
                    <label htmlFor={`story-filter-${group.key}`} className="sr-only">
                        {group.label}
                    </label>
                    <select
                        id={`story-filter-${group.key}`}
                        name={group.key}
                        value={shown[group.key] ?? ""}
                        onChange={(event) => change(group.key, event.target.value)}
                        className={`${PILL_SELECT} max-w-full`}
                    >
                        <option value="">{group.allLabel}</option>
                        {group.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.value} ({option.count})
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <noscript>
                <button type="submit" className="btn btn-primary btn-md">
                    Apply filters
                </button>
            </noscript>

            {hasActiveFilters(shown) && (
                <Link
                    href={STORIES_PAGE_PATH}
                    scroll={false}
                    className="text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-medium focus-visible:outline-2"
                >
                    Clear filters
                </Link>
            )}
        </form>
    );
}
