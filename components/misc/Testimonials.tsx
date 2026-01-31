"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui";
import { StarIcon, QuoteIcon } from "@/components/icons";

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

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm md:p-8">
      {/* Quote Icon */}
      <QuoteIcon size={40} className="text-primary-200 mb-4" />

      {/* Rating */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} size={18} className={i < testimonial.rating ? "text-yellow-400" : "text-neutral-200"} filled={i < testimonial.rating} />
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="mb-6 flex-1">
        <p className={`leading-relaxed text-neutral-600 italic ${!isExpanded ? "line-clamp-5" : ""}`}>&ldquo;{testimonial.text}&rdquo;</p>
        {testimonial.text.length > 200 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary-600 hover:text-primary-700 mt-2 cursor-pointer text-sm font-medium transition-colors">
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 text-primary-600 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
          {testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{testimonial.name}</p>
          <p className="text-sm text-neutral-500">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="section bg-neutral-50">
      <div className="container">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="heading-2 text-foreground mb-3">We have Proof !</h2>
          <p className="text-body-lg text-muted mx-auto max-w-2xl">What Our Clients Say About Our Admetec Treatments</p>
        </div>

        <Carousel
          slidesToShow={1}
          gap={24}
          autoPlay
          autoPlayInterval={6000}
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
