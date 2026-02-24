import Link from "next/link";
import { Breadcrumb } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/icons";

interface BreadcrumbsProps {
    items: Breadcrumb[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("bg-surface-secondary border-b border-neutral-100 py-3", className)}>
            <div className="container">
                <ol className="flex flex-wrap items-center gap-1 text-sm">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={item.path} className="flex items-center">
                                {index > 0 && <ChevronRightIcon size={16} className="mx-1 text-neutral-400 sm:mx-2" />}
                                {isLast ? (
                                    <span className="text-muted max-w-[200px] truncate font-medium sm:max-w-none">{item.name}</span>
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
