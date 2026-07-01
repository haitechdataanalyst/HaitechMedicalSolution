"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Settings } from "lucide-react";
import Link from "next/link";

const MOBILE_NAV = [
    { href: "/account",           label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders",    label: "Orders",    icon: ShoppingBag     },
    { href: "/account/wishlist",  label: "Wishlist",  icon: Heart           },
    { href: "/account/addresses", label: "Addresses", icon: MapPin          },
    { href: "/account/settings",  label: "Settings",  icon: Settings        },
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

    // Show skeleton while auth is resolving or redirecting
    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-neutral-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="hidden h-64 w-56 animate-pulse rounded-2xl bg-white lg:block" />
                        <div className="flex-1 space-y-4">
                            <div className="h-10 w-48 animate-pulse rounded-xl bg-white" />
                            <div className="h-48 animate-pulse rounded-2xl bg-white" />
                            <div className="h-48 animate-pulse rounded-2xl bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Mobile tab bar */}
            <div className="sticky top-0 z-30 flex overflow-x-auto border-b border-neutral-200 bg-white shadow-sm lg:hidden">
                {MOBILE_NAV.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex shrink-0 flex-col items-center gap-1 px-4 py-3 text-[10px] font-semibold text-neutral-500 transition-colors hover:text-primary-600"
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                ))}
            </div>

            <div className="container mx-auto px-4 py-6 lg:py-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    {/* Sidebar — desktop only */}
                    <div className="hidden lg:block lg:sticky lg:top-24">
                        <AccountSidebar />
                    </div>

                    {/* Main content */}
                    <div className="min-w-0 flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
