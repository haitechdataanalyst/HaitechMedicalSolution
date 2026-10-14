"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, FileDown, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { orderApi, Order } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/account";
import { SURFACE_CARD } from "@/components/ui/surfaces";

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
            <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading order">
                <Loader2 className="h-7 w-7 text-neutral-400 motion-safe:animate-spin" aria-hidden="true" />
            </div>
        );
    }

    if (notFound || !order) {
        return (
            <div className={cn(SURFACE_CARD, "px-6 py-16 text-center")}>
                <p className="text-[15px] text-neutral-600">Order not found.</p>
                <Link href="/account/orders" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Orders
                </Link>
            </div>
        );
    }

    const timeline = TIMELINE[order.status] ?? TIMELINE.pending;

    return (
        <div className="space-y-6">
            {/* Back + header */}
            <div>
                <Link
                    href="/account/orders"
                    className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Orders
                </Link>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="font-mono text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-neutral-900 md:text-4xl">#{order.id.slice(0, 8).toUpperCase()}</h1>
                        <p className="mt-2 text-[15px] text-neutral-500">Placed on {fmtDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} size="lg" />
                        <Link href={`/account/orders/${order.id}/invoice`} className="btn btn-secondary btn-md">
                            <FileDown className="h-4 w-4" aria-hidden="true" />
                            Invoice
                        </Link>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <section className={cn(SURFACE_CARD, "px-6 py-6 md:px-7")}>
                <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Order Status</h2>
                <ol className="mt-6 flex items-start">
                    {timeline.steps.map((step, i) => {
                        const done = i <= timeline.current;
                        const active = i === timeline.current;
                        return (
                            <li key={step} className="flex flex-1 flex-col items-center" aria-current={active ? "step" : undefined}>
                                <div className="relative flex w-full items-center">
                                    <div className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : done ? "bg-primary-700" : "bg-neutral-200")} />
                                    <div className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                        done && !active && "bg-primary-800 text-white",
                                        active && "bg-white ring-2 ring-primary-700 ring-offset-2",
                                        !done && "bg-neutral-100"
                                    )}>
                                        {done && !active ? <Check className="h-4 w-4" aria-hidden="true" />
                                            : active ? <span className="h-2.5 w-2.5 rounded-full bg-primary-700" />
                                            : <span className="h-2 w-2 rounded-full bg-neutral-300" />}
                                    </div>
                                    <div className={cn("h-0.5 flex-1", i === timeline.steps.length - 1 ? "bg-transparent" : i < timeline.current ? "bg-primary-700" : "bg-neutral-200")} />
                                </div>
                                <p className={cn("mt-3 px-1 text-center text-xs leading-tight sm:text-[13px]", active ? "font-semibold text-neutral-900" : done ? "font-medium text-neutral-700" : "text-neutral-500")}>
                                    {step}
                                </p>
                            </li>
                        );
                    })}
                </ol>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Items — 2/3 width */}
                <section className={cn(SURFACE_CARD, "overflow-hidden lg:col-span-2")}>
                    <h2 className="px-6 pt-6 text-[17px] font-semibold tracking-[-0.015em] text-neutral-900 md:px-7">
                        Order Items <span className="font-normal text-neutral-500 tabular-nums">({order.items?.length ?? 0})</span>
                    </h2>
                    <ul className="mt-2 divide-y divide-neutral-900/[0.06] px-6 md:px-7">
                        {(order.items ?? []).map((item) => (
                            <li key={item.id} className="flex items-center gap-4 py-4">
                                <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-[13px] font-semibold text-neutral-500">
                                    {(item.productSku ?? item.productName).slice(0, 3).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[15px] font-medium text-neutral-900">{item.productName}</p>
                                    {item.productSku && <p className="mt-0.5 text-[13px] text-neutral-500">SKU: {item.productSku}</p>}
                                    <p className="text-[13px] text-neutral-500 tabular-nums">Qty: {item.quantity}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    {item.totalPrice > 0
                                        ? <p className="text-[15px] font-semibold text-neutral-900 tabular-nums">{fmt(item.totalPrice, order.currency)}</p>
                                        : <p className="text-[13px] text-neutral-500">Included</p>
                                    }
                                    {item.quantity > 1 && item.unitPrice > 0 && (
                                        <p className="text-xs text-neutral-500 tabular-nums">{fmt(item.unitPrice, order.currency)} each</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Total */}
                    <div className="mx-6 flex items-baseline justify-between border-t border-neutral-900/[0.06] py-5 md:mx-7">
                        <span className="text-[15px] font-semibold text-neutral-700">Order Total</span>
                        <span className="text-xl font-semibold tracking-[-0.01em] text-neutral-900 tabular-nums">
                            {order.total ? fmt(order.total, order.currency) : <span className="text-base font-normal text-neutral-500">Quote</span>}
                        </span>
                    </div>
                </section>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment summary */}
                    <section className={cn(SURFACE_CARD, "p-6")}>
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Payment Summary</h2>
                            <span className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                                order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
                            )}>
                                {order.paymentStatus === "paid" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Clock className="h-3.5 w-3.5" aria-hidden="true" />}
                                {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                            </span>
                        </div>
                        <dl className="mt-5 space-y-2.5 text-[15px]">
                            {[
                                { label: "Subtotal",      value: fmt(order.subtotal, order.currency) },
                                { label: "Tax",           value: order.tax ? fmt(order.tax, order.currency) : "—" },
                                { label: "Shipping",      value: order.shippingFee ? fmt(order.shippingFee, order.currency) : "Free" },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <dt className="text-neutral-600">{row.label}</dt>
                                    <dd className="font-medium text-neutral-900 tabular-nums">{row.value}</dd>
                                </div>
                            ))}
                            <div className="flex items-baseline justify-between border-t border-neutral-900/[0.06] pt-3">
                                <dt className="font-semibold text-neutral-900">Total</dt>
                                <dd className="text-lg font-semibold text-neutral-900 tabular-nums">{order.total ? fmt(order.total, order.currency) : "—"}</dd>
                            </div>
                        </dl>
                    </section>

                    {/* Notes */}
                    {order.notes && (
                        <section className={cn(SURFACE_CARD, "p-6")}>
                            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-neutral-900">Order Notes</h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{order.notes}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
