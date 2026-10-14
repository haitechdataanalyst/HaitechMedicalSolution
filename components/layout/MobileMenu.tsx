"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons";
import { EnhancedNavItem } from "@/lib/navigation";
import { ChevronDown } from "lucide-react";
import { COMMERCE_ENABLED } from "@/lib/config";
import { PILL_PRIMARY } from "@/components/ui/surfaces";

interface MobileMenuProps {
    items: EnhancedNavItem[];
    isOpen: boolean;
    onClose: () => void;
}

const ROW = "flex min-h-12 flex-1 items-center rounded-xl px-3 transition-colors duration-200";
const ROW_ACTIVE = "text-primary-800 bg-primary-50";
const ROW_IDLE = "text-neutral-900 hover:bg-neutral-900/[0.05]";
const SUB_ROW = "flex min-h-11 items-center rounded-xl px-3 text-[15px] transition-colors duration-200";
const SUB_IDLE = "text-neutral-600 hover:bg-neutral-900/[0.05] hover:text-neutral-900";
const DISCLOSURE = "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-900/[0.05] hover:text-neutral-900";

const subscribeNoop = () => () => {};

function Chevron({ open }: { open: boolean }) {
    return <ChevronDown className={cn("h-5 w-5 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    // Portal target only exists on the client; the header's backdrop-filter would otherwise trap position:fixed.
    const isClient = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    // Prevent body scroll when menu is open; move focus in, and give it back to the trigger on close
    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);
        return () => {
            window.clearTimeout(focusTimer);
            document.body.style.overflow = "";
            previouslyFocused?.focus?.();
        };
    }, [isOpen]);

    // Focus trap — keep Tab/Shift+Tab inside the panel
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab") return;
            const panel = panelRef.current;
            if (!panel) return;
            const focusable = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter(
                (el) => el.offsetParent !== null
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const toggleExpanded = (href: string) => {
        setExpandedItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]));
    };

    const toggleCategory = (href: string) => {
        setExpandedCategories((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]));
    };

    if (!isClient) return null;

    return createPortal(
        <div className="md:hidden">
            {/* Scrim */}
            <div
                aria-hidden="true"
                className={cn("fixed inset-0 z-60 bg-neutral-950/40 transition-opacity duration-300 ease-out", isOpen ? "visible opacity-100" : "invisible opacity-0")}
                onClick={onClose}
            />

            {/* Sheet — slides in from the right, where the menu button lives, and leaves the same way */}
            <div
                ref={panelRef}
                inert={!isOpen}
                className={cn(
                    "fixed inset-y-0 right-0 z-70 flex w-[88vw] max-w-sm flex-col rounded-l-3xl bg-white/[0.94] shadow-[0_0_0_1px_rgba(15,23,42,0.06),-24px_0_64px_-24px_rgba(15,23,42,0.35)] backdrop-blur-2xl backdrop-saturate-150 transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] [@media(prefers-reduced-transparency:reduce)]:bg-white",
                    isOpen ? "visible translate-x-0" : "invisible translate-x-full"
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header */}
                <div className="pt-safe flex items-center justify-between px-5">
                    <span className="text-[13px] font-medium text-neutral-500">Menu</span>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-900/[0.05]"
                        aria-label="Close menu"
                    >
                        <CloseIcon size={22} />
                    </button>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4" aria-label="Main navigation">
                    <ul className="space-y-0.5">
                        {items.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            const hasMegaMenu = item.megaMenu && item.megaMenu.length > 0;
                            const hasChildren = item.children && item.children.length > 0;
                            const isExpanded = expandedItems.includes(item.href);
                            const panelId = `mobile-nav-${item.href.replace(/[^a-z0-9]+/gi, "-")}`;

                            return (
                                <li key={item.href}>
                                    <div className="flex items-center">
                                        <Link href={item.href} onClick={onClose} className={cn(ROW, "text-[17px] font-medium tracking-[-0.01em]", isActive ? ROW_ACTIVE : ROW_IDLE)}>
                                            {item.label}
                                        </Link>
                                        {(hasMegaMenu || hasChildren) && (
                                            <button
                                                type="button"
                                                onClick={() => toggleExpanded(item.href)}
                                                className={DISCLOSURE}
                                                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                                                aria-expanded={isExpanded}
                                                aria-controls={panelId}
                                            >
                                                <Chevron open={isExpanded} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mega menu categories */}
                                    {hasMegaMenu && (
                                        <ul id={panelId} hidden={!isExpanded} className="animate-popover-in mt-0.5 mb-2 ml-3 space-y-0.5 border-l border-neutral-900/[0.08] pl-2">
                                            {item.megaMenu!.map((column) => {
                                                const isCategoryExpanded = expandedCategories.includes(column.href);
                                                const hasItems = column.items && column.items.length > 0;
                                                const isColumnActive = pathname === column.href || pathname.startsWith(column.href + "/");

                                                return (
                                                    <li key={column.href}>
                                                        <div className="flex items-center">
                                                            <Link
                                                                href={column.href}
                                                                onClick={onClose}
                                                                className={cn(SUB_ROW, "flex-1 font-medium", isColumnActive ? ROW_ACTIVE : "text-neutral-800 hover:bg-neutral-900/[0.05]")}
                                                            >
                                                                {column.title}
                                                            </Link>
                                                            {hasItems && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleCategory(column.href)}
                                                                    className={cn(DISCLOSURE, "h-11 w-11")}
                                                                    aria-label={`${isCategoryExpanded ? "Collapse" : "Expand"} ${column.title}`}
                                                                    aria-expanded={isCategoryExpanded}
                                                                >
                                                                    <Chevron open={isCategoryExpanded} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {hasItems && (
                                                            <ul hidden={!isCategoryExpanded} className="animate-popover-in ml-3 space-y-0.5 pb-1">
                                                                {column.items.map((subItem) => (
                                                                    <li key={subItem.href}>
                                                                        <Link href={subItem.href} onClick={onClose} className={cn(SUB_ROW, pathname === subItem.href ? ROW_ACTIVE : SUB_IDLE)}>
                                                                            {subItem.label}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {/* Regular children (non-mega menu) */}
                                    {!hasMegaMenu && hasChildren && (
                                        <ul id={panelId} hidden={!isExpanded} className="animate-popover-in mt-0.5 mb-2 ml-3 space-y-0.5 border-l border-neutral-900/[0.08] pl-2">
                                            {item.children!.map((child) => (
                                                <li key={child.href}>
                                                    <Link href={child.href} className={cn(SUB_ROW, pathname === child.href ? ROW_ACTIVE : SUB_IDLE)}>
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Auth + CTA — pinned to bottom */}
                <div className="pb-safe space-y-2 px-4 pt-3">
                    {COMMERCE_ENABLED && (
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="flex min-h-12 items-center justify-center rounded-full bg-neutral-900/[0.05] text-[15px] font-semibold text-neutral-800 transition-colors hover:bg-neutral-900/[0.08]"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                onClick={onClose}
                                className="bg-primary-50 text-primary-800 hover:bg-primary-100 flex min-h-12 items-center justify-center rounded-full text-[15px] font-semibold transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                    <Link href="/support/contact" onClick={onClose} className={cn(PILL_PRIMARY, "mb-4 w-full")}>
                        Request a Quote
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
}
