import AccountSidebar from "@/components/account/AccountSidebar";
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
