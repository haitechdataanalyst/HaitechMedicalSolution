import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SURFACE_CARD } from "@/components/ui/surfaces";

export interface StoryCardData {
    /** Anchor for sharing a single profile on the listing page (#story-<id>). */
    id?: string;
    name: string;
    speciality: string;
    city: string;
    clinic?: string;
    photo: { src: string; alt: string };
    quote: string;
    product?: { label: string; href: string };
    /** Shown only when there is a material connection to disclose (never for "none"). */
    disclosure?: string;
}

/** From which breakpoint the card switches from a compact row to a portrait-over-text card. */
export type StackFrom = "sm" | "lg" | "xl";

// Literal class strings so Tailwind can see them. Rows below the breakpoint, portrait cards from it.
const LAYOUT: Record<StackFrom, { card: string; body: string; quote: string; sizes: string }> = {
    sm: {
        card: "sm:block sm:p-2",
        body: "sm:px-3 sm:pt-4 sm:pb-3",
        quote: "sm:mt-4 sm:text-base",
        sizes: "(min-width: 1280px) 300px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 96px",
    },
    lg: {
        card: "md:grid-cols-[7rem_1fr] md:gap-5 lg:block lg:p-2",
        body: "lg:px-3 lg:pt-4 lg:pb-3",
        quote: "lg:mt-4 lg:text-[17px]",
        sizes: "(min-width: 1024px) 400px, (min-width: 768px) 112px, 96px",
    },
    xl: {
        card: "md:grid-cols-[7rem_1fr] md:gap-5 xl:block xl:p-2",
        body: "xl:px-3 xl:pt-4 xl:pb-3",
        quote: "xl:mt-4 xl:text-base",
        sizes: "(min-width: 1280px) 300px, (min-width: 768px) 112px, 96px",
    },
};

interface StoryCardProps {
    story: StoryCardData;
    stackFrom?: StackFrom;
    /** Development preview only: draws a labelled empty tile instead of a photograph. */
    placeholder?: boolean;
}

/**
 * One clinician profile. A compact row (portrait left, text right) on small screens, an editorial
 * portrait-over-text card from `stackFrom`. Presentational only — all content comes from the data file.
 */
export default function StoryCard({ story, stackFrom = "lg", placeholder = false }: StoryCardProps) {
    const layout = LAYOUT[stackFrom];

    return (
        <article id={story.id ? `story-${story.id}` : undefined} className={`${SURFACE_CARD} grid h-full scroll-mt-28 grid-cols-[6rem_1fr] gap-4 p-3 ${layout.card}`}>
            <div className="relative aspect-[4/5] self-start overflow-hidden rounded-xl bg-neutral-100">
                {placeholder ? (
                    <span className="absolute inset-0 flex items-center justify-center text-[13px] text-neutral-500">Photograph</span>
                ) : (
                    <Image src={story.photo.src} alt={story.photo.alt} fill sizes={layout.sizes} className="object-cover object-top" />
                )}
            </div>

            <div className={`min-w-0 ${layout.body}`}>
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{story.name}</h2>
                <p className="mt-0.5 text-[15px] leading-snug text-neutral-600">
                    {story.speciality} · {story.city}
                </p>
                {story.clinic && <p className="mt-0.5 text-[13px] text-neutral-500">{story.clinic}</p>}

                <blockquote className={`mt-3 text-[15px] leading-relaxed text-neutral-700 ${layout.quote}`}>&ldquo;{story.quote}&rdquo;</blockquote>

                {story.product && (
                    <Link
                        href={story.product.href}
                        className="group text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 mt-2 -ml-1 inline-flex min-h-11 items-center gap-1 rounded-full px-1 text-[15px] font-medium focus-visible:outline-2"
                    >
                        Uses {story.product.label}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                )}

                {story.disclosure && <p className="mt-1 text-[13px] leading-snug text-neutral-500">{story.disclosure}</p>}
            </div>
        </article>
    );
}
