"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface NavigationProps {
  items: NavItem[];
}

export default function Navigation({ items }: NavigationProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex items-center gap-5">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                  isActive
                    ? "text-primary-600 bg-primary-50"
                    : "text-neutral-700 hover:text-primary-600 hover:bg-surface-secondary",
                )}
              >
                {item.label}
                {/* <ChevronDownIcon
                  size={16}
                  className={cn(
                    "transition-transform",
                    openDropdown === item.href && "rotate-180",
                  )}
                /> */}
              </Link>

              {/* Dropdown */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-2 w-56 transition-all duration-200",
                  openDropdown === item.href
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2",
                )}
              >
                <div className="bg-surface rounded-lg shadow-lg border border-neutral-200 py-2">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        pathname === child.href
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-700 hover:text-primary-600 hover:bg-surface-secondary",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "text-primary-600 bg-primary-50"
                : "text-neutral-700 hover:text-primary-600 hover:bg-surface-secondary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
