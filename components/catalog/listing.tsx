// Shared building blocks for catalog listing and vertical-selector pages
// (/products, /catalog, /search, hubs, /inventory, /our-*). They mirror the
// look of components/catalog/CategoryPageClient.tsx so every listing reads as a sibling.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export const PAGE_TITLE = "text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 md:text-5xl";
export const PAGE_SUBTITLE = "mt-3 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg";

/** Pill search field (48px, ring instead of border). Leave room for a leading icon (pl-11) and a clear button (pr-12). */
export const SEARCH_INPUT =
    "focus-visible:ring-primary-500 h-12 w-full rounded-full bg-white pr-12 pl-11 text-[15px] text-neutral-900 ring-1 ring-neutral-900/[0.08] placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 [&::-webkit-search-cancel-button]:hidden";

/** Pill select matching the search field. */
export const PILL_SELECT = "focus-visible:ring-primary-500 h-12 rounded-full bg-white px-4 text-sm font-medium text-neutral-800 ring-1 ring-neutral-900/[0.08] focus:outline-none focus-visible:ring-2";

/** Quiet result counter under a toolbar. */
export const RESULT_COUNT = "text-[13px] text-neutral-500 tabular-nums";

/** Calm product grid: 2 → 3 → 4 columns. */
export const LISTING_GRID = "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4";

const CHIP_BASE =
    "focus-visible:outline-primary-500 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]";

/** Filter chip / toggle (≥44px). Selected = filled dark teal, otherwise a quiet ring. */
export function chipClass(isActive: boolean): string {
    return cn(
        CHIP_BASE,
        isActive ? "bg-primary-800 text-white hover:bg-primary-900" : "bg-white text-neutral-700 ring-1 ring-neutral-900/[0.08] ring-inset hover:bg-neutral-50 hover:text-neutral-900"
    );
}

/** Consistent page header: H1 + optional subtitle, generous top spacing. */
export function PageIntro({ title, subtitle, children, className }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode; className?: string }) {
    return (
        <header className={cn("container pt-10 pb-8 md:pt-16 md:pb-10", className)}>
            <h1 className={PAGE_TITLE}>{title}</h1>
            {subtitle && <p className={PAGE_SUBTITLE}>{subtitle}</p>}
            {children}
        </header>
    );
}

/** Calm empty state on a card surface. */
export function EmptyState({ title, body, children }: { title: string; body?: ReactNode; children?: ReactNode }) {
    return (
        <div className={cn(SURFACE_CARD, "flex flex-col items-center px-6 py-16 text-center md:py-20")}>
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-neutral-900">{title}</h2>
            {body && <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-neutral-500">{body}</p>}
            {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
        </div>
    );
}

const BAR = "rounded-full bg-neutral-900/[0.06]";

/** Loading bar for skeletons. */
export function SkeletonBar({ className }: { className?: string }) {
    return <div aria-hidden="true" className={cn(BAR, className)} />;
}

/** Skeleton matching the listing card: rounded-2xl surface, inner neutral-50 tile, title + link lines. */
export function CardSkeleton() {
    return (
        <div aria-hidden="true" className={cn(SURFACE_CARD, "p-2")}>
            <div className="aspect-square rounded-xl bg-neutral-50" />
            <div className="space-y-2.5 px-2.5 pt-4 pb-3">
                <SkeletonBar className="h-3.5 w-3/4" />
                <SkeletonBar className="h-3 w-1/2" />
                <SkeletonBar className="mt-4 h-3 w-20" />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 8, className = LISTING_GRID }: { count?: number; className?: string }) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

/** Page-header skeleton matching PageIntro. */
export function PageIntroSkeleton({ withSubtitle = true }: { withSubtitle?: boolean }) {
    return (
        <div aria-hidden="true" className="container pt-10 pb-8 md:pt-16 md:pb-10">
            <SkeletonBar className="h-9 w-64 md:h-12 md:w-96" />
            {withSubtitle && <SkeletonBar className="mt-4 h-4 w-72 max-w-full md:w-[28rem]" />}
        </div>
    );
}

/** Thin breadcrumb-bar skeleton. */
export function BreadcrumbSkeleton() {
    return (
        <div aria-hidden="true" className="container flex gap-2 py-3">
            <SkeletonBar className="h-3.5 w-14" />
            <SkeletonBar className="h-3.5 w-24" />
        </div>
    );
}

/** Wraps a loading.tsx body: pulse (motion-safe) + an accessible status label. */
export function LoadingShell({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div role="status" aria-label={label} className="min-h-screen bg-neutral-50/50 motion-safe:animate-pulse">
            {children}
        </div>
    );
}

/** Apple-style "choose your configuration" tile. Selected = 2px primary ring; motion is press-scale only. */
export function selectorTileClass(isSelected: boolean): string {
    return cn(
        "group relative flex w-full flex-col rounded-2xl bg-white p-2 text-left transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 motion-safe:active:scale-[0.985]",
        isSelected ? "ring-2 ring-primary-600" : "ring-1 ring-neutral-900/[0.06] hover:ring-neutral-900/[0.16]"
    );
}

/** Round radio-style indicator for selector tiles. */
export function SelectionMark({ isSelected }: { isSelected: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-out",
                isSelected ? "bg-primary-700 text-white" : "ring-1 ring-neutral-900/[0.2] ring-inset"
            )}
        >
            {isSelected && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </span>
    );
}

/** Small numbered step heading for selector flows. */
export function StepHeading({ step, children, id }: { step: number; children: ReactNode; id?: string }) {
    return (
        <h3 id={id} className="flex items-center gap-3 text-lg font-semibold tracking-[-0.015em] text-neutral-900 md:text-xl">
            <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[13px] font-semibold text-white tabular-nums">
                {step}
            </span>
            {children}
        </h3>
    );
}

/** Section H2 matching components/misc/SectionHeader, for centred section intros. */
export const SECTION_H2 = "text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-balance text-neutral-900 md:text-[2.5rem]";
export const SECTION_LEAD = "mx-auto mt-3 max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg";
