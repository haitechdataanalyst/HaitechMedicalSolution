"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, RotateCcw, FileDown, CheckCircle2, Clock, Truck, Package } from "lucide-react";
import { MOCK_ORDERS, formatOrderAmount, formatOrderDate } from "@/lib/mock-account";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/account";
import { use } from "react";

const TIMELINE: Record<string, { steps: string[]; current: number }> = {
    delivered:  { steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"], current: 3 },
    shipped:    { steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"], current: 2 },
    processing: { steps: ["Order Placed", "Confirmed", "Preparing", "Shipped"], current: 1 },
    pending:    { steps: ["Order Placed", "Confirmed", "Preparing", "Shipped"], current: 0 },
    cancelled:  { steps: ["Order Placed", "Cancelled"], current: 1 },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) notFound();

    const timeline = TIMELINE[order.status] ?? TIMELINE.processing;

    return (
        <div className="space-y-5">
            {/* Back + header */}
            <div>
                <Link href="/account/orders" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-primary-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Orders
                </Link>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="font-mono text-xl font-bold text-neutral-900">{order.id}</h1>
                        <p className="mt-0.5 text-sm text-neutral-500">Placed on {formatOrderDate(order.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition-all hover:border-neutral-300 hover:shadow-sm">
                            <FileDown className="h-4 w-4" />
                            GST Invoice
                        </button>
                        <button className="flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600">
                            <RotateCcw className="h-4 w-4" />
                            Reorder
                        </button>
                    </div>
                </div>
            </div>

            {/* Status + Timeline */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
                    <h2 className="text-sm font-bold text-neutral-900">Order Status</h2>
                    <StatusBadge status={order.status} size="lg" />
                </div>
                <div className="px-6 py-6">
                    {/* Timeline track */}
                    <div className="flex items-start">
                        {timeline.steps.map((step, i) => {
                            const done = i <= timeline.current;
                            const active = i === timeline.current;
                            return (
                                <div key={step} className="flex flex-1 flex-col items-center">
                                    <div className="relative flex w-full items-center">
                                        {/* Left line */}
                                        {i > 0 && (
                                            <div className={cn("h-0.5 flex-1", done ? "bg-primary-400" : "bg-neutral-200")} />
                                        )}
                                        {/* Circle */}
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                                            done && !active ? "border-primary-500 bg-primary-500 text-white" : "",
                                            active ? "border-primary-500 bg-white shadow-[0_0_0_4px_rgba(31,182,205,0.15)]" : "",
                                            !done ? "border-neutral-200 bg-white text-neutral-300" : ""
                                        )}>
                                            {done && !active ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : active ? (
                                                <span className="h-3 w-3 rounded-full bg-primary-500" />
                                            ) : (
                                                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                                            )}
                                        </div>
                                        {/* Right line */}
                                        {i < timeline.steps.length - 1 && (
                                            <div className={cn("h-0.5 flex-1", i < timeline.current ? "bg-primary-400" : "bg-neutral-200")} />
                                        )}
                                    </div>
                                    <p className={cn("mt-2 text-center text-[10px] font-semibold leading-tight", active ? "text-primary-600" : done ? "text-neutral-600" : "text-neutral-300")}>
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {order.tracking && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                            <Truck className="h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-xs font-semibold text-amber-800">Tracking Number</p>
                                <p className="font-mono text-sm font-bold text-amber-700">{order.tracking}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                {/* Items — takes 2/3 */}
                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-neutral-50 px-6 py-4">
                        <h2 className="text-sm font-bold text-neutral-900">Order Items ({order.items.length})</h2>
                    </div>
                    <div className="divide-y divide-neutral-50">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 px-6 py-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-500">
                                    {item.sku.slice(0, 3)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-neutral-800">{item.name}</p>
                                    <p className="mt-0.5 text-xs text-neutral-400">SKU: {item.sku}</p>
                                    <p className="text-xs text-neutral-400">Qty: {item.qty}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    {item.price > 0 ? (
                                        <p className="text-base font-bold text-neutral-900">{formatOrderAmount(item.price * item.qty, item.currency)}</p>
                                    ) : (
                                        <p className="text-xs italic text-neutral-400">Included free</p>
                                    )}
                                    {item.qty > 1 && item.price > 0 && (
                                        <p className="text-[11px] text-neutral-400">{formatOrderAmount(item.price, item.currency)} each</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Total row */}
                    <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-6 py-4">
                        <span className="text-sm font-semibold text-neutral-600">Order Total</span>
                        <span className="text-xl font-bold text-neutral-900">{formatOrderAmount(order.total, order.currency)}</span>
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="space-y-4">
                    {/* Delivery address */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                        <div className="border-b border-neutral-50 px-5 py-3">
                            <h2 className="text-xs font-bold text-neutral-700">Delivery Address</h2>
                        </div>
                        <div className="p-5">
                            <div className="flex gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                                <p className="text-sm leading-relaxed text-neutral-600">{order.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment summary */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                        <div className="border-b border-neutral-50 px-5 py-3">
                            <h2 className="text-xs font-bold text-neutral-700">Payment Summary</h2>
                        </div>
                        <div className="space-y-2.5 p-5">
                            {[
                                { label: "Subtotal",     value: formatOrderAmount(Math.round(order.total / 1.18), order.currency) },
                                { label: "GST (18%)",    value: formatOrderAmount(order.total - Math.round(order.total / 1.18), order.currency) },
                                { label: "Shipping",     value: "Free" },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-500">{row.label}</span>
                                    <span className="font-semibold text-neutral-700">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 text-sm font-bold">
                                <span className="text-neutral-800">Total Paid</span>
                                <span className="text-neutral-900">{formatOrderAmount(order.total, order.currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
