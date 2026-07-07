"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui";
import { StarIcon } from "@/components/icons";
import { Quote } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

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

    const initials = testimonial.name
        .split(" ")
        .map((n) => n[0])
        .join("");

    return (
        <div className="flex h-full flex-col rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-100 md:p-8">
            {/* Top row: Quote icon + Stars */}
            <div className="mb-5 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                    <Quote size={20} className="text-primary-500" strokeWidth={2} />
                </div>
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                            key={i}
                            size={15}
                            className={i < testimonial.rating ? "text-amber-400" : "text-neutral-200"}
                            filled={i < testimonial.rating}
                        />
                    ))}
                </div>
            </div>

            {/* Testimonial Text */}
            <div className="mb-6 flex-1">
                <p className={`text-sm leading-relaxed text-neutral-600 ${!isExpanded ? "line-clamp-5" : ""}`}>
                    &ldquo;{testimonial.text}&rdquo;
                </p>
                {testimonial.text.length > 200 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 cursor-pointer text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    >
                        {isExpanded ? "Show less" : "Read more"}
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="mb-5 h-px bg-neutral-100" />

            {/* Author */}
            <div className="flex items-center justify-between gap-3.5">
                <div className="flex min-w-0 items-center gap-3.5">
                    {testimonial.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- avatars come from an external, unoptimized source (Google profile photos); a plain img avoids Next/Image config churn for a 40px thumbnail
                        <img
                            src={testimonial.image}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white shadow-sm">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900">{testimonial.name}</p>
                        <p className="truncate text-xs text-neutral-400">
                            {testimonial.role}
                            {testimonial.company ? `, ${testimonial.company}` : ""}
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
                        className="flex shrink-0 items-center gap-1 rounded-full border border-neutral-100 bg-neutral-50 px-2 py-1 transition-colors hover:border-neutral-200"
                    >
                        <GoogleGIcon className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>
        </div>
    );
}

export default function Testimonials({ testimonials, googleRating, googleReviewCount }: TestimonialsProps) {
    return (
        <section className="section bg-neutral-50/60">
            <div className="container">
                {/* Section Header */}
                <ScrollReveal variant="up">
                    <div className="mb-12 text-center md:mb-14">
                        <span className="label-tag label-tag-primary mb-5 inline-flex">
                            Client Stories
                        </span>
                        <h2 className="heading-2 text-neutral-900 mb-3">Trusted by Dental Professionals</h2>
                        <p className="text-body-lg mx-auto max-w-xl text-neutral-500">
                            Real experiences from clinicians who rely on our products every day.
                        </p>
                        {typeof googleRating === "number" && (
                            <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 shadow-sm">
                                <GoogleGIcon className="h-4 w-4" />
                                <span className="text-sm font-semibold text-neutral-800">{googleRating.toFixed(1)}</span>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon key={i} size={12} className={i < Math.round(googleRating) ? "text-amber-400" : "text-neutral-200"} filled={i < Math.round(googleRating)} />
                                    ))}
                                </div>
                                {typeof googleReviewCount === "number" && (
                                    <span className="text-xs text-neutral-400">({googleReviewCount} Google reviews)</span>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                <Carousel
                    slidesToShow={1}
                    gap={20}
                    autoPlay
                    autoPlayInterval={6500}
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
