import Link from "next/link";
import { Breadcrumb } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/icons";
import { breadcrumbSchema } from "@/lib/structured-data";
import JsonLd from "./JsonLd";

interface BreadcrumbsProps {
    items: Breadcrumb[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    // On mobile: collapse to "… > parent > current" when path is deeper than 2 levels
    const isMobileCollapsed = items.length > 2;
    const mobileItems = isMobileCollapsed ? [{ name: "…", path: "" }, ...items.slice(-2)] : items;

    return (
        <nav aria-label="Breadcrumb" className={cn("pt-5 pb-1 md:pt-6", className)}>
            {/* The visible trail and its BreadcrumbList always come from the same items */}
            <JsonLd data={breadcrumbSchema(items)} />
            <div className="container">
                {/* Mobile: collapsed */}
                <ol className="flex items-center text-[13px] text-neutral-500 sm:hidden">
                    {mobileItems.map((item, index) => {
                        const isLast = index === mobileItems.length - 1;
                        const isEllipsis = item.name === "…";
                        return (
                            <li key={`m-${item.path}-${index}`} className="flex items-center">
                                {index > 0 && <ChevronRightIcon size={12} className="mx-1.5 shrink-0 text-neutral-400" aria-hidden="true" />}
                                {isEllipsis ? (
                                    <span className="select-none" aria-hidden="true">…</span>
                                ) : isLast ? (
                                    <span className="max-w-44 truncate text-neutral-900" aria-current="page">{item.name}</span>
                                ) : (
                                    <Link href={item.path} className="hover:text-primary-700 inline-flex min-h-11 max-w-32 items-center truncate transition-colors duration-200">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>

                {/* Desktop: full path */}
                <ol className="hidden flex-wrap items-center text-sm text-neutral-500 sm:flex">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <li key={item.path} className="flex items-center">
                                {index > 0 && <ChevronRightIcon size={12} className="mx-2 shrink-0 text-neutral-400" aria-hidden="true" />}
                                {isLast ? (
                                    <span className="text-neutral-900" aria-current="page">{item.name}</span>
                                ) : (
                                    <Link href={item.path} className="hover:text-primary-700 transition-colors duration-200">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
