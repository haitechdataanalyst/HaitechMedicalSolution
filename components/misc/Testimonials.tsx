"use client";

import { useState, useEffect } from "react";
import { Carousel } from "@/components/ui";
import { StarIcon } from "@/components/icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import SectionHeader from "./SectionHeader";

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    location: string;
    rating: number;
    text: string;
    image?: string;
    /** Set when this testimonial was fetched live from the Google Places API rather than curated by hand. */
    source?: "google";
    /** Link to the reviewer's Google profile — required for Google review attribution. */
    sourceUrl?: string;
    /** ISO 8601 timestamp from Google — rendered as "4 months ago". */
    publishTime?: string;
}

function relativeTime(iso?: string): string | null {
    if (!iso) return null;
    const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (days < 1) return "Today";
    if (days < 30) return rtf.format(-days, "day");
    const months = Math.round(days / 30);
    if (months < 12) return rtf.format(-months, "month");
    return rtf.format(-Math.round(months / 12), "year");
}

interface TestimonialsProps {
    testimonials: Testimonial[];
    /** Aggregate rating from Google (e.g. 4.9) shown next to the attribution badge, when available. */
    googleRating?: number | null;
    /** Total number of Google reviews the rating is based on. */
    googleReviewCount?: number | null;
}

// Official Google "G" mark — required when displaying content sourced from the Places API.
function GoogleGIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Google's review-photo URLs are best-effort and get rate-limited (429)
    // under repeated hits. A plain server-rendered <img> can fail before React
    // hydrates and attaches its onError listener, silently losing the event
    // and leaving a permanently broken icon — so the load is checked here via
    // a real client-side Image() instead, after mount, and only then is the
    // <img> (or the initials fallback) rendered.
    useEffect(() => {
        if (!testimonial.image) return;
        const img = new window.Image();
        img.onload = () => setImgLoaded(true);
        img.onerror = () => setImgError(true);
        img.src = testimonial.image;
    }, [testimonial.image]);

    const initials = testimonial.name
        .split(" ")
        .map((n) => n[0])
        .join("");
    const timeAgo = relativeTime(testimonial.publishTime);

    return (
        <figure className={`flex h-full flex-col p-6 md:p-7 ${SURFACE_CARD}`}>
            <div className="mb-4 flex gap-0.5" role="img" aria-label={`Rated ${testimonial.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                        key={i}
                        size={15}
                        className={i < testimonial.rating ? "text-amber-400" : "text-neutral-200"}
                        filled={i < testimonial.rating}
                    />
                ))}
            </div>

            <blockquote className="flex-1">
                <p className={`text-[15px] leading-relaxed text-neutral-700 ${!isExpanded ? "line-clamp-5" : ""}`}>
                    &ldquo;{testimonial.text}&rdquo;
                </p>
                {testimonial.text.length > 200 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                        className="-ml-2 mt-1 min-h-11 rounded-full px-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                        {isExpanded ? "Show less" : "Read more"}
                    </button>
                )}
            </blockquote>

            <figcaption className="mt-6 flex items-center justify-between gap-3.5">
                <div className="flex min-w-0 items-center gap-3.5">
                    {testimonial.image && imgLoaded && !imgError ? (
                        // eslint-disable-next-line @next/next/no-img-element -- avatars come from an external, unoptimized source (Google profile photos); a plain img avoids Next/Image config churn for a 40px thumbnail
                        <img
                            src={testimonial.image}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white shadow-sm">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900">{testimonial.name}</p>
                        <p className="truncate text-[13px] text-neutral-500">
                            {testimonial.role}
                            {testimonial.company ? `, ${testimonial.company}` : ""}
                            {timeAgo && ` · ${timeAgo}`}
                        </p>
                    </div>
                </div>

                {/* Google attribution — required whenever content is sourced from the Places API */}
                {testimonial.source === "google" && (
                    <a
                        href={testimonial.sourceUrl ?? "https://www.google.com/maps"}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Posted on Google"
                        aria-label={`View ${testimonial.name}'s review on Google`}
                        className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                        <GoogleGIcon className="h-4 w-4" />
                    </a>
                )}
            </figcaption>
        </figure>
    );
}

export default function Testimonials({ testimonials, googleRating, googleReviewCount }: TestimonialsProps) {
    return (
        <section className="bg-neutral-50">
            <div className="section container">
                <ScrollReveal variant="fade">
                    <SectionHeader
                        title="Trusted by Dental Professionals"
                        subtitle="Real experiences from clinicians who rely on our products every day."
                    >
                        {typeof googleRating === "number" && (
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 ring-1 ring-neutral-900/[0.06]">
                                <GoogleGIcon className="h-4 w-4" />
                                <span className="text-sm font-semibold tabular-nums text-neutral-900">{googleRating.toFixed(1)}</span>
                                <div className="flex gap-0.5" aria-hidden="true">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon key={i} size={12} className={i < Math.round(googleRating) ? "text-amber-400" : "text-neutral-200"} filled={i < Math.round(googleRating)} />
                                    ))}
                                </div>
                                {typeof googleReviewCount === "number" && (
                                    <span className="text-[13px] tabular-nums text-neutral-500">{googleReviewCount} Google reviews</span>
                                )}
                            </div>
                        )}
                    </SectionHeader>
                </ScrollReveal>

                <Carousel
                    slidesToShow={1}
                    gap={20}
                    showDots={true}
                    showArrows={true}
                    arrowVariant="default"
                    responsive={{
                        768: { slidesToShow: 2 },
                        1024: { slidesToShow: 3 },
                    }}
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
