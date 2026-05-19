import { InventoryItem } from "@/lib/inventory";
import { Package2, Tag, Layers, AlertCircle } from "lucide-react";
import Link from "next/link";

const ITEM_TYPE_STYLES: Record<string, string> = {
    Sale:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Demo:   "bg-amber-50  text-amber-700  border border-amber-200",
    Spare:  "bg-blue-50   text-blue-700   border border-blue-200",
};

const BRAND_COLORS: Record<string, string> = {
    Admetec: "bg-indigo-100 text-indigo-800",
    Medesy:  "bg-rose-100   text-rose-800",
    Strauss: "bg-violet-100 text-violet-800",
    Salli:   "bg-teal-100   text-teal-800",
    Almadent:"bg-orange-100 text-orange-800",
};

export default function InventoryItemCard({ item }: { item: InventoryItem }) {
    const inStock    = item.StockOnHand > 0;
    const typeStyle  = ITEM_TYPE_STYLES[item.ItemType] ?? "bg-neutral-100 text-neutral-600";
    const brandStyle = BRAND_COLORS[item.Brand]        ?? "bg-neutral-100 text-neutral-700";

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-100 hover:shadow-[0_8px_24px_rgba(31,182,205,0.10)] active:translate-y-0">
            {/* Header row — brand + type */}
            <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${brandStyle}`}>{item.Brand}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle}`}>{item.ItemType}</span>
            </div>

            {/* Product name */}
            <div>
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
                    {item.ProductName || item.OriginalName}
                </p>
                {item.Variant && (
                    <p className="mt-0.5 text-xs text-neutral-500">{item.Variant}</p>
                )}
            </div>

            {/* Category breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Layers size={11} />
                <span>{item.Category}</span>
                {item.Subcategory && item.Subcategory !== item.Category && (
                    <>
                        <span>/</span>
                        <span>{item.Subcategory}</span>
                    </>
                )}
            </div>

            {/* SKU */}
            <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Tag size={11} />
                <span className="font-mono">{item.StandardSKU || item.OriginalSKU}</span>
            </div>

            {/* Price + stock */}
            <div className="flex items-center justify-between border-t border-neutral-50 pt-1">
                <div>
                    {item.SellingPrice > 0 ? (
                        <p className="text-sm font-bold text-neutral-800">
                            ₹{item.SellingPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                    ) : (
                        <p className="text-xs italic text-neutral-400">Price on request</p>
                    )}
                </div>

                <div className={`flex items-center gap-1 text-xs font-medium ${inStock ? "text-emerald-600" : "text-neutral-400"}`}>
                    {inStock ? (
                        <>
                            <Package2 size={12} />
                            <span>{item.StockOnHand} in stock</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={12} />
                            <span>Out of stock</span>
                        </>
                    )}
                </div>
            </div>

            {/* CTA */}
            <Link
                href={`/support/contact?subject=Quote+Request:+${encodeURIComponent(item.StandardSKU || item.OriginalSKU)}&product=${encodeURIComponent(item.ProductName || item.OriginalName)}`}
                className="mt-auto block w-full rounded-full border border-neutral-200 py-2 text-center text-xs font-medium text-neutral-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
            >
                Request Quote
            </Link>
        </div>
    );
}
