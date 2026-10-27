"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD } from "@/components/ui/surfaces";

export interface CarouselBrand {
    name: string;
    photo: string;
    logo: string;
    cat: string;
    desc: string;
    href: string;
}

const ARROW =
    "focus-visible:outline-primary-500 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/[0.06] text-neutral-800 transition-[background-color,opacity,transform] duration-200 ease-out hover:bg-neutral-900/[0.1] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-30";

/**
 * The brands as large tiles in a row you swipe or step through, with the next tile showing at the edge so it is clear
 * there is more. It is a plain scrolling list (every tile is a real link), so keyboard, touch and trackpad all work
 * without any extra script; the two arrows only add a step button on larger screens.
 */
export default function BrandCarousel({ brands }: { brands: CarouselBrand[] }) {
    const track = useRef<HTMLUListElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const sync = () => {
        const el = track.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 4);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };

    const step = (direction: 1 | -1) => {
        const el = track.current;
        if (!el) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduced ? "auto" : "smooth" });
    };

    return (
        <div>
            <div className="mb-5 hidden justify-end gap-2 md:flex">
                <button type="button" className={ARROW} onClick={() => step(-1)} disabled={atStart} aria-label="Previous brands">
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button type="button" className={ARROW} onClick={() => step(1)} disabled={atEnd} aria-label="Next brands">
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {/* Bleeds to the screen edge on a phone so the next tile peeks in; the first tile still lines up with the heading. */}
            <ul
                ref={track}
                onScroll={sync}
                className="-mx-[var(--container-padding)] flex snap-x snap-mandatory scroll-pl-[var(--container-padding)] [scrollbar-width:none] gap-4 overflow-x-auto px-[var(--container-padding)] pb-3 md:mx-0 md:scroll-pl-0 md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden"
            >
                {brands.map((brand) => (
                    <li key={brand.name} className="flex w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2.5rem)/3)]">
                        <Link href={brand.href} className={`${INTERACTIVE_CARD} w-full`}>
                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-neutral-50">
                                <Image
                                    src={brand.photo}
                                    alt={`${brand.name} ${brand.cat.toLowerCase()}`}
                                    fill
                                    sizes="(min-width: 768px) 30vw, 78vw"
                                    className="object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-6 md:p-7">
                                <Image src={brand.logo} alt="" width={96} height={40} className="h-8 w-auto self-start object-contain mix-blend-multiply" />
                                <p className="mt-5 text-[13px] font-medium text-neutral-500">{brand.cat}</p>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-700">{brand.desc}</p>
                                <span className="text-primary-700 mt-auto inline-flex items-center gap-1 pt-5 text-[15px] font-medium">
                                    Explore {brand.name}
                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
