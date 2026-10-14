"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Carousel } from "@/components/ui";

// Each slide has three files, all encoded from the 4K originals (public/vids/Website Carousal*.mp4, kept in the repo):
// a poster that shows at once and is the page's LCP image, a 1080p video for wide screens and a 540p one for phones.
// The originals were 3840x2160 with an unused audio track (22.8 MB for the three); these total about 4.1 MB for a wide
// screen and about 1.3 MB for a phone (posters included), and only the slides actually shown are fetched.
const heroSlides = [
    { poster: "/vids/hero-1-poster.jpg", wide: "/vids/hero-1-1080.mp4", narrow: "/vids/hero-1-540.mp4" },
    { poster: "/vids/hero-2-poster.jpg", wide: "/vids/hero-2-1080.mp4", narrow: "/vids/hero-2-540.mp4" },
    { poster: "/vids/hero-3-poster.jpg", wide: "/vids/hero-3-1080.mp4", narrow: "/vids/hero-3-540.mp4" },
];

const WIDE_SCREEN = "(min-width: 768px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// A slide counts as showing once half of it is in view (the carousel clips the others off-screen).
const SHOWING_THRESHOLD = 0.5;

type Slide = (typeof heroSlides)[number];

/** True when the visitor asked for less motion or less data: the poster alone is then the slide. */
function prefersStillImage(): boolean {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    return window.matchMedia(REDUCED_MOTION).matches || saveData;
}

/**
 * One hero slide. The poster is a normal image (preloaded for the first slide), so the slide looks complete before
 * any video byte arrives and stays as the fallback if the video cannot play. The video is attached only after the
 * page has loaded, only when the slide is in view, in the size that suits the screen, and is skipped entirely for
 * visitors who prefer reduced motion or Save-Data. Videos pause while off-screen.
 */
function HeroSlide({ slide, eager }: { slide: Slide; eager: boolean }) {
    const ref = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const video = ref.current;
        if (!video || prefersStillImage()) return;

        // Once attached the file stays, so coming back to a slide does not download it again.
        const attach = () => {
            if (!video.getAttribute("src")) video.src = window.matchMedia(WIDE_SCREEN).matches ? slide.wide : slide.narrow;
        };
        if (eager) attach();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    attach();
                    video.play().catch(() => undefined);
                } else {
                    video.pause();
                }
            },
            { threshold: SHOWING_THRESHOLD }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, [eager, slide]);

    return (
        <>
            <Image src={slide.poster} alt="" fill priority={eager} sizes="100vw" className="object-cover" />
            <video
                ref={ref}
                loop
                muted
                playsInline
                preload="none"
                onPlaying={() => setPlaying(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${playing ? "opacity-100" : "opacity-0"}`}
            />
        </>
    );
}

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
                    <div key={slide.poster} className="xs:h-60 relative h-52 overflow-hidden sm:h-72 md:h-[420px] lg:h-[600px] xl:h-[720px] 2xl:h-[800px]">
                        <HeroSlide slide={slide} eager={index === 0} />

                        {/* Subtle gradient for visual depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
