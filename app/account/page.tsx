"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Truck, ArrowRight, Package, RotateCcw, Headset } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { orderApi, Order } from "@/lib/api";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { StatCard, StatusBadge } from "@/components/account";
import { cn } from "@/lib/utils";
import { CARD_HOVER_SHADOW, INTERACTIVE_CARD, SURFACE_CARD } from "@/components/ui/surfaces";

const fmt = (paise: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AccountDashboard() {
    const { user } = useAuth();
    const { count: wishlistCount } = useWishlist();

    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        orderApi.getOrders(1, 10).then((res) => {
            if (res.success && res.data) {
                setOrders(res.data.orders);
                setTotalOrders((res.meta?.total as number) ?? res.data.orders.length);
            }
        }).finally(() => setIsLoading(false));
    }, []);

    const inProgressCount = orders.filter((o) => o.status === "confirmed" || o.status === "shipped").length;
    const recentOrders = orders.slice(0, 4);

    const stats = [
        { label: "Total Orders",  value: isLoading ? "—" : totalOrders,       sub: "All time",               icon: ShoppingBag, iconBg: "bg-primary-50", iconColor: "text-primary-600" },
        { label: "In Progress",   value: isLoading ? "—" : inProgressCount,   sub: "Confirmed & shipped",    icon: Truck,       iconBg: "bg-amber-50",   iconColor: "text-amber-600"   },
        { label: "Wishlist",      value: wishlistCount,                         sub: "Saved products",         icon: Heart,       iconBg: "bg-rose-50",    iconColor: "text-rose-500"    },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[15px] font-medium text-neutral-500">Welcome back</p>
                    <h1 className="mt-1 text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-neutral-900 md:text-5xl">{user ? `${user.firstName} ${user.lastName}` : "—"}</h1>
                    <p className="mt-2 truncate text-[15px] text-neutral-500">{user?.email}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] text-neutral-600 ring-1 ring-neutral-900/[0.06]">
                    Member
                    <span className="font-semibold text-neutral-900 capitalize">{user?.role ?? "User"}</span>
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
                {stats.map((s) => (
                    <StatCard key={s.label} icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} value={s.value} label={s.label} sub={s.sub} />
                ))}
            </div>

            {/* Recent Orders */}
            <section className={cn(SURFACE_CARD, "overflow-hidden")}>
                <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-2 md:px-7">
                    <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Recent Orders</h2>
                    <Link href="/account/orders" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800">
                        View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3 px-6 pt-2 pb-6">
                        {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-neutral-100 motion-safe:animate-pulse" />)}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="px-6 pt-6 pb-12 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-neutral-400" aria-hidden="true" />
                        <p className="text-[15px] text-neutral-500">No orders yet</p>
                        <Link href="/products" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary-700 hover:underline">Browse products</Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden px-3 pb-3 sm:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[13px] font-medium text-neutral-500">
                                        <th scope="col" className="px-3 py-3 font-medium">Order</th>
                                        <th scope="col" className="px-3 py-3 font-medium">Items</th>
                                        <th scope="col" className="px-3 py-3 font-medium">Date</th>
                                        <th scope="col" className="px-3 py-3 font-medium">Amount</th>
                                        <th scope="col" className="px-3 py-3 font-medium">Status</th>
                                        <th scope="col" className="px-3 py-3 text-right font-medium"><span className="sr-only">Action</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-900/[0.06] border-t border-neutral-900/[0.06]">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="transition-colors duration-200 hover:bg-neutral-900/[0.02]">
                                            <td className="px-3 py-4">
                                                <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-semibold text-primary-700 hover:underline">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-4">
                                                <p className="max-w-48 truncate text-sm font-medium text-neutral-900">
                                                    {order.items?.[0]?.productName ?? "—"}
                                                </p>
                                                {(order.items?.length ?? 0) > 1 && (
                                                    <p className="text-[13px] text-neutral-500">+{(order.items?.length ?? 0) - 1} more</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-neutral-600 tabular-nums">{fmtDate(order.createdAt)}</td>
                                            <td className="px-3 py-4 text-sm font-semibold text-neutral-900 tabular-nums">
                                                {order.total ? fmt(order.total, order.currency) : <span className="font-normal text-neutral-500">Quote</span>}
                                            </td>
                                            <td className="px-3 py-4"><StatusBadge status={order.status} /></td>
                                            <td className="px-3 py-4 text-right">
                                                <Link href={`/account/orders/${order.id}`} className="inline-flex min-h-11 items-center text-sm font-medium text-primary-700 hover:text-primary-800">View</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile list */}
                        <ul className="divide-y divide-neutral-900/[0.06] px-6 pb-2 sm:hidden">
                            {recentOrders.map((order) => (
                                <li key={order.id}>
                                    <Link href={`/account/orders/${order.id}`} className="flex items-start justify-between gap-4 py-4">
                                        <div className="min-w-0">
                                            <p className="font-mono text-[13px] font-semibold text-primary-700">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="mt-1 line-clamp-1 text-[15px] font-medium text-neutral-900">{order.items?.[0]?.productName ?? "—"}</p>
                                            <p className="mt-0.5 text-[13px] text-neutral-500">{fmtDate(order.createdAt)}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="mb-1.5 text-[15px] font-semibold text-neutral-900 tabular-nums">{order.total ? fmt(order.total, order.currency) : "—"}</p>
                                            <StatusBadge status={order.status} size="sm" />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>

            {/* Quick Actions */}
            <section>
                <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Quick Actions</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
                    {[
                        { href: "/products",        icon: Package,    label: "Browse Products",  sub: "Explore full catalogue",  iconBg: "bg-primary-50", iconColor: "text-primary-700" },
                        { href: "/account/orders",  icon: RotateCcw,  label: "Reorder Previous", sub: "Quick repeat purchases",  iconBg: "bg-amber-50",   iconColor: "text-amber-700"   },
                        { href: "/support/contact", icon: Headset,    label: "Contact Support",   sub: "Get expert help",         iconBg: "bg-emerald-50", iconColor: "text-emerald-700" },
                    ].map((a) => (
                        <Link key={a.href} href={a.href} className={cn(INTERACTIVE_CARD, "flex-row items-center gap-4 p-5")}>
                            <span aria-hidden="true" className={CARD_HOVER_SHADOW} />
                            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", a.iconBg)}>
                                <a.icon className={cn("h-5 w-5", a.iconColor)} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{a.label}</span>
                                <span className="block text-[13px] text-neutral-500">{a.sub}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-primary-700 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
