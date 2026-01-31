import Link from 'next/link';
import { Breadcrumb } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@/components/icons';

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('bg-surface-secondary py-3 border-b border-neutral-100', className)}
    >
      <div className="container">
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon size={16} className="text-neutral-400 mx-1 sm:mx-2" />
                )}
                {isLast ? (
                  <span className="text-muted font-medium truncate max-w-[200px] sm:max-w-none">{item.name}</span>
                ) : (
                  <Link
                    href={item.path}
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
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
