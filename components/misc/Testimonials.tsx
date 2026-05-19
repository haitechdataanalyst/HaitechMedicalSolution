"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui";
import { StarIcon } from "@/components/icons";
import { Quote } from "lucide-react";

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    location: string;
    rating: number;
    text: string;
    image?: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
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
            <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white shadow-sm">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="truncate text-xs text-neutral-400">
                        {testimonial.role}
                        {testimonial.company ? `, ${testimonial.company}` : ""}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    return (
        <section className="section bg-neutral-50/60">
            <div className="container">
                {/* Section Header */}
                <div className="mb-12 text-center md:mb-14">
                    <span className="label-tag label-tag-primary mb-5 inline-flex">
                        Client Stories
                    </span>
                    <h2 className="heading-2 text-neutral-900 mb-3">Trusted by Dental Professionals</h2>
                    <p className="text-body-lg mx-auto max-w-xl text-neutral-500">
                        Real experiences from clinicians who rely on our products every day.
                    </p>
                </div>

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
