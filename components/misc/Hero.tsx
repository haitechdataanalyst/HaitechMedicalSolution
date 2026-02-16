"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Carousel } from "@/components/ui";

const heroSlides = [
  {
    image: "/images/hero/Website.webp",
  },
  {
    image: "/images/hero/Website (1).webp",
  },
  {
    image: "/images/hero/Untitled-design-54.webp",
  },
];

// Static hero content that floats above the carousel
const heroContent = {
  title: "Premium Medical & Dental Equipment",
  description: "Australia's trusted supplier of precision loupes, LED headlights, and professional accessories for healthcare professionals.",
};

export default function Hero() {
  // const overlayContent = (
  //   <div className="flex h-full items-center">
  //     <div className="section-lg container">
  //       <div className="max-w-3xl">
  //         <h1 className="heading-1 animate-fade-in mb-6 text-white">{heroContent.title}</h1>
  //         <p className="text-body-lg text-primary-100 animate-fade-in-delay mb-8">{heroContent.description}</p>
  //         <div className="animate-fade-in-delay-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
  //           <Link href="/products" className="w-full sm:w-auto">
  //             <Button size="lg" className="text-primary-600 w-full bg-white hover:bg-neutral-100 sm:w-auto">
  //               Browse Products
  //             </Button>
  //           </Link>
  //           <Link href="/support/contact" className="w-full sm:w-auto">
  //             <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 sm:w-auto">
  //               Contact Us
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <section className="relative overflow-hidden">
      <Carousel
        autoPlay
        autoPlayInterval={5000}
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
          <div key={index} className="relative h-60 md:h-80 lg:min-h-160">
            {/* Background Image */}
            <div className="bg-primary-gradient absolute inset-0">
              <Image src={slide.image} alt="Hero background" fill className="object-cover opacity-100" priority={index === 0} />
            </div>

            {/* Overlay gradient for better text readability */}
            {/* <div className="from-primary-900/80 via-primary-800/60 absolute inset-0 bg-linear-to-r to-transparent" /> */}
          </div>
        ))}
      </Carousel>
    </section>
  );
}
