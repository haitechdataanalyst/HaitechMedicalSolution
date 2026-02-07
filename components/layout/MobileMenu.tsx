"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CloseIcon, ChevronDownIcon } from "@/components/icons";
import { EnhancedNavItem } from "@/lib/navigation";

interface MobileMenuProps {
  items: EnhancedNavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]));
  };

  const toggleCategory = (href: string) => {
    setExpandedCategories((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]));
  };

  return (
    <>
      {/* Overlay */}
      <div className={cn("fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden", isOpen ? "visible opacity-100" : "invisible opacity-0")} onClick={onClose} />

      {/* Menu Panel */}
      <div className={cn("bg-surface fixed top-0 right-0 z-[70] h-full w-[85vw] max-w-sm shadow-xl transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "translate-x-full")}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <span className="text-foreground text-lg font-semibold">Menu</span>
          <button onClick={onClose} className="icon-btn" aria-label="Close menu">
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="h-[calc(100%-65px)] overflow-y-auto p-4">
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
                    <ul className={cn("mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200", isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0")}>
                      {item.megaMenu!.map((column) => {
                        const isCategoryExpanded = expandedCategories.includes(column.href);
                        const hasItems = column.items && column.items.length > 0;

                        return (
                          <li key={column.href}>
                            <div className="flex items-center">
                              <Link
                                href={column.href}
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
                              <ul className={cn("mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200", isCategoryExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                                {column.items.map((subItem) => (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={cn(
                                        "block rounded-lg px-4 py-2 text-sm transition-colors",
                                        pathname === subItem.href ? "text-primary-600 bg-primary-50" : "text-muted hover:text-primary-600 hover:bg-surface-secondary"
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
      </div>
    </>
  );
}
