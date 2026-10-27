"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface Chapter {
    id: string;
    label: string;
}

/**
 * A long page needs a way to say where you are and where you can go. This is a segmented control that stays under the
 * site header: it shows the chapter in view and jumps to any other. The chapters themselves are plain sections with an id,
 * so the page works the same without it.
 */
export default function ChapterNav({ chapters }: { chapters: Chapter[] }) {
    const [active, setActive] = useState(chapters[0]?.id ?? "");

    useEffect(() => {
        const sections = chapters.map((chapter) => document.getElementById(chapter.id)).filter((el): el is HTMLElement => el !== null);
        // A chapter counts as current while it crosses a band a little above the middle of the screen.
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
            },
            { rootMargin: "-35% 0px -60% 0px" }
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [chapters]);

    return (
        <nav aria-label="On this page" className="material-bar sticky top-16 z-40">
            <div className="container">
                <ul className="flex [scrollbar-width:none] gap-1.5 overflow-x-auto py-2 md:justify-center [&::-webkit-scrollbar]:hidden">
                    {chapters.map((chapter) => {
                        const isActive = active === chapter.id;
                        return (
                            <li key={chapter.id} className="shrink-0">
                                <a
                                    href={`#${chapter.id}`}
                                    aria-current={isActive ? "location" : undefined}
                                    className={cn(
                                        "focus-visible:outline-primary-500 inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]",
                                        isActive ? "bg-neutral-900/[0.08] text-neutral-900" : "text-neutral-600 hover:bg-neutral-900/[0.05] hover:text-neutral-900"
                                    )}
                                >
                                    {chapter.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
