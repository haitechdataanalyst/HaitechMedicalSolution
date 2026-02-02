"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useHeaderNavigation } from "./NavigationProvider";
import { EnhancedNavItem, MegaMenuColumn } from "@/lib/navigation";

interface MegaMenuProps {
  columns: MegaMenuColumn[];
  isOpen: boolean;
  onClose: () => void;
  itemHref: string;
}

function MegaMenu({ columns, isOpen, onClose, itemHref }: MegaMenuProps) {
  const pathname = usePathname();
  const triangleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate positions directly without state to avoid cascading renders
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const triggerElement = document.querySelector(`[data-nav-href="${itemHref}"]`);

      // Update triangle position
      if (triggerElement && triangleRef.current) {
        const rect = triggerElement.getBoundingClientRect();
        triangleRef.current.style.left = `${rect.left + rect.width / 2}px`;
      }

      // Update top position based on scroll
      if (containerRef.current) {
        const scrolled = window.scrollY > 44;
        containerRef.current.style.top = scrolled ? "66px" : "110px";
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
      className={cn("fixed right-0 left-0 z-50 pt-4 transition-all duration-200", isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}
      style={{ top: "110px" }}
    >
      {/* Triangle pointer */}
      <div
        ref={triangleRef}
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{
          left: "50%",
          width: 0,
          height: 0,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "20px solid #1a2e3b",
        }}
      />

      {/* Mega Menu Container */}
      <div className="mx-auto max-w-full overflow-hidden bg-[#1a2e3b] shadow-2xl">
        <div className="grid w-full grid-cols-5 gap-0 px-4">
          {columns.map((column, idx) => (
            <div key={column.href} className={cn("px-5 py-6", idx !== columns.length - 1 && "border-r border-white/10")}>
              {/* Column Header */}
              <Link href={column.href} className="group mb-4 block" onClick={onClose}>
                <h3 className="hover:text-primary-400 text-sm font-bold text-white transition-colors">{column.title}</h3>
              </Link>

              {/* Column Items */}
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-1 text-sm transition-colors",
                        pathname === item.href ? "text-primary-400" : "hover:text-primary-400 whitespace-nowrap text-neutral-300"
                      )}
                      onClick={onClose}
                    >
                      <span>{item.label}</span>
                      {item.isNew && <span className="bg-primary-500 ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white">New!</span>}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* About Link */}
              {column.aboutLink && (
                <Link href={column.aboutLink.href} className="hover:text-primary-400 mt-4 flex items-center gap-1 text-sm whitespace-nowrap text-neutral-400 transition-colors" onClick={onClose}>
                  <span>{column.aboutLink.label}</span>
                </Link>
              )}
            </div>
          ))}
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
    <div className={cn("absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 transition-all duration-200", isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
      {/* Triangle pointer */}
      <div
        className="absolute -top-0 left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid white",
        }}
      />
      <div className="bg-surface min-w-[200px] rounded-lg border border-neutral-200 py-2 shadow-lg">
        {items.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={cn(
              "block px-4 py-2 text-sm transition-colors",
              pathname === child.href ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-700"
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

export default function Navigation() {
  const items = useHeaderNavigation();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((href: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(href);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // Small delay to allow moving to dropdown
  }, []);

  const handleClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="relative hidden items-center gap-5 md:flex">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const hasMegaMenu = item.megaMenu && item.megaMenu.length > 0;
        const hasChildren = item.children && item.children.length > 0;

        if (hasMegaMenu || hasChildren) {
          return (
            <div key={item.href} className="relative" onMouseEnter={() => handleMouseEnter(item.href)} onMouseLeave={handleMouseLeave} data-nav-href={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors lg:px-4",
                  isActive ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-500"
                )}
              >
                {item.label}
              </Link>

              {/* Mega Menu or Simple Dropdown */}
              {hasMegaMenu ? (
                <MegaMenu columns={item.megaMenu!} isOpen={openDropdown === item.href} onClose={handleClose} itemHref={item.href} />
              ) : (
                hasChildren && <SimpleDropdown items={item.children!} isOpen={openDropdown === item.href} onClose={handleClose} />
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-bold transition-colors lg:px-4",
              isActive ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-500"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
