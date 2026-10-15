import type { HubBuyersGuide, HubReview } from "@/lib/hubs";
import { SURFACE_CARD } from "@/components/ui/surfaces";

// Layout templates for content that is supplied later. Both render nothing until the hub definition in lib/hubs.ts
// carries real content, so no placeholder text is ever shown on the live site.

/** A buyer's guide: a titled run of steps, each an H3 with its paragraph. */
export function HubBuyersGuide({ guide }: { guide?: HubBuyersGuide }) {
    if (!guide || guide.steps.length === 0) return null;
    return (
        <section aria-labelledby="buyers-guide-heading" className="bg-white">
            <div className="section container">
                <h2 id="buyers-guide-heading" className="heading-3 text-neutral-900">
                    {guide.title}
                </h2>
                {guide.intro && <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 md:text-lg">{guide.intro}</p>}
                <ol className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
                    {guide.steps.map((step) => (
                        <li key={step.heading} className={`${SURFACE_CARD} p-6 md:p-7`}>
                            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">{step.heading}</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

/** Customer reviews, exactly as given: a quote and who said it. Not marked up as Review schema (see lib/structured-data.ts). */
export function HubReviews({ reviews }: { reviews?: HubReview[] }) {
    if (!reviews || reviews.length === 0) return null;
    return (
        <section aria-labelledby="reviews-heading" className="bg-neutral-50">
            <div className="section container">
                <h2 id="reviews-heading" className="heading-3 text-neutral-900">
                    Reviews
                </h2>
                <ul className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <li key={`${review.author}-${review.text.slice(0, 24)}`} className={`${SURFACE_CARD} p-6 md:p-7`}>
                            <blockquote className="text-[15px] leading-relaxed text-neutral-700">“{review.text}”</blockquote>
                            <p className="mt-4 text-[13px] font-medium text-neutral-900">{review.author}</p>
                            {review.source && <p className="text-[13px] text-neutral-500">{review.source}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
