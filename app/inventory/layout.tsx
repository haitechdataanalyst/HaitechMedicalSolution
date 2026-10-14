import type { ReactNode } from "react";
import { getDynamicMetadata } from "@/lib/metadata";

// The inventory pages are a stock tool, deliberately left out of the sitemap. They are not blocked in robots.txt, because a
// blocked page cannot show its noindex; noindex keeps them out of search while links on them are still followed.
export const metadata = getDynamicMetadata("Inventory", "Haitech Medical inventory listing.", { noindex: true });

export default function InventoryLayout({ children }: { children: ReactNode }) {
    return children;
}
