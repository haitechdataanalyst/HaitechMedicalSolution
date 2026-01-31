'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { CloseIcon, ChevronDownIcon } from '@/components/icons';

interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-surface z-[70] md:hidden shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <span className="text-lg font-semibold text-foreground">Menu</span>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close menu"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-65px)]">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.href);

              return (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex-1 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-700 hover:text-primary-600 hover:bg-surface-secondary'
                      )}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className="icon-btn"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronDownIcon
                          size={20}
                          className={cn(
                            'transition-transform',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Children */}
                  {hasChildren && (
                    <ul
                      className={cn(
                        'ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200',
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      )}
                    >
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 rounded-lg text-sm transition-colors',
                              pathname === child.href
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-muted hover:text-primary-600 hover:bg-surface-secondary'
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
