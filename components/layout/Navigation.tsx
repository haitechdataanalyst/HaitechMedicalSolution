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
    <nav className="hidden items-center gap-5 md:flex">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
          return (
            <div key={item.href} className="relative" onMouseEnter={() => setOpenDropdown(item.href)} onMouseLeave={() => setOpenDropdown(null)}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors lg:px-4",
                  isActive ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-500"
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
                  "absolute top-full left-0 w-full pt-2 transition-all duration-200",
                  openDropdown === item.href ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                )}
              >
                <div className="bg-surface rounded-lg border border-neutral-200 py-2 shadow-lg">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        pathname === child.href ? "text-primary-600 bg-primary-50" : "hover:text-primary-600 hover:bg-surface-secondary text-neutral-700"
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
