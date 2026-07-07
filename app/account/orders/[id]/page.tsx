"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, FileDown, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { orderApi, Order } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/account";

const fmt = (paise: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const TIMELINE: Record<string, { steps: string[]; current: number }> = {
    delivered:  { steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"], current: 3 },
    shipped:    { steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"], current: 2 },
    confirmed:  { steps: ["Order Placed", "Confirmed", "Preparing", "Shipped"], current: 1 },
    pending:    { steps: ["Order Placed", "Confirmed", "Preparing", "Shipped"], current: 0 },
    cancelled:  { steps: ["Order Placed", "Cancelled"],                          current: 1 },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        orderApi.getOrder(id).then((res) => {
            if (res.success && res.data?.order) {
                setOrder(res.data.order);
            } else {
                setNotFound(true);
            }
        }).catch(() => setNotFound(true))
          .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            </div>
        );
    }

    if (notFound || !order) {
        return (
            <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-14 text-center shadow-sm">
                <p className="text-sm font-medium text-neutral-500">Order not found.</p>
                <Link href="/account/orders" className="mt-3 inline-block text-xs font-semibold text-primary-600 hover:underline">← Back to Orders</Link>
            </div>
        );
    }

    const timeline = TIMELINE[order.status] ?? TIMELINE.pending;

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
                        <h1 className="font-mono text-xl font-bold text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</h1>
                        <p className="mt-0.5 text-sm text-neutral-500">Placed on {fmtDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/account/orders/${order.id}/invoice`}
                            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition-all hover:border-neutral-300 hover:shadow-sm"
                        >
                            <FileDown className="h-4 w-4" />
                            Invoice
                        </Link>
                        <StatusBadge status={order.status} size="lg" />
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="border-b border-neutral-50 px-6 py-4">
                    <h2 className="text-sm font-bold text-neutral-900">Order Status</h2>
                </div>
                <div className="px-6 py-6">
                    <div className="flex items-start">
                        {timeline.steps.map((step, i) => {
                            const done = i <= timeline.current;
                            const active = i === timeline.current;
                            return (
                                <div key={step} className="flex flex-1 flex-col items-center">
                                    <div className="relative flex w-full items-center">
                                        {i > 0 && <div className={cn("h-0.5 flex-1", done ? "bg-primary-400" : "bg-neutral-200")} />}
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                                            done && !active ? "border-primary-500 bg-primary-500 text-white" : "",
                                            active ? "border-primary-500 bg-white shadow-[0_0_0_4px_rgba(31,182,205,0.15)]" : "",
                                            !done ? "border-neutral-200 bg-white text-neutral-300" : ""
                                        )}>
                                            {done && !active ? <CheckCircle2 className="h-4 w-4" />
                                                : active ? <span className="h-3 w-3 rounded-full bg-primary-500" />
                                                : <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />}
                                        </div>
                                        {i < timeline.steps.length - 1 && <div className={cn("h-0.5 flex-1", i < timeline.current ? "bg-primary-400" : "bg-neutral-200")} />}
                                    </div>
                                    <p className={cn("mt-2 text-center text-[10px] font-semibold leading-tight", active ? "text-primary-600" : done ? "text-neutral-600" : "text-neutral-300")}>
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                {/* Items — 2/3 width */}
                <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-neutral-50 px-6 py-4">
                        <h2 className="text-sm font-bold text-neutral-900">Order Items ({order.items?.length ?? 0})</h2>
                    </div>
                    <div className="divide-y divide-neutral-50">
                        {(order.items ?? []).map((item) => (
                            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-500">
                                    {(item.productSku ?? item.productName).slice(0, 3).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-neutral-800">{item.productName}</p>
                                    {item.productSku && <p className="mt-0.5 text-xs text-neutral-400">SKU: {item.productSku}</p>}
                                    <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    {item.totalPrice > 0
                                        ? <p className="text-base font-bold text-neutral-900">{fmt(item.totalPrice, order.currency)}</p>
                                        : <p className="text-xs italic text-neutral-400">Included</p>
                                    }
                                    {item.quantity > 1 && item.unitPrice > 0 && (
                                        <p className="text-[11px] text-neutral-400">{fmt(item.unitPrice, order.currency)} each</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-6 py-4">
                        <span className="text-sm font-semibold text-neutral-600">Order Total</span>
                        <span className="text-xl font-bold text-neutral-900">
                            {order.total ? fmt(order.total, order.currency) : <span className="italic text-neutral-400 text-base">Quote</span>}
                        </span>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Payment summary */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                        <div className="border-b border-neutral-50 px-5 py-3">
                            <h2 className="text-xs font-bold text-neutral-700">Payment Summary</h2>
                        </div>
                        <div className="space-y-2.5 p-5">
                            {[
                                { label: "Subtotal",      value: fmt(order.subtotal, order.currency) },
                                { label: "Tax",           value: order.tax ? fmt(order.tax, order.currency) : "—" },
                                { label: "Shipping",      value: order.shippingFee ? fmt(order.shippingFee, order.currency) : "Free" },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-500">{row.label}</span>
                                    <span className="font-semibold text-neutral-700">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 text-sm font-bold">
                                <span className="text-neutral-800">Total</span>
                                <span className="text-neutral-900">{order.total ? fmt(order.total, order.currency) : "—"}</span>
                            </div>
                            <div className="pt-1">
                                <span className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                    order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                )}>
                                    {order.paymentStatus === "paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                    {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                            <div className="border-b border-neutral-50 px-5 py-3">
                                <h2 className="text-xs font-bold text-neutral-700">Order Notes</h2>
                            </div>
                            <p className="p-5 text-sm text-neutral-600 leading-relaxed">{order.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
