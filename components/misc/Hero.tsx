"use client";

import Link from "next/link";
import { Carousel } from "@/components/ui";

const heroSlides = [
    {
        video: "/vids/Website Carousal.mp4",
        href: "/product/admetec",
    },
    {
        video: "/vids/Website Carousal (1).mp4",
        href: "/product/medesy",
    },
    {
        video: "/vids/Website Carousal (2).mp4",
        href: "/product/salli",
    },
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <Carousel
                autoPlay
                autoPlayInterval={8000}
                showArrows={false}
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
                    <Link key={index} href={slide.href} className="block">
                        <div className="relative h-60 md:h-80 lg:min-h-180 xl:min-h-screen overflow-y-hidden">
                            <video src={slide.video} autoPlay loop muted playsInline className="absolute inset-0 w-full object-cover" preload={index === 0 ? "auto" : "metadata"} />
                        </div>
                    </Link>
                ))}
            </Carousel>
        </section>
    );
}
