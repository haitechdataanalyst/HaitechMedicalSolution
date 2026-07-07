"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { ordersApi } from "@/lib/api";

type Invoice = {
    invoiceNo: string;
    orderId: string;
    items: { id: string; productName: string; productSku: string | null; quantity: number; unitPrice: number; totalPrice: number }[];
    total: number;
    currency: string;
};

const fmt = (paise: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        ordersApi
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
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            </div>
        );
    }

    if (notFound || !invoice) {
        return (
            <div className="rounded-2xl border border-neutral-100 bg-white px-6 py-14 text-center shadow-sm">
                <p className="text-sm font-medium text-neutral-500">Invoice not available for this order yet.</p>
                <Link href={`/account/orders/${id}`} className="mt-3 inline-block text-xs font-semibold text-primary-600 hover:underline">
                    ← Back to Order
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between print:hidden">
                <Link href={`/account/orders/${id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-primary-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Order
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                    <Printer className="h-4 w-4" />
                    Print / Save as PDF
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm print:border-0 print:shadow-none">
                <div className="flex items-start justify-between border-b border-neutral-100 p-8">
                    <div>
                        <p className="text-lg font-bold text-neutral-900">Haitech Medical Solutions Pvt. Ltd.</p>
                        <p className="mt-1 text-xs text-neutral-500">info@haitechmedical.com.au</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Invoice</p>
                        <p className="mt-1 font-mono text-sm font-bold text-neutral-900">{invoice.invoiceNo}</p>
                        <p className="mt-1 text-xs text-neutral-400">Order #{invoice.orderId.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                            <th className="px-8 py-3 font-semibold">Item</th>
                            <th className="px-3 py-3 font-semibold">SKU</th>
                            <th className="px-3 py-3 text-center font-semibold">Qty</th>
                            <th className="px-3 py-3 text-right font-semibold">Unit Price</th>
                            <th className="px-8 py-3 text-right font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {invoice.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-8 py-3 text-neutral-800">{item.productName}</td>
                                <td className="px-3 py-3 text-neutral-500">{item.productSku ?? "—"}</td>
                                <td className="px-3 py-3 text-center text-neutral-600">{item.quantity}</td>
                                <td className="px-3 py-3 text-right text-neutral-600">{fmt(item.unitPrice, invoice.currency)}</td>
                                <td className="px-8 py-3 text-right font-semibold text-neutral-900">{fmt(item.totalPrice, invoice.currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-end border-t border-neutral-100 bg-neutral-50/50 px-8 py-4">
                    <span className="mr-4 text-sm font-semibold text-neutral-600">Total</span>
                    <span className="text-xl font-bold text-neutral-900">{fmt(invoice.total, invoice.currency)}</span>
                </div>
            </div>
        </div>
    );
}
