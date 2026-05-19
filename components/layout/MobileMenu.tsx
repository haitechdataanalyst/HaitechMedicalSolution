"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CloseIcon, ChevronDownIcon } from "@/components/icons";
import { EnhancedNavItem } from "@/lib/navigation";
import { RocketIcon } from "lucide-react";

interface MobileMenuProps {
    items: EnhancedNavItem[];
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Move focus into panel
            setTimeout(() => closeButtonRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Focus trap — keep Tab/Shift+Tab inside the panel
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") { onClose(); return; }
            if (e.key !== "Tab") return;
            const panel = panelRef.current;
            if (!panel) return;
            const focusable = panel.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
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

    return (
        <>
            {/* Overlay */}
            <div className={cn("fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 md:hidden", isOpen ? "visible opacity-100" : "invisible opacity-0")} onClick={onClose} />

            {/* Menu Panel */}
            <div ref={panelRef} className={cn("fixed top-0 right-0 z-70 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "translate-x-full")} role="dialog" aria-modal="true" aria-label="Navigation menu">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                    <span className="text-sm font-semibold tracking-tight text-neutral-900">Navigation</span>
                    <button ref={closeButtonRef} onClick={onClose} className="icon-btn" aria-label="Close menu">
                        <CloseIcon size={20} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation">
                    <ul className="space-y-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            const hasMegaMenu = item.megaMenu && item.megaMenu.length > 0;
                            const hasChildren = item.children && item.children.length > 0;
                            const isExpanded = expandedItems.includes(item.href);

                            return (
                                <li key={item.href}>
                                    <div className="flex items-center">
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex-1 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                                                isActive ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-700"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                        {(hasMegaMenu || hasChildren) && (
                                            <button onClick={() => toggleExpanded(item.href)} className="icon-btn" aria-label={isExpanded ? "Collapse" : "Expand"}>
                                                <ChevronDownIcon size={20} className={cn("transition-transform", isExpanded && "rotate-180")} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mega Menu Categories for Mobile */}
                                    {hasMegaMenu && (
                                        <ul className={cn("mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200", isExpanded ? "max-h-500 opacity-100" : "max-h-0 opacity-0")}>
                                            {item.megaMenu!.map((column) => {
                                                const isCategoryExpanded = expandedCategories.includes(column.href);
                                                const hasItems = column.items && column.items.length > 0;

                                                return (
                                                    <li key={column.href}>
                                                        <div className="flex items-center">
                                                            <Link
                                                                href={column.href}
                                                                onClick={onClose}
                                                                className={cn(
                                                                    "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                                                                    pathname === column.href || pathname.startsWith(column.href + "/")
                                                                        ? "text-primary-600 bg-primary-50"
                                                                        : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-700"
                                                                )}
                                                            >
                                                                {column.title}
                                                            </Link>
                                                            {hasItems && (
                                                                <button onClick={() => toggleCategory(column.href)} className="icon-btn p-1" aria-label={isCategoryExpanded ? "Collapse" : "Expand"}>
                                                                    <ChevronDownIcon size={16} className={cn("transition-transform", isCategoryExpanded && "rotate-180")} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Category Sub-items */}
                                                        {hasItems && (
                                                            <ul
                                                                className={cn(
                                                                    "mt-1 ml-4 space-y-1 overflow-auto transition-all duration-200",
                                                                    isCategoryExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                                )}
                                                            >
                                                                {column.items.map((subItem) => (
                                                                    <li key={subItem.href}>
                                                                        <Link
                                                                            href={subItem.href}
                                                                            onClick={onClose}
                                                                            className={cn(
                                                                                "block rounded-lg px-4 py-2 text-sm transition-colors",
                                                                                pathname === subItem.href
                                                                                    ? "text-primary-600 bg-primary-50"
                                                                                    : "text-muted hover:text-primary-600 hover:bg-surface-secondary"
                                                                            )}
                                                                        >
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

                                    {/* Regular Children (non-mega menu) */}
                                    {!hasMegaMenu && hasChildren && (
                                        <ul className={cn("mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200", isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                                            {item.children!.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className={cn(
                                                            "block rounded-lg px-4 py-2 text-sm transition-colors",
                                                            pathname === child.href ? "text-primary-600 bg-primary-50" : "text-muted hover:text-primary-600 hover:bg-surface-secondary"
                                                        )}
                                                    >
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
                <div className="border-t border-neutral-100 p-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="flex items-center justify-center rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            onClick={onClose}
                            className="flex items-center justify-center rounded-xl border border-primary-200 bg-primary-50 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                        >
                            Register
                        </Link>
                    </div>
                    <Link
                        href="/support/contact"
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary-500 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-600"
                        style={{ boxShadow: "0 4px 16px -2px rgb(31 182 205 / 0.4)" }}
                    >
                        <RocketIcon size={16} />
                        Book a Demo
                    </Link>
                </div>
            </div>
        </>
    );
}
