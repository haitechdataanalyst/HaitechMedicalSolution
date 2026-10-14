"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavLink {
    label: string;
    href: string;
}

/** Tracks which same-page section is currently under the sticky bars. */
function useActiveSection(links: SectionNavLink[]): string | null {
    const [active, setActive] = useState<string | null>(null);
    const ids = links.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1));
    const key = ids.join(",");

    useEffect(() => {
        const targets = key
            .split(",")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (targets.length === 0) return;

        // A section is "active" once its top crosses the band just below the sticky header + nav.
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: "-120px 0px -55% 0px" }
        );
        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [key]);

    return active;
}

/**
 * Desktop-only in-page navigation that sticks under the site header. Links
 * are plain anchors: same-page hashes also open a collapsed section (see
 * useExpandable), and off-page links (e.g. a hub comparison) navigate normally.
 * Its height must match --section-nav-h in globals.css.
 */
export default function ProductSectionNav({ links }: { links: SectionNavLink[] }) {
    const active = useActiveSection(links);
    if (links.length === 0) return null;

    return (
        <nav aria-label="Product sections" className="material-bar sticky top-[var(--site-header-h)] z-30 -mx-4 mb-8 hidden h-[var(--section-nav-h)] border-b border-neutral-900/[0.06] px-4 lg:block">
            <ul className="flex h-full items-center gap-1 text-[13px] font-medium">
                {links.map((link) => {
                    const isActive = link.href === `#${active}`;
                    return (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                aria-current={isActive ? "location" : undefined}
                                className={cn(
                                    "focus-visible:outline-primary-500 inline-flex h-8 items-center rounded-full px-3.5 transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                                    isActive ? "bg-neutral-900/[0.06] text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
                                )}
                            >
                                {link.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
