"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useHeaderNavigation } from "./NavigationProvider";
import { EnhancedNavItem, MegaMenuColumn } from "@/lib/navigation";

interface MegaMenuProps {
    columns: MegaMenuColumn[];
    isOpen: boolean;
    onClose: () => void;
}

const BRAND_LOGOS: Record<string, string> = {
    Admetec: "/BrandLogo/AdmetecLogo.jpeg",
    Almadent: "/BrandLogo/AlmadentLogo.jpeg",
    Medesy: "/BrandLogo/MedesyLogo.jpeg",
    Salli: "/BrandLogo/SalliLogo.jpeg",
    Strauss: "/BrandLogo/StraussLogo.jpeg",
};

const LINKS_MAX = 5;
const CLOSE_DELAY_MS = 150;

const MENU_ROW = "flex min-h-10 items-center gap-2 rounded-xl px-3 text-[15px] transition-colors duration-200 ease-out";

function MegaMenu({ columns, isOpen, onClose }: MegaMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Pin the full-width panel to the bottom edge of the (sticky) header
    useEffect(() => {
        if (!isOpen) return;
        const updatePosition = () => {
            if (!containerRef.current) return;
            const header = document.querySelector("header");
            containerRef.current.style.top = `${header?.getBoundingClientRect().bottom ?? 110}px`;
        };
        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div ref={containerRef} className="fixed right-0 left-0 z-50" style={{ top: "110px" }}>
            <div className="material-bar animate-popover-in shadow-[0_1px_0_rgba(15,23,42,0.08),0_24px_48px_-24px_rgba(15,23,42,0.25)]">
                <div className="container grid grid-cols-5 gap-6 py-8">
                    {columns.map((column) => {
                        const logo = BRAND_LOGOS[column.title];
                        const featuredItem = column.items[0];
                        const linkItems = column.items.slice(1, 1 + LINKS_MAX);
                        const extraCount = Math.max(0, column.items.length - 1 - LINKS_MAX);
                        const hasItems = column.items.length > 0;

                        return (
                            <div key={column.href} className="flex flex-col">
                                <Link href={column.href} onClick={onClose} className="group mb-3 flex items-center gap-2.5">
                                    {logo && (
                                        <div className="relative h-6 w-12 shrink-0">
                                            <Image src={logo} alt="" fill className="object-contain mix-blend-multiply" sizes="48px" />
                                        </div>
                                    )}
                                    <span className="group-hover:text-primary-800 text-[15px] font-semibold tracking-[-0.01em] text-neutral-900 transition-colors">{column.title}</span>
                                </Link>

                                {hasItems ? (
                                    <div className="flex flex-1 flex-col">
                                        {featuredItem && (
                                            <Link
                                                href={featuredItem.href}
                                                onClick={onClose}
                                                className="group mb-2 flex items-center gap-3 rounded-2xl bg-neutral-900/[0.04] p-2.5 transition-colors duration-200 ease-out hover:bg-neutral-900/[0.07]"
                                            >
                                                {featuredItem.image && (
                                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">
                                                        <Image src={featuredItem.image} alt="" fill className="object-contain p-1 mix-blend-multiply" sizes="44px" />
                                                    </div>
                                                )}
                                                <p className="min-w-0 flex-1 text-sm leading-snug font-semibold text-neutral-900">
                                                    <span className="line-clamp-2">{featuredItem.label}</span>
                                                </p>
                                            </Link>
                                        )}

                                        <ul className="-mx-3 flex-1">
                                            {linkItems.map((item) => (
                                                <li key={item.href}>
                                                    <Link href={item.href} onClick={onClose} className={cn(MENU_ROW, "text-neutral-600 hover:bg-neutral-900/[0.05] hover:text-neutral-900")}>
                                                        <span className="truncate">{item.label}</span>
                                                        {item.isNew && <span className="bg-primary-50 text-primary-800 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold">New</span>}
                                                    </Link>
                                                </li>
                                            ))}
                                            {extraCount > 0 && (
                                                <li>
                                                    <Link href={column.href} onClick={onClose} className={cn(MENU_ROW, "text-sm text-neutral-500 hover:text-neutral-900")}>
                                                        +{extraCount} more
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-neutral-500">{column.description ?? "Browse our full range of products."}</p>
                                )}

                                <div className="mt-3 flex items-center justify-between">
                                    {column.aboutLink && (
                                        <Link href={column.aboutLink.href} onClick={onClose} className="flex min-h-10 items-center text-sm text-neutral-500 transition-colors hover:text-neutral-900">
                                            {column.aboutLink.label}
                                        </Link>
                                    )}
                                    <Link
                                        href={column.href}
                                        onClick={onClose}
                                        className="group text-primary-700 hover:text-primary-800 ml-auto flex min-h-10 items-center gap-1 text-sm font-medium transition-colors"
                                    >
                                        View all
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface SimpleDropdownProps {
    items: EnhancedNavItem[];
    isOpen: boolean;
    onClose: () => void;
}

/** Anchored popover: grows out of its trigger, translucent material, 40px rows. */
function SimpleDropdown({ items, isOpen, onClose }: SimpleDropdownProps) {
    const pathname = usePathname();
    return (
        <div
            className={cn(
                "absolute top-full left-0 z-50 origin-top-left pt-2 transition-[opacity,transform] duration-200 ease-out",
                isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"
            )}
        >
            <ul className="material-popover min-w-[240px] p-1.5">
                {items.map((child) => {
                    const isCurrent = pathname === child.href;
                    return (
                        <li key={child.href}>
                            <Link
                                href={child.href}
                                aria-current={isCurrent ? "page" : undefined}
                                tabIndex={isOpen ? undefined : -1}
                                className={cn(MENU_ROW, isCurrent ? "text-primary-800 font-medium" : "text-neutral-700 hover:bg-neutral-900/[0.05] hover:text-neutral-900")}
                                onClick={onClose}
                            >
                                {child.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function Navigation({ standalone = false }: { standalone?: boolean }) {
    const items = useHeaderNavigation();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cancelClose = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const open = useCallback(
        (href: string) => {
            cancelClose();
            setOpenDropdown(href);
        },
        [cancelClose]
    );

    const scheduleClose = useCallback(() => {
        timeoutRef.current = setTimeout(() => setOpenDropdown(null), CLOSE_DELAY_MS);
    }, []);

    const handleClose = useCallback(() => setOpenDropdown(null), []);

    // Keyboard users: leaving the whole menu group with Tab closes it
    const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenDropdown(null);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Escape") return;
        setOpenDropdown(null);
        (e.currentTarget.querySelector("a") as HTMLAnchorElement | null)?.focus();
    }, []);

    useEffect(() => cancelClose, [cancelClose]);

    return (
        <nav aria-label="Main" className={cn("relative items-stretch gap-0", standalone ? "flex" : "hidden md:flex")}>
            {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const hasMegaMenu = item.megaMenu && item.megaMenu.length > 0;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openDropdown === item.href;

                const linkClass = cn(
                    "flex items-center px-3 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-200 ease-out",
                    isActive || isOpen ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
                );

                if (hasMegaMenu || hasChildren) {
                    return (
                        <div
                            key={item.href}
                            className="relative flex items-stretch"
                            onMouseEnter={() => open(item.href)}
                            onMouseLeave={scheduleClose}
                            onFocus={() => open(item.href)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        >
                            <Link href={item.href} aria-haspopup="true" aria-expanded={isOpen} aria-current={isActive ? "page" : undefined} className={cn(linkClass, "gap-1")}>
                                {item.label}
                                <ChevronDown aria-hidden="true" className={cn("h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ease-out", isOpen && "rotate-180")} />
                            </Link>
                            {hasMegaMenu ? (
                                <MegaMenu columns={item.megaMenu!} isOpen={isOpen} onClose={handleClose} />
                            ) : (
                                hasChildren && <SimpleDropdown items={item.children!} isOpen={isOpen} onClose={handleClose} />
                            )}
                        </div>
                    );
                }

                return (
                    <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={linkClass}>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
