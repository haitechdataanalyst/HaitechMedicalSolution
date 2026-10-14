"use client";

import { usePathname } from "next/navigation";

// Each support section is titled after the page itself (the same wording as its metadata title), so no two
// pages share one H1. Articles and individual policies render their own <h1>, so the banner there is plain text.
const SECTION_TITLES: Record<string, string> = {
    "/support": "Support",
    "/support/contact": "Contact Us",
    "/support/faq": "Help Center",
    "/support/articles": "Articles",
    "/support/policies": "Policies",
};

const TITLE_CLASS = "text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl";

export function SupportTitle() {
    const pathname = usePathname().replace(/\/$/, "") || "/";
    const title = SECTION_TITLES[pathname];
    return title ? <h1 className={TITLE_CLASS}>{title}</h1> : <p className={TITLE_CLASS}>Support</p>;
}
