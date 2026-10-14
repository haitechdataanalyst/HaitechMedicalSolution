"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileDown, ShoppingBag } from "lucide-react";
import { orderApi, Order } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";
import { AccountPageHeader, StatusBadge } from "@/components/account";

type StatusFilter = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const TABS: { key: StatusFilter; label: string }[] = [
    { key: "all",       label: "All Orders" },
    { key: "pending",   label: "Pending"    },
    { key: "confirmed", label: "Confirmed"  },
    { key: "shipped",   label: "Shipped"    },
    { key: "delivered", label: "Delivered"  },
    { key: "cancelled", label: "Cancelled"  },
];

const fmt = (paise: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<StatusFilter>("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        orderApi.getOrders(page, 10).then((res) => {
            if (res.success && res.data) {
                setOrders(res.data.orders);
                const meta = res.meta as { totalPages?: number } | undefined;
                setTotalPages(meta?.totalPages ?? 1);
            }
        }).finally(() => setIsLoading(false));
    }, [page]);

    const filtered = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);
    const countFor = (key: StatusFilter) => key === "all" ? orders.length : orders.filter((o) => o.status === key).length;

    return (
        <div className="space-y-6">
            <AccountPageHeader title="My Orders" subtitle="Track, manage and reorder your purchases" />

            {/* Filter tabs */}
            <div className="scrollbar-hide -mx-(--container-padding) overflow-x-auto px-(--container-padding) lg:mx-0 lg:px-0">
                <div className="flex w-max gap-2" role="group" aria-label="Filter orders by status">
                    {TABS.map((tab) => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                aria-pressed={active}
                                className={cn(
                                    "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                                    active
                                        ? "bg-neutral-900 text-white"
                                        : "bg-white text-neutral-700 ring-1 ring-neutral-900/[0.06] hover:bg-neutral-100"
                                )}
                            >
                                {tab.label}
                                <span className={cn("text-xs tabular-nums", active ? "text-white/70" : "text-neutral-500")}>
                                    {countFor(tab.key)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-white motion-safe:animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-4 md:space-y-5">
                    {filtered.length === 0 && (
                        <div className={cn(SURFACE_CARD, "px-6 py-16 text-center")}>
                            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-neutral-400" aria-hidden="true" />
                            <p className="text-[15px] text-neutral-500">No orders in this category</p>
                        </div>
                    )}

                    {filtered.map((order) => (
                        <article key={order.id} className={cn(SURFACE_CARD, "overflow-hidden")}>
                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6">
                                <dl className="flex flex-wrap gap-x-8 gap-y-3">
                                    <div>
                                        <dt className="text-[13px] text-neutral-500">Order</dt>
                                        <dd>
                                            <Link href={`/account/orders/${order.id}`} className="font-mono text-[15px] font-semibold text-primary-700 hover:underline">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </Link>
                                        </dd>
                                    </div>
                                    <div className="hidden sm:block">
                                        <dt className="text-[13px] text-neutral-500">Placed on</dt>
                                        <dd className="text-[15px] font-medium text-neutral-900 tabular-nums">{fmtDate(order.createdAt)}</dd>
                                    </div>
                                    {order.total > 0 && (
                                        <div className="hidden sm:block">
                                            <dt className="text-[13px] text-neutral-500">Amount</dt>
                                            <dd className="text-[15px] font-semibold text-neutral-900 tabular-nums">{fmt(order.total, order.currency)}</dd>
                                        </div>
                                    )}
                                </dl>
                                <StatusBadge status={order.status} size="lg" />
                            </div>

                            {/* Items */}
                            <ul className="mt-3 divide-y divide-neutral-900/[0.06] px-6">
                                {(order.items ?? []).map((item) => (
                                    <li key={item.id} className="flex items-center gap-4 py-4">
                                        <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-500">
                                            <span className="text-xs font-semibold">{(item.productSku ?? item.productName).slice(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[15px] font-medium text-neutral-900">{item.productName}</p>
                                            <p className="mt-0.5 text-[13px] text-neutral-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            {item.totalPrice > 0
                                                ? <p className="text-[15px] font-semibold text-neutral-900 tabular-nums">{fmt(item.totalPrice, order.currency)}</p>
                                                : <p className="text-[13px] text-neutral-500">Included</p>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Footer actions */}
                            <div className="flex flex-wrap items-center justify-end gap-2 px-6 pt-2 pb-6">
                                <Link href={`/account/orders/${order.id}/invoice`} className="btn btn-secondary btn-md">
                                    <FileDown className="h-4 w-4" aria-hidden="true" />
                                    Invoice
                                </Link>
                                <Link href={`/account/orders/${order.id}`} className="btn btn-primary btn-md">
                                    Details
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-3 pt-2">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="btn btn-secondary btn-md"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500 tabular-nums">Page {page} of {totalPages}</span>
                    <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="btn btn-secondary btn-md"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}
