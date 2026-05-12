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
    const typeStyle  = ITEM_TYPE_STYLES[item.ItemType] ?? "bg-gray-100 text-gray-600";
    const brandStyle = BRAND_COLORS[item.Brand]        ?? "bg-gray-100 text-gray-700";

    return (
        <div className="card flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Header row — brand + type */}
            <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${brandStyle}`}>{item.Brand}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle}`}>{item.ItemType}</span>
            </div>

            {/* Product name */}
            <div>
                <p className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
                    {item.ProductName || item.OriginalName}
                </p>
                {item.Variant && (
                    <p className="mt-0.5 text-xs text-gray-500">{item.Variant}</p>
                )}
            </div>

            {/* Category breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
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
            <div className="flex items-center gap-1 text-xs text-gray-400">
                <Tag size={11} />
                <span className="font-mono">{item.StandardSKU || item.OriginalSKU}</span>
            </div>

            {/* Price + stock */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <div>
                    {item.SellingPrice > 0 ? (
                        <p className="text-sm font-bold text-gray-800">
                            ₹{item.SellingPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400 italic">Price on request</p>
                    )}
                </div>

                <div className={`flex items-center gap-1 text-xs font-medium ${inStock ? "text-emerald-600" : "text-gray-400"}`}>
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
                className="mt-auto block w-full rounded-lg border border-gray-200 py-2 text-center text-xs font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
                Request Quote
            </Link>
        </div>
    );
}
