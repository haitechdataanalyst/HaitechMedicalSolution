import { InventoryItem } from "@/lib/inventory";
import { Package2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

const ITEM_TYPE_STYLES: Record<string, string> = {
    Sale: "bg-emerald-50 text-emerald-800",
    Demo: "bg-amber-50 text-amber-800",
    Spare: "bg-blue-50 text-blue-800",
};

// One restrained, neutral treatment for every brand — see lib/brand.ts for the
// same decision applied to the main product card.
const NEUTRAL_BRAND_BADGE = "bg-neutral-900/[0.05] text-neutral-700";

const BADGE = "rounded-full px-2.5 py-1 text-xs font-medium";

export default function InventoryItemCard({ item }: { item: InventoryItem }) {
    const inStock = item.StockOnHand > 0;
    const typeStyle = ITEM_TYPE_STYLES[item.ItemType] ?? NEUTRAL_BRAND_BADGE;

    return (
        <div className={cn(SURFACE_CARD, "flex flex-col p-5")}>
            {/* Header row — brand + type */}
            <div className="flex items-start justify-between gap-2">
                <span className={cn(BADGE, NEUTRAL_BRAND_BADGE)}>{item.Brand}</span>
                <span className={cn(BADGE, typeStyle)}>{item.ItemType}</span>
            </div>

            {/* Product name */}
            <h3 className="mt-4 line-clamp-2 text-[15px] leading-snug font-semibold tracking-[-0.01em] text-neutral-900">{item.ProductName || item.OriginalName}</h3>
            {item.Variant && <p className="mt-1 text-[13px] text-neutral-600">{item.Variant}</p>}

            {/* Category trail */}
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                {item.Category}
                {item.Subcategory && item.Subcategory !== item.Category && <> / {item.Subcategory}</>}
            </p>

            {/* Price + stock */}
            <div className="mt-5 flex items-center justify-between gap-2 pb-4">
                {item.SellingPrice > 0 ? (
                    <p className="text-base font-semibold text-neutral-900 tabular-nums">₹{item.SellingPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                ) : (
                    <p className="text-[13px] text-neutral-500">Price on request</p>
                )}

                <p className={cn("flex items-center gap-1 text-[13px] font-medium", inStock ? "text-emerald-700" : "text-neutral-500")}>
                    {inStock ? (
                        <>
                            <Package2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{item.StockOnHand} in stock</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Out of stock</span>
                        </>
                    )}
                </p>
            </div>

            {/* CTA */}
            <Link
                href={`/support/contact?subject=${inStock ? "Quote+Request" : "Restock+Enquiry"}:+${encodeURIComponent(item.ProductName || item.OriginalName)}&product=${encodeURIComponent(item.ProductName || item.OriginalName)}`}
                className={cn(
                    "focus-visible:outline-primary-500 mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-[transform,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]",
                    inStock ? "bg-primary-50 text-primary-800 hover:bg-primary-100" : "bg-neutral-900/[0.05] text-neutral-800 hover:bg-neutral-900/[0.08]"
                )}
            >
                {inStock ? "Request Quote" : "Ask About Restock"}
            </Link>
        </div>
    );
}
