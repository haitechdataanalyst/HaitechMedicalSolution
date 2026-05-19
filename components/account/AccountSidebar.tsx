"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Settings, HelpCircle, LogOut, ChevronRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { MOCK_USER } from "@/lib/mock-account";

const NAV = [
    { href: "/account",           label: "Dashboard",      icon: LayoutDashboard },
    { href: "/account/orders",    label: "My Orders",      icon: ShoppingBag     },
    { href: "/account/wishlist",  label: "Wishlist",       icon: Heart           },
    { href: "/account/addresses", label: "Addresses",      icon: MapPin          },
    { href: "/account/settings",  label: "Account Settings", icon: Settings      },
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { count: wishlistCount } = useWishlist();

    const isActive = (href: string) =>
        href === "/account" ? pathname === "/account" : pathname.startsWith(href);

    return (
        <aside className="flex w-full flex-col lg:w-72 lg:shrink-0">
            {/* User Card */}
            <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                {/* Gradient band */}
                <div className="h-14 bg-gradient-to-r from-primary-500 to-primary-600" />

                <div className="px-5 pb-5">
                    {/* Avatar */}
                    <div className="-mt-7 mb-3 flex items-end justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-primary-700 text-lg font-bold text-white shadow-md">
                            {MOCK_USER.initials}
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            <BadgeCheck className="h-3 w-3" />
                            GST Verified
                        </span>
                    </div>

                    <p className="text-sm font-bold text-neutral-900">{MOCK_USER.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{MOCK_USER.designation}</p>
                    <p className="mt-1 text-[11px] font-medium text-primary-600 line-clamp-1">{MOCK_USER.company}</p>

                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-2">
                        <span className="text-[10px] font-medium text-neutral-500">GSTIN</span>
                        <span className="font-mono text-[11px] font-semibold text-neutral-700">{MOCK_USER.gst}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="px-3 py-3">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        const badge = href === "/account/wishlist" && wishlistCount > 0 ? wishlistCount : null;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                    active
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-primary-600" : "text-neutral-400 group-hover:text-neutral-600")} />
                                <span className="flex-1">{label}</span>
                                {badge && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                                        {badge}
                                    </span>
                                )}
                                {active && <ChevronRight className="h-3.5 w-3.5 text-primary-400" />}
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t border-neutral-100 px-3 py-3">
                    <Link
                        href="/support"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
                    >
                        <HelpCircle className="h-4 w-4 shrink-0 text-neutral-400" />
                        Help & Support
                    </Link>
                    <button
                        onClick={() => router.push("/")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4 shrink-0 text-neutral-400" />
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Member since */}
            <p className="mt-3 px-2 text-center text-[10px] text-neutral-400">
                Member since {MOCK_USER.joinedDate}
            </p>
        </aside>
    );
}
