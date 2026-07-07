"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileDown, RotateCcw, ShoppingBag } from "lucide-react";
import { orderApi, Order } from "@/lib/api";
import { cn } from "@/lib/utils";
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
        <div className="space-y-5">
            <AccountPageHeader title="My Orders" subtitle="Track, manage and reorder your purchases" />

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                            activeTab === tab.key
                                ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                            activeTab === tab.key ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                        )}>
                            {countFor(tab.key)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-14 text-center shadow-sm">
                            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                            <p className="text-sm font-medium text-neutral-500">No orders in this category</p>
                        </div>
                    )}

                    {filtered.map((order) => (
                        <div key={order.id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:border-neutral-200 hover:shadow">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-50 bg-neutral-50/50 px-5 py-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Order ID</p>
                                        <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-bold text-primary-600 hover:underline">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </Link>
                                    </div>
                                    <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Placed on</p>
                                        <p className="text-sm font-semibold text-neutral-700">{fmtDate(order.createdAt)}</p>
                                    </div>
                                    {order.total > 0 && (
                                        <>
                                            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Amount</p>
                                                <p className="text-sm font-bold text-neutral-900">{fmt(order.total, order.currency)}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <StatusBadge status={order.status} size="lg" />
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-neutral-50 px-5">
                                {(order.items ?? []).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 py-3.5">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                            <span className="text-[10px] font-bold">{(item.productSku ?? item.productName).slice(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-neutral-800">{item.productName}</p>
                                            <p className="mt-0.5 text-xs text-neutral-400">
                                                {item.productSku && `SKU: ${item.productSku} · `}Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            {item.totalPrice > 0
                                                ? <p className="text-sm font-bold text-neutral-900">{fmt(item.totalPrice, order.currency)}</p>
                                                : <p className="text-xs italic text-neutral-400">Included</p>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer actions */}
                            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-50 bg-neutral-50/30 px-5 py-3">
                                <Link
                                    href={`/account/orders/${order.id}/invoice`}
                                    className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-800"
                                >
                                    <FileDown className="h-3.5 w-3.5" />
                                    Invoice
                                </Link>
                                <Link
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
                                >
                                    Details
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 disabled:opacity-40 hover:bg-neutral-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 disabled:opacity-40 hover:bg-neutral-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
