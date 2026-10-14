"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { orderApi, Invoice } from "@/lib/api";
import { SURFACE_CARD } from "@/components/ui/surfaces";

const fmt = (paise: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        orderApi
            .getInvoice(id)
            .then((res) => {
                if (res.success && res.data?.invoice) {
                    setInvoice(res.data.invoice);
                } else {
                    setNotFound(true);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading invoice">
                <Loader2 className="h-7 w-7 text-neutral-400 motion-safe:animate-spin" aria-hidden="true" />
            </div>
        );
    }

    if (notFound || !invoice) {
        return (
            <div className={`${SURFACE_CARD} px-6 py-16 text-center`}>
                <p className="text-[15px] text-neutral-600">Invoice not available for this order yet.</p>
                <Link href={`/account/orders/${id}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Order
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 print:space-y-0">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                <Link
                    href={`/account/orders/${id}`}
                    className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-neutral-600 transition-colors duration-200 ease-out hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Order
                </Link>
                <button type="button" onClick={() => window.print()} className="btn btn-primary btn-md">
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    Print / Save as PDF
                </button>
            </div>

            {/* Invoice sheet — plain black-on-white in print, no shadows or rings */}
            <article className={`${SURFACE_CARD} overflow-hidden print:rounded-none print:shadow-none print:ring-0`}>
                <header className="flex flex-wrap items-start justify-between gap-6 px-6 pt-8 pb-6 md:px-10 md:pt-10 print:px-0">
                    <div>
                        <p className="text-lg font-semibold tracking-[-0.01em] text-neutral-900">Haitech Medical Solutions Pvt. Ltd.</p>
                        <p className="mt-1 text-[13px] text-neutral-600">sales@haitech-group.com</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-[13px] font-medium text-neutral-500 print:text-neutral-700">Invoice</p>
                        <p className="mt-1 font-mono text-[15px] font-semibold text-neutral-900">{invoice.invoiceNo}</p>
                        <p className="mt-1 text-[13px] text-neutral-500 print:text-neutral-700">Order #{invoice.orderId.slice(0, 8).toUpperCase()}</p>
                    </div>
                </header>

                <div className="overflow-x-auto px-6 md:px-10 print:overflow-visible print:px-0">
                    <table className="w-full min-w-[520px] text-sm print:min-w-0">
                        <thead>
                            <tr className="border-y border-neutral-900/10 text-left text-[13px] text-neutral-500 print:text-neutral-700">
                                <th scope="col" className="py-3 pr-3 font-medium">Item</th>
                                <th scope="col" className="px-3 py-3 font-medium">SKU</th>
                                <th scope="col" className="px-3 py-3 text-center font-medium">Qty</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium">Unit Price</th>
                                <th scope="col" className="py-3 pl-3 text-right font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900/[0.06]">
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="break-inside-avoid">
                                    <td className="py-3.5 pr-3 text-neutral-900">{item.productName}</td>
                                    <td className="px-3 py-3.5 text-neutral-600">{item.productSku ?? "—"}</td>
                                    <td className="px-3 py-3.5 text-center text-neutral-700 tabular-nums">{item.quantity}</td>
                                    <td className="px-3 py-3.5 text-right text-neutral-700 tabular-nums">{fmt(item.unitPrice, invoice.currency)}</td>
                                    <td className="py-3.5 pl-3 text-right font-semibold text-neutral-900 tabular-nums">{fmt(item.totalPrice, invoice.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mx-6 mt-2 flex items-baseline justify-end gap-6 border-t border-neutral-900/10 py-6 md:mx-10 print:mx-0">
                    <span className="text-[15px] font-semibold text-neutral-700">Total</span>
                    <span className="text-2xl font-semibold tracking-[-0.015em] text-neutral-900 tabular-nums">{fmt(invoice.total, invoice.currency)}</span>
                </div>
            </article>
        </div>
    );
}
