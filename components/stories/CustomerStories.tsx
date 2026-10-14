import Link from "next/link";
import type { ReactNode } from "react";
import SectionHeader from "@/components/misc/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getHomepageStorySection } from "@/lib/customer-stories.server";
import { MAX_FEATURED_ON_HOMEPAGE, MIN_FEATURED_ON_HOMEPAGE } from "@/lib/customer-stories";
import { STORIES_PAGE_PATH } from "@/lib/customer-story-listing";
import DevPreviewNotice from "./DevPreviewNotice";
import StoryCard from "./StoryCard";
import type { StackFrom, StoryCardData } from "./StoryCard";
import { consentLine, toCardData } from "./story-view";

const SECTION_TITLE = "Dentists who work with Haitech";
const SECTION_SUBTITLE = "Experiences shared by clinicians who use our equipment.";

// Structural labels only — no names, quotes or faces. Used solely by the development preview.
const PREVIEW_CARDS: StoryCardData[] = Array.from({ length: MIN_FEATURED_ON_HOMEPAGE }, () => ({
    name: "Clinician name",
    speciality: "Speciality",
    city: "City",
    photo: { src: "", alt: "" },
    quote: "The clinician's approved statement appears here, in their own words.",
    product: { label: "product name", href: "/products" },
}));

// Three profiles share the row from `lg`; four sit two-up until `xl` so no card gets cramped.
const GRID = {
    default: { list: "grid gap-4 lg:grid-cols-3 lg:gap-6", stackFrom: "lg" as StackFrom },
    four: { list: "grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-4", stackFrom: "xl" as StackFrom },
} as const;

interface FeaturedStoriesSectionProps {
    cards: StoryCardData[];
    /** Consent / disclosure footnote. */
    footnote?: string;
    /** Development preview only. */
    placeholder?: boolean;
    notice?: ReactNode;
}

/** The section's layout, independent of where the cards come from. */
export function FeaturedStoriesSection({ cards, footnote, placeholder = false, notice }: FeaturedStoriesSectionProps) {
    const grid = cards.length >= MAX_FEATURED_ON_HOMEPAGE ? GRID.four : GRID.default;

    return (
        <section aria-label={SECTION_TITLE} className="bg-white" data-dev-preview={placeholder ? "true" : undefined}>
            <div className="section container">
                {notice}

                <ScrollReveal variant="fade">
                    <SectionHeader title={SECTION_TITLE} subtitle={SECTION_SUBTITLE} />
                </ScrollReveal>

                <ul className={grid.list}>
                    {cards.map((card, index) => (
                        <li key={`${card.id ?? card.name}-${index}`}>
                            <StoryCard story={card} stackFrom={grid.stackFrom} placeholder={placeholder} />
                        </li>
                    ))}
                </ul>

                <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={STORIES_PAGE_PATH} className="btn btn-secondary btn-lg">
                        View all customer stories
                    </Link>
                    {footnote && <p className="max-w-md text-[13px] leading-relaxed text-neutral-500 sm:text-right">{footnote}</p>}
                </div>
            </div>
        </section>
    );
}

/**
 * Homepage section "Dentists who work with Haitech": 3–4 hand-picked (`featured`) profiles and a link to the
 * full customer-stories page. Renders nothing until real, approved stories exist.
 */
export default function CustomerStories() {
    const section = getHomepageStorySection();
    if (section.mode === "hidden") return null;

    if (section.mode === "dev-preview") {
        return (
            <FeaturedStoriesSection
                cards={PREVIEW_CARDS}
                placeholder
                notice={<DevPreviewNotice held={section.held} detail={`Right now: ${section.publishableCount} approved, ${section.featuredCount} of them featured.`} />}
            />
        );
    }

    return <FeaturedStoriesSection cards={section.stories.map(toCardData)} footnote={consentLine(section.stories)} />;
}
