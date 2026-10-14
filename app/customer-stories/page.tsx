import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { PageIntro } from "@/components/catalog/listing";
import { PILL_PRIMARY } from "@/components/ui/surfaces";
import CustomerStoriesBrowser from "@/components/stories/CustomerStoriesBrowser";
import DevPreviewNotice from "@/components/stories/DevPreviewNotice";
import StoryGrid from "@/components/stories/StoryGrid";
import type { StoryCardData } from "@/components/stories/StoryCard";
import { getStoriesPageState } from "@/lib/customer-stories.server";
import { STORIES_PAGE_PATH } from "@/lib/customer-story-listing";
import { getDynamicMetadata } from "@/lib/metadata";

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const TITLE = "Customer Stories";
const DESCRIPTION = "Dentists across India share their experience with Haitech dental equipment and service.";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    // Filtered and paginated views are not separate pages for search engines; they all canonicalise to the base page.
    const isVariant = Object.keys(params).length > 0;
    return getDynamicMetadata(TITLE, DESCRIPTION, { path: STORIES_PAGE_PATH, noindex: isVariant });
}

// Structural labels only — no names, quotes or faces. Used solely by the development preview.
const PREVIEW_CARDS: StoryCardData[] = Array.from({ length: 8 }, () => ({
    name: "Clinician name",
    speciality: "Speciality",
    city: "City",
    photo: { src: "", alt: "" },
    quote: "The clinician's approved statement appears here, in their own words.",
    product: { label: "product name", href: "/products" },
}));

export default async function CustomerStoriesPage({ searchParams }: PageProps) {
    const state = getStoriesPageState();
    // Production shows a 404 until enough stories are approved — the page must not exist before then.
    if (state.mode === "hidden") notFound();

    const params = await searchParams;

    return (
        <>
            <Breadcrumbs
                items={[
                    { name: "Home", path: "/" },
                    { name: TITLE, path: STORIES_PAGE_PATH },
                ]}
            />

            <PageIntro title="Customer stories" subtitle="Dentists across India share their experience with Haitech equipment and service." />

            <section className="container pb-16 md:pb-24" data-dev-preview={state.mode === "dev-preview" ? "true" : undefined}>
                {state.mode === "dev-preview" ? (
                    <>
                        <DevPreviewNotice held={state.held} />
                        <StoryGrid cards={PREVIEW_CARDS} placeholder />
                    </>
                ) : (
                    <CustomerStoriesBrowser stories={state.stories} searchParams={params} />
                )}
            </section>

            <section className="bg-neutral-50">
                <div className="section container text-center">
                    <h2 className="mx-auto max-w-2xl text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">See it in your own clinic</h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-500 md:text-lg">Book a demo or a loupe fitting and try the equipment yourself.</p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/book-demo" className={PILL_PRIMARY}>
                            Book a demo
                        </Link>
                        <Link href="/book-loupe-fitting" className="btn btn-secondary btn-lg">
                            Book a loupe fitting
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
