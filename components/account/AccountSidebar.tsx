"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, Settings, HelpCircle, LogOut, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const NAV = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/settings", label: "Account Settings", icon: Settings },
];

const ROW =
    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { count: wishlistCount } = useWishlist();
    const { user, logout } = useAuth();

    const isActive = (href: string) => (href === "/account" ? pathname === "/account" : pathname.startsWith(href));

    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
    const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "";
    const joinedDate = user ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";

    const handleSignOut = async () => {
        await logout();
        router.push("/");
    };

    return (
        <aside className="flex w-full flex-col gap-4 lg:w-64 lg:shrink-0">
            {/* Identity */}
            <div className={cn(SURFACE_CARD, "p-5")}>
                <div className="flex items-center gap-3">
                    <div aria-hidden="true" className="bg-primary-50 text-primary-800 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{fullName}</p>
                        <p className="truncate text-[13px] text-neutral-500">{user?.email}</p>
                    </div>
                </div>
                {(user?.phone || user?.emailVerified) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-neutral-500">
                        {user?.emailVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                Email verified
                            </span>
                        )}
                        {user?.phone && <span className="tabular-nums">{user.phone}</span>}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav aria-label="Account" className={cn(SURFACE_CARD, "p-2")}>
                <ul className="flex flex-col gap-0.5">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        const badge = href === "/account/wishlist" && wishlistCount > 0 ? wishlistCount : null;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(ROW, active ? "bg-primary-50 text-primary-800 font-semibold" : "text-neutral-700 hover:bg-neutral-900/[0.04] hover:text-neutral-900")}
                                >
                                    <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary-700" : "text-neutral-500")} aria-hidden="true" />
                                    <span className="flex-1">{label}</span>
                                    {badge && (
                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-900/[0.06] px-2 text-xs font-semibold text-neutral-700 tabular-nums">
                                            {badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mx-3 my-2 h-px bg-neutral-900/[0.06]" aria-hidden="true" />

                <Link href="/support" className={cn(ROW, "text-neutral-600 hover:bg-neutral-900/[0.04] hover:text-neutral-900")}>
                    <HelpCircle className="h-[18px] w-[18px] shrink-0 text-neutral-500" aria-hidden="true" />
                    Help & Support
                </Link>
                <button type="button" onClick={handleSignOut} className={cn(ROW, "text-neutral-600 hover:bg-red-50 hover:text-red-700")}>
                    <LogOut className="h-[18px] w-[18px] shrink-0 text-neutral-500" aria-hidden="true" />
                    Sign out
                </button>
            </nav>

            {joinedDate && <p className="px-2 text-center text-[13px] text-neutral-500">Member since {joinedDate}</p>}
        </aside>
    );
}
