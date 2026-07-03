"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
    itemHref: string;
}

const BRAND_LOGOS: Record<string, string> = {
    Admetec: "/BrandLogo/AdmetecLogo.jpeg",
    Almadent: "/BrandLogo/AlmadentLogo.jpeg",
    Medesy: "/BrandLogo/MedesyLogo.jpeg",
    Salli: "/BrandLogo/SalliLogo.jpeg",
    Strauss: "/BrandLogo/StraussLogo.jpeg",
};

const LINKS_MAX = 5;

function MegaMenu({ columns, isOpen, onClose, itemHref }: MegaMenuProps) {
    const triangleRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const updatePosition = () => {
            const triggerElement = document.querySelector(`[data-nav-href="${itemHref}"]`);
            if (triggerElement && triangleRef.current) {
                const rect = triggerElement.getBoundingClientRect();
                triangleRef.current.style.left = `${rect.left + rect.width / 2}px`;
            }
            if (containerRef.current) {
                const header = document.querySelector("header");
                const bottom = header?.getBoundingClientRect().bottom ?? 110;
                containerRef.current.style.top = `${bottom}px`;
            }
        };
        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, itemHref]);

    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className="fixed left-0 right-0 z-50"
            style={{ top: "110px" }}
        >
            <div
                ref={triangleRef}
                className="absolute -translate-x-1/2"
                style={{ left: "50%", top: -8, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid white", filter: "drop-shadow(0 -1px 2px rgb(0 0 0/0.06))" }}
            />
            <div className="border-t border-neutral-100 bg-white shadow-2xl">
                <div className="grid w-full grid-cols-5">
                    {columns.map((column, idx) => {
                        const logo = BRAND_LOGOS[column.title];
                        const featuredItem = column.items[0];
                        const linkItems = column.items.slice(1, 1 + LINKS_MAX);
                        const extraCount = Math.max(0, column.items.length - 1 - LINKS_MAX);
                        const hasItems = column.items.length > 0;

                        return (
                            <div
                                key={column.href}
                                className={cn(
                                    "flex flex-col px-5 py-5",
                                    idx < columns.length - 1 && "border-r border-neutral-100"
                                )}
                            >
                                {/* ── Brand header ── */}
                                <Link href={column.href} onClick={onClose} className="group mb-4 flex items-center gap-2.5">
                                    {logo && (
                                        <div className="relative h-6 w-12 shrink-0">
                                            <Image src={logo} alt={column.title} fill className="object-contain" sizes="48px" />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-neutral-800 transition-colors group-hover:text-primary-600">
                                        {column.title}
                                    </span>
                                </Link>

                                {hasItems ? (
                                    <div className="flex flex-1 flex-col">
                                        {/* ── Featured item ── */}
                                        {featuredItem && (
                                            <Link
                                                href={featuredItem.href}
                                                onClick={onClose}
                                                className="group mb-3 flex items-center gap-2.5 rounded-xl bg-neutral-50 p-2.5 transition-all duration-150 hover:bg-primary-50 hover:shadow-sm"
                                            >
                                                {featuredItem.image && (
                                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
                                                        <Image
                                                            src={featuredItem.image}
                                                            alt={featuredItem.label}
                                                            fill
                                                            className="mix-blend-multiply object-contain p-1"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-bold text-neutral-800 transition-colors group-hover:text-primary-700">
                                                        {featuredItem.label}
                                                    </p>
                                                    <span className="mt-0.5 text-[10px] font-semibold text-amber-600">⭐ Popular</span>
                                                </div>
                                            </Link>
                                        )}

                                        {/* ── Category links ── */}
                                        <ul className="flex-1 space-y-1.5">
                                            {linkItems.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={onClose}
                                                        className="group flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-primary-600"
                                                    >
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-300 transition-colors group-hover:bg-primary-400" />
                                                        <span className="truncate">{item.label}</span>
                                                        {item.isNew && (
                                                            <span className="shrink-0 rounded bg-primary-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                                New
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                            {extraCount > 0 && (
                                                <li>
                                                    <Link
                                                        href={column.href}
                                                        onClick={onClose}
                                                        className="text-xs font-medium text-neutral-400 transition-colors hover:text-primary-600"
                                                    >
                                                        +{extraCount} more
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    /* ── Empty brand (e.g. Salli) ── show description blurb ── */
                                    <p className="flex-1 text-xs leading-relaxed text-neutral-500 line-clamp-4">
                                        {column.description ?? "Browse our full range of products."}
                                    </p>
                                )}

                                {/* ── Footer ── */}
                                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                                    {column.aboutLink && (
                                        <Link
                                            href={column.aboutLink.href}
                                            onClick={onClose}
                                            className="text-xs text-neutral-400 transition-colors hover:text-primary-600"
                                        >
                                            {column.aboutLink.label}
                                        </Link>
                                    )}
                                    <Link
                                        href={column.href}
                                        onClick={onClose}
                                        className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                                    >
                                        View All
                                        <ArrowRight className="h-3 w-3" />
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

function SimpleDropdown({ items, isOpen, onClose }: SimpleDropdownProps) {
    const pathname = usePathname();
    return (
        <div className={cn("absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2 transition-all duration-200", isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -7, width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "7px solid white" }} />
            <div className="bg-surface min-w-[200px] rounded-xl border border-neutral-100 py-1.5 shadow-xl">
                {items.map((child) => (
                    <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                            "block px-4 py-2 text-sm transition-colors",
                            pathname === child.href
                                ? "text-primary-600 bg-primary-50 font-medium"
                                : "hover:text-primary-600 hover:bg-neutral-50 text-neutral-700"
                        )}
                        onClick={onClose}
                    >
                        {child.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function Navigation({ standalone = false }: { standalone?: boolean }) {
    const items = useHeaderNavigation();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = useCallback((href: string) => {
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setOpenDropdown(href);
    }, []);

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
    }, []);

    const handleClose = useCallback(() => setOpenDropdown(null), []);

    useEffect(() => { return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; }, []);

    return (
        <nav className={cn("relative items-stretch gap-0", standalone ? "flex" : "hidden md:flex")}>
            {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const hasMegaMenu = item.megaMenu && item.megaMenu.length > 0;
                const hasChildren = item.children && item.children.length > 0;
                const isOpen = openDropdown === item.href;

                const linkClass = cn(
                    "flex items-center px-3.5 text-sm font-semibold border-b-2 transition-all duration-150",
                    isActive
                        ? "border-primary-500 text-primary-700"
                        : "border-transparent text-neutral-600 hover:border-primary-400 hover:text-primary-700"
                );

                if (hasMegaMenu || hasChildren) {
                    return (
                        <div
                            key={item.href}
                            className="relative flex items-stretch"
                            onMouseEnter={() => handleMouseEnter(item.href)}
                            onMouseLeave={handleMouseLeave}
                            data-nav-href={item.href}
                        >
                            <Link href={item.href} className={cn(linkClass, "gap-1.5")}>
                                {item.label}
                                <ChevronDown
                                    className={cn(
                                        "h-3.5 w-3.5 transition-transform duration-200",
                                        isOpen && "rotate-180"
                                    )}
                                />
                            </Link>
                            {hasMegaMenu ? (
                                <MegaMenu columns={item.megaMenu!} isOpen={isOpen} onClose={handleClose} itemHref={item.href} />
                            ) : (
                                hasChildren && <SimpleDropdown items={item.children!} isOpen={isOpen} onClose={handleClose} />
                            )}
                        </div>
                    );
                }

                return (
                    <Link key={item.href} href={item.href} className={linkClass}>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
