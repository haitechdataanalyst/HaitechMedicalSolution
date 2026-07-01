"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Truck, ArrowRight, Package, RotateCcw, Headset } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { orderApi, Order } from "@/lib/api";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { StatCard, StatusBadge } from "@/components/account";
import { cn } from "@/lib/utils";

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
        <div className="space-y-6">
            {/* Welcome banner */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 text-white shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary-100">Welcome back</p>
                        <h1 className="mt-0.5 text-2xl font-bold">{user ? `${user.firstName} ${user.lastName}` : "—"}</h1>
                        <p className="mt-1 text-sm text-primary-200">{user?.email}</p>
                    </div>
                    <div className="hidden rounded-xl bg-white/10 px-4 py-3 text-right sm:block">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-200">Member</p>
                        <p className="mt-0.5 text-sm font-bold capitalize">{user?.role ?? "User"}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {stats.map((s) => (
                    <StatCard key={s.label} icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} value={s.value} label={s.label} sub={s.sub} />
                ))}
            </div>

            {/* Recent Orders */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                    <h2 className="text-base font-bold text-neutral-900">Recent Orders</h2>
                    <Link href="/account/orders" className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
                        View all <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3 p-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-neutral-100" />)}
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                        <p className="text-sm text-neutral-500">No orders yet</p>
                        <Link href="/products" className="mt-3 inline-block text-xs font-semibold text-primary-600 hover:underline">Browse products →</Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden sm:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-50 bg-neutral-50/60">
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Order</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Items</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Date</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Amount</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="group transition-colors hover:bg-neutral-50/60">
                                            <td className="px-6 py-4">
                                                <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-bold text-primary-600 hover:underline">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="max-w-48 truncate text-sm font-medium text-neutral-800">
                                                    {order.items?.[0]?.productName ?? "—"}
                                                </p>
                                                {(order.items?.length ?? 0) > 1 && (
                                                    <p className="text-[11px] text-neutral-400">+{(order.items?.length ?? 0) - 1} more</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-neutral-500">{fmtDate(order.createdAt)}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-neutral-900">
                                                {order.total ? fmt(order.total, order.currency) : <span className="italic text-neutral-400">Quote</span>}
                                            </td>
                                            <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/account/orders/${order.id}`} className="text-xs font-semibold text-neutral-500 hover:text-primary-600">View →</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile list */}
                        <div className="divide-y divide-neutral-50 sm:hidden">
                            {recentOrders.map((order) => (
                                <Link key={order.id} href={`/account/orders/${order.id}`} className="block px-4 py-4 hover:bg-neutral-50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-mono text-xs font-bold text-primary-600">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="mt-1 line-clamp-1 text-sm font-semibold text-neutral-800">{order.items?.[0]?.productName ?? "—"}</p>
                                            <p className="mt-0.5 text-xs text-neutral-400">{fmtDate(order.createdAt)}</p>
                                        </div>
                                        <div className="mt-0.5 text-right">
                                            <p className="mb-1.5 text-sm font-bold text-neutral-900">{order.total ? fmt(order.total, order.currency) : "—"}</p>
                                            <StatusBadge status={order.status} size="sm" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="border-b border-neutral-100 px-6 py-4">
                    <h2 className="text-base font-bold text-neutral-900">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
                    {[
                        { href: "/products",        icon: Package,    label: "Browse Products",  sub: "Explore full catalogue",  iconBg: "bg-primary-50", iconColor: "text-primary-600" },
                        { href: "/account/orders",  icon: RotateCcw,  label: "Reorder Previous", sub: "Quick repeat purchases",  iconBg: "bg-amber-50",   iconColor: "text-amber-600"   },
                        { href: "/support/contact", icon: Headset,    label: "Contact Support",   sub: "Get expert help",         iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
                    ].map((a) => (
                        <Link key={a.href} href={a.href} className="group flex items-center gap-4 rounded-xl border border-neutral-100 p-4 transition-all hover:border-primary-100 hover:shadow-sm">
                            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", a.iconBg)}>
                                <a.icon className={cn("h-5 w-5", a.iconColor)} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">{a.label}</p>
                                <p className="text-[11px] text-neutral-400">{a.sub}</p>
                            </div>
                            <ArrowRight className="ml-auto h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-400" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
