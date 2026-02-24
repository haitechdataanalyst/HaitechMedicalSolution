"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Headset, LifeBuoy, FileCheck, Mail, Phone, MessageCircle, Info, PlaySquare, HelpCircle, FileText, GitCompare, Shield, BadgeCheck, RotateCcw, LucideIcon } from "lucide-react";
import supportNav from "@/data/support-navigation.json";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Headset,
    LifeBuoy,
    FileCheck,
    Mail,
    Phone,
    MessageCircle,
    Info,
    PlaySquare,
    HelpCircle,
    FileText,
    GitCompare,
    Shield,
    BadgeCheck,
    RotateCcw,
};

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

function NavIcon({ iconName, isActive, size = "lg" }: { iconName: string; isActive: boolean; size?: "sm" | "lg" }) {
    const Icon = iconMap[iconName] || HelpCircle;
    const sizeClasses = size === "lg" ? "w-12 h-12" : "w-8 h-8";
    const iconSizeClasses = size === "lg" ? "w-6 h-6" : "w-4 h-4";

    return (
        <div
            className={cn(
                sizeClasses,
                "flex items-center justify-center rounded-full transition-all duration-300 ease-out",
                "group-hover:scale-110 group-hover:shadow-lg",
                isActive ? "bg-primary-500 text-white shadow-md" : "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
            )}
        >
            <Icon className={cn(iconSizeClasses, "transition-transform duration-300", "group-hover:scale-110")} />
        </div>
    );
}

function MainNavItem({ section, isActive }: { section: NavSection; isActive: boolean }) {
    return (
        <Link
            href={section.path}
            className={cn("group flex flex-col items-center rounded-xl px-6 py-4 text-center transition-all duration-300", "hover:bg-surface-secondary", isActive && "bg-transparent")}
        >
            <NavIcon iconName={section.icon} isActive={isActive} />
            <span className={cn("mt-3 text-base font-semibold transition-colors duration-200", isActive ? "text-foreground" : "text-muted group-hover:text-foreground")}>{section.title}</span>
            {isActive && <div className="bg-primary-500 mt-2 h-0.5 w-12 rounded-full" />}
        </Link>
    );
}

function ChildNavItem({ child, isActive }: { child: NavChild; isActive: boolean }) {
    const Icon = iconMap[child.icon] || HelpCircle;

    return (
        <Link href={child.path} className={cn("group flex flex-col items-center rounded-lg px-4 py-3 text-center transition-all duration-200", "hover:bg-primary-50", isActive && "bg-primary-50")}>
            <div
                className={cn(
                    "mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                    "border-2 border-neutral-200 bg-white",
                    "group-hover:border-primary-300 group-hover:scale-105 group-hover:shadow-md",
                    isActive && "border-primary-400 shadow-sm"
                )}
            >
                <Icon className={cn("h-5 w-5 transition-all duration-200", "group-hover:text-primary-600 text-neutral-500", isActive && "text-primary-600")} />
            </div>
            <span className={cn("text-sm font-medium transition-colors duration-200", "text-muted group-hover:text-foreground", isActive && "text-foreground")}>{child.title}</span>
        </Link>
    );
}

export function SupportNav() {
    const pathname = usePathname();

    // Determine active section
    const activeSection = supportNav.sections.find((section) => {
        if (pathname === section.path) return true;
        if (pathname?.startsWith(section.path + "/")) return true;
        return section.children?.some((child) => pathname === child.path || pathname?.startsWith(child.path));
    });

    return (
        <div className="w-full">
            {/* Main Navigation */}
            <div className="flex items-center justify-center gap-4 py-6 md:gap-8 lg:gap-16">
                {supportNav.sections.map((section) => (
                    <MainNavItem key={section.id} section={section} isActive={activeSection?.id === section.id} />
                ))}
            </div>

            {/* Separator */}
            <div className="w-full border-b border-neutral-200" />

            {/* Child Navigation - Only show if section has children */}
            {activeSection && activeSection.children && activeSection.children.length > 0 && (
                <div className="py-8">
                    {/* Section Title */}
                    <div className="mb-6 text-center">
                        <h1 className="heading-1 mb-2">{activeSection.title}</h1>
                        <p className="text-muted">{activeSection.description}</p>
                    </div>

                    {/* Child Items */}
                    <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12 lg:gap-16">
                        {activeSection.children.map((child) => (
                            <ChildNavItem key={child.id} child={child} isActive={pathname === child.path} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function SupportNavCompact() {
    const pathname = usePathname();

    const activeSection = supportNav.sections.find((section) => {
        if (pathname === section.path) return true;
        if (pathname?.startsWith(section.path + "/")) return true;
        return section.children?.some((child) => pathname === child.path);
    });

    return (
        <div className="flex items-center justify-center gap-2 border-b border-neutral-200 py-4 md:gap-4">
            {supportNav.sections.map((section) => {
                const Icon = iconMap[section.icon] || HelpCircle;
                const isActive = activeSection?.id === section.id;

                return (
                    <Link
                        key={section.id}
                        href={section.path}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                            isActive ? "bg-primary-50 text-primary-700" : "text-muted hover:text-foreground hover:bg-neutral-100"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{section.title}</span>
                    </Link>
                );
            })}
        </div>
    );
}

export default SupportNav;
