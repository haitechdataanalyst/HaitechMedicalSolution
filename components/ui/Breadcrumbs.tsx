import Link from "next/link";
import { Breadcrumb } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/icons";

interface BreadcrumbsProps {
    items: Breadcrumb[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    // On mobile: collapse to "… > parent > current" when path is deeper than 2 levels
    const isMobileCollapsed = items.length > 2;
    const mobileItems = isMobileCollapsed ? [{ name: "…", path: "" }, ...items.slice(-2)] : items;

    return (
        <nav aria-label="Breadcrumb" className={cn("bg-surface-secondary border-b border-neutral-100 py-3", className)}>
            <div className="container">
                {/* Mobile: collapsed */}
                <ol className="flex items-center gap-1 text-sm sm:hidden">
                    {mobileItems.map((item, index) => {
                        const isLast = index === mobileItems.length - 1;
                        const isEllipsis = item.name === "…";
                        return (
                            <li key={`m-${item.path}-${index}`} className="flex items-center">
                                {index > 0 && <ChevronRightIcon size={14} className="mx-1 text-neutral-400" />}
                                {isEllipsis ? (
                                    <span className="text-neutral-400 select-none">…</span>
                                ) : isLast ? (
                                    <span className="text-muted max-w-40 truncate font-medium">{item.name}</span>
                                ) : (
                                    <Link href={item.path} className="text-primary-600 hover:text-primary-700 max-w-32 truncate hover:underline">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>

                {/* Desktop: full path */}
                <ol className="hidden items-center gap-1 text-sm sm:flex">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <li key={item.path} className="flex items-center">
                                {index > 0 && <ChevronRightIcon size={16} className="mx-2 text-neutral-400" />}
                                {isLast ? (
                                    <span className="text-muted font-medium">{item.name}</span>
                                ) : (
                                    <Link href={item.path} className="text-primary-600 hover:text-primary-700 hover:underline">
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
