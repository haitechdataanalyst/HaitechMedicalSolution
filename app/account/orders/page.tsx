"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw, FileDown } from "lucide-react";
import { MOCK_ORDERS, OrderStatus, formatOrderAmount, formatOrderDate } from "@/lib/mock-account";
import { cn } from "@/lib/utils";
import { AccountPageHeader, StatusBadge } from "@/components/account";

const TABS: { key: "all" | OrderStatus; label: string }[] = [
    { key: "all",        label: "All Orders" },
    { key: "processing", label: "Processing" },
    { key: "shipped",    label: "Shipped"    },
    { key: "delivered",  label: "Delivered"  },
    { key: "cancelled",  label: "Cancelled"  },
];

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");

    const filtered = activeTab === "all"
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter((o) => o.status === activeTab);

    return (
        <div className="space-y-5">
            <AccountPageHeader title="My Orders" subtitle="Track, manage and reorder your purchases" />

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map((tab) => {
                    const count = tab.key === "all"
                        ? MOCK_ORDERS.length
                        : MOCK_ORDERS.filter((o) => o.status === tab.key).length;
                    return (
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
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Orders list */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-14 text-center shadow-sm">
                        <p className="text-sm font-medium text-neutral-500">No orders in this category</p>
                    </div>
                )}

                {filtered.map((order) => (
                        <div key={order.id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:border-neutral-200 hover:shadow">
                            {/* Order header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-50 bg-neutral-50/50 px-5 py-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Order ID</p>
                                        <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-bold text-primary-600 hover:underline">
                                            {order.id}
                                        </Link>
                                    </div>
                                    <div className="hidden sm:block h-8 w-px bg-neutral-200" />
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Placed on</p>
                                        <p className="text-sm font-semibold text-neutral-700">{formatOrderDate(order.date)}</p>
                                    </div>
                                    <div className="hidden sm:block h-8 w-px bg-neutral-200" />
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Amount</p>
                                        <p className="text-sm font-bold text-neutral-900">{formatOrderAmount(order.total, order.currency)}</p>
                                    </div>
                                </div>
                                <StatusBadge status={order.status} size="lg" />
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-neutral-50 px-5">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-3.5">
                                        {/* Product icon placeholder */}
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                            <span className="text-[10px] font-bold">{item.sku.slice(0, 3)}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-neutral-800">{item.name}</p>
                                            <p className="mt-0.5 text-xs text-neutral-400">SKU: {item.sku} · Qty: {item.qty}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            {item.price > 0 ? (
                                                <p className="text-sm font-bold text-neutral-900">{formatOrderAmount(item.price * item.qty, item.currency)}</p>
                                            ) : (
                                                <p className="text-xs text-neutral-400 italic">Included</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-50 bg-neutral-50/30 px-5 py-3">
                                <div className="flex flex-wrap gap-2">
                                    {order.tracking && (
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-600">
                                            📦 {order.tracking}
                                        </span>
                                    )}
                                    {order.deliveredDate && (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                                            ✓ Delivered {formatOrderDate(order.deliveredDate)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-800">
                                        <FileDown className="h-3.5 w-3.5" />
                                        Invoice
                                    </button>
                                    <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-800">
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reorder
                                    </button>
                                    <Link
                                        href={`/account/orders/${order.id}`}
                                        className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
                                    >
                                        Details
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                ))}
            </div>
        </div>
    );
}
