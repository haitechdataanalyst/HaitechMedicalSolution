"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { iconMap } from "@/lib/icons";
import supportNav from "@/data/support-navigation.json";

interface NavChild {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
}

interface NavSection {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
    children: NavChild[];
}

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

function findActiveSection(pathname: string | null, matchChildPrefix: boolean): NavSection | undefined {
    return supportNav.sections.find((section) => {
        if (pathname === section.path) return true;
        if (pathname?.startsWith(section.path + "/")) return true;
        return section.children?.some((child) => pathname === child.path || (matchChildPrefix && pathname?.startsWith(child.path)));
    });
}

/** One segment of the section switcher. The active segment is a raised white pill on the grey track. */
function MainNavItem({ section, isActive }: { section: NavSection; isActive: boolean }) {
    return (
        <Link
            href={section.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ease-out sm:px-5",
                FOCUS_RING,
                isActive ? "bg-white text-neutral-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)]" : "text-neutral-600 hover:text-neutral-900"
            )}
        >
            {section.title}
        </Link>
    );
}

/** Secondary links inside the active section: quiet text tabs with a teal underline for the current page. */
function ChildNavItem({ child, isActive }: { child: NavChild; isActive: boolean }) {
    return (
        <Link
            href={child.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "relative inline-flex min-h-11 shrink-0 items-center rounded-md text-[15px] whitespace-nowrap transition-colors duration-200 ease-out",
                FOCUS_RING,
                isActive ? "font-medium text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
            )}
        >
            {child.title}
            {isActive && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-700" />}
        </Link>
    );
}

export function SupportNav() {
    const pathname = usePathname();

    // Hide nav on the support root page — it has its own SupportSectionsGrid
    if (pathname === "/support") return null;

    const activeSection = findActiveSection(pathname, true);

    return (
        <nav aria-label="Support navigation" className="w-full">
            {/* Section switcher — a segmented control that scrolls sideways on narrow screens */}
            <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="inline-flex gap-1 rounded-full bg-neutral-900/[0.05] p-1">
                    {supportNav.sections.map((section) => (
                        <MainNavItem key={section.id} section={section} isActive={activeSection?.id === section.id} />
                    ))}
                </div>
            </div>

            {/* Pages within the active section */}
            {activeSection?.children && activeSection.children.length > 0 ? (
                <div className="mt-4 border-b border-neutral-900/[0.08]">
                    <div className="-mx-4 flex gap-6 overflow-x-auto px-4 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden">
                        {activeSection.children.map((child) => (
                            <ChildNavItem key={child.id} child={child} isActive={pathname === child.path || (!child.path.includes("#") && !!pathname?.startsWith(child.path + "/"))} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-6 border-b border-neutral-900/[0.08]" />
            )}
        </nav>
    );
}

export function SupportNavCompact() {
    const pathname = usePathname();
    const activeSection = findActiveSection(pathname, false);

    return (
        <nav aria-label="Support sections" className="flex items-center justify-center gap-2 border-b border-neutral-900/[0.08] py-4 md:gap-3">
            {supportNav.sections.map((section) => {
                const Icon = iconMap[section.icon] || HelpCircle;
                const isActive = activeSection?.id === section.id;

                return (
                    <Link
                        key={section.id}
                        href={section.path}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium transition-colors duration-200 ease-out",
                            FOCUS_RING,
                            isActive ? "bg-primary-50 text-primary-800" : "text-neutral-600 hover:bg-neutral-900/[0.05] hover:text-neutral-900"
                        )}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{section.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default SupportNav;
