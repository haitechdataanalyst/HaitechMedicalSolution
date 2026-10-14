import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    link?: { href: string; label: string };
    tone?: "light" | "dark";
    /** Extra content under the subtitle, e.g. a rating badge. */
    children?: ReactNode;
}

/** The one section-header pattern for the home page: title, optional subtitle, optional trailing link. */
export default function SectionHeader({ title, subtitle, link, tone = "light", children }: SectionHeaderProps) {
    const isDark = tone === "dark";
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10">
            <div className="max-w-2xl">
                <h2 className={cn("text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.022em] md:text-[2.5rem]", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                {subtitle && <p className={cn("mt-3 text-base leading-relaxed md:text-lg", isDark ? "text-navy-200" : "text-neutral-500")}>{subtitle}</p>}
                {children}
            </div>
            {link && (
                <Link
                    href={link.href}
                    className={cn(
                        "group focus-visible:outline-primary-500 -mr-3 inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-[15px] font-medium focus-visible:outline-2",
                        isDark ? "text-primary-300 hover:text-primary-200" : "text-primary-700 hover:text-primary-800"
                    )}
                >
                    {link.label}
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            )}
        </div>
    );
}
