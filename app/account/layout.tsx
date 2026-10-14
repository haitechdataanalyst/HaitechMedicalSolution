"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "Orders", icon: ShoppingBag },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [isLoading, user, router, pathname]);

    const isActive = (href: string) => (href === "/account" ? pathname === "/account" : pathname.startsWith(href));

    // Show skeleton while auth is resolving or redirecting
    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-neutral-50" aria-busy="true">
                <div className="container py-8 lg:py-12">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <div className="hidden h-72 w-64 rounded-2xl bg-white motion-safe:animate-pulse lg:block" />
                        <div className="flex-1 space-y-5">
                            <div className="h-10 w-56 rounded-xl bg-white motion-safe:animate-pulse" />
                            <div className="h-48 rounded-2xl bg-white motion-safe:animate-pulse" />
                            <div className="h-48 rounded-2xl bg-white motion-safe:animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 print:min-h-0 print:bg-white">
            <div className="container py-6 lg:py-12 print:p-0">
                {/* Mobile section switcher */}
                <nav aria-label="Account" className="scrollbar-hide -mx-(--container-padding) mb-6 overflow-x-auto px-(--container-padding) lg:hidden print:hidden">
                    <ul className="flex w-max gap-2">
                        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "focus-visible:outline-primary-500 flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
                                            active ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-900/[0.06] hover:bg-neutral-100"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                    {/* Sidebar — desktop only */}
                    <div className="hidden lg:sticky lg:top-24 lg:block print:hidden">
                        <AccountSidebar />
                    </div>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
