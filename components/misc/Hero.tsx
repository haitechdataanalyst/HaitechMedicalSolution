"use client";

import { Carousel } from "@/components/ui";

const heroSlides = [
    { video: "/vids/Website Carousal.mp4" },
    { video: "/vids/Website Carousal (1).mp4" },
    { video: "/vids/Website Carousal (2).mp4" },
];

export default function Hero() {
    return (
        <section>
            <Carousel
                autoPlay
                autoPlayInterval={8000}
                showArrows={true}
                showDots
                loop
                slidesToShow={1}
                gap={0}
                arrowVariant="ghost"
                arrowSize="lg"
                noPadding
                dotsPosition="inside"
                className="hero-carousel"
            >
                {heroSlides.map((slide, index) => (
                    <div key={index} className="relative h-64 overflow-hidden md:h-96 lg:h-[680px] xl:min-h-screen">
                        {/* Video */}
                        <video
                            src={slide.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                            preload={index === 0 ? "auto" : "metadata"}
                        />

                        {/* Subtle gradient for visual depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
