import type { ReactNode } from "react";
import { getDynamicMetadata } from "@/lib/metadata";

// The cart is a transactional page: it is disallowed in robots.txt and also marked noindex, so a link from elsewhere cannot list it.
export const metadata = getDynamicMetadata("Your Cart", "Review the items in your Haitech Medical cart.", { noindex: true });

export default function CartLayout({ children }: { children: ReactNode }) {
    return children;
}
