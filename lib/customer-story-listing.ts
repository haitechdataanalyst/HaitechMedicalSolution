// Customer stories — listing helpers: filters (only where the data supports them), pagination, URLs.
//
// Pure and dependency-free on purpose: the filter bar is a client component, and importing this module
// must not pull the validation library (lib/customer-stories.ts) into the browser bundle.

import type { CustomerStory } from "./customer-stories";

export const STORIES_PAGE_SIZE = 12;
export const STORIES_PAGE_PATH = "/customer-stories";

// ── Filters: offered only where the real data supports them ────────────────────────────────────

const FILTER_FIELDS = [
    { key: "speciality", label: "Speciality", allLabel: "All specialities", read: (story: CustomerStory) => story.speciality },
    { key: "city", label: "City", allLabel: "All cities", read: (story: CustomerStory) => story.city },
    { key: "category", label: "Product category", allLabel: "All product categories", read: (story: CustomerStory) => story.product?.category },
] as const;

export type FilterKey = (typeof FILTER_FIELDS)[number]["key"];
export type StoryFilters = Partial<Record<FilterKey, string>>;

export interface FilterGroup {
    key: FilterKey;
    label: string;
    /** Text of the "no filter" option, e.g. "All cities". */
    allLabel: string;
    options: { value: string; count: number }[];
}

const normalise = (value: string) => value.trim().toLowerCase();

/** One group per field that has at least two distinct values across the stories — otherwise a filter is pointless. */
export function getFilterGroups(stories: CustomerStory[]): FilterGroup[] {
    const groups: FilterGroup[] = [];
    for (const field of FILTER_FIELDS) {
        const counts = new Map<string, { value: string; count: number }>();
        for (const story of stories) {
            const raw = field.read(story);
            if (!raw) continue;
            const key = normalise(raw);
            const existing = counts.get(key);
            if (existing) existing.count += 1;
            else counts.set(key, { value: raw.trim(), count: 1 });
        }
        if (counts.size >= 2) {
            groups.push({ key: field.key, label: field.label, allLabel: field.allLabel, options: [...counts.values()].sort((a, b) => a.value.localeCompare(b.value)) });
        }
    }
    return groups;
}

type RawParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/** Keeps only filter values that exist in the data, so arbitrary URL input is ignored. */
export function parseFilters(params: RawParams, groups: FilterGroup[]): StoryFilters {
    const filters: StoryFilters = {};
    for (const group of groups) {
        const requested = firstValue(params[group.key]);
        if (!requested) continue;
        const match = group.options.find((option) => normalise(option.value) === normalise(requested));
        if (match) filters[group.key] = match.value;
    }
    return filters;
}

export function applyFilters(stories: CustomerStory[], filters: StoryFilters): CustomerStory[] {
    return stories.filter((story) =>
        FILTER_FIELDS.every((field) => {
            const wanted = filters[field.key];
            if (!wanted) return true;
            const actual = field.read(story);
            return !!actual && normalise(actual) === normalise(wanted);
        })
    );
}

export function hasActiveFilters(filters: StoryFilters): boolean {
    return Object.values(filters).some(Boolean);
}

// ── Pagination ─────────────────────────────────────────────────────────────────────────────────

export interface PageSlice<T> {
    items: T[];
    page: number;
    pageCount: number;
    total: number;
    /** 1-based positions of the first and last item shown (0 when empty). */
    from: number;
    to: number;
}

export function parsePage(value: string | string[] | undefined): number {
    const parsed = Number.parseInt(firstValue(value) ?? "1", 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

/** Out-of-range pages are clamped to the last page rather than showing an empty grid. */
export function paginate<T>(items: T[], requestedPage: number, pageSize: number): PageSlice<T> {
    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, requestedPage), pageCount);
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);
    return { items: slice, page, pageCount, total, from: total === 0 ? 0 : start + 1, to: start + slice.length };
}

export function storiesHref(filters: StoryFilters, page = 1): string {
    const query = new URLSearchParams();
    for (const field of FILTER_FIELDS) {
        const value = filters[field.key];
        if (value) query.set(field.key, value);
    }
    if (page > 1) query.set("page", String(page));
    const text = query.toString();
    return text ? `${STORIES_PAGE_PATH}?${text}` : STORIES_PAGE_PATH;
}

/** Page numbers to show: first, last, and the current page with one neighbour each side; "gap" marks skipped runs. */
export function pageWindow(current: number, pageCount: number): (number | "gap")[] {
    const wanted = new Set([1, pageCount, current - 1, current, current + 1].filter((n) => n >= 1 && n <= pageCount));
    const pages = [...wanted].sort((a, b) => a - b);
    const result: (number | "gap")[] = [];
    pages.forEach((page, index) => {
        if (index > 0 && page - pages[index - 1] > 1) result.push("gap");
        result.push(page);
    });
    return result;
}
