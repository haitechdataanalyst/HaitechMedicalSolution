import type { ReactNode } from "react";
import { getDynamicMetadata } from "@/lib/metadata";

// Checkout is transactional and behind sign-in: noindex in addition to the robots.txt rule.
export const metadata = getDynamicMetadata("Checkout", "Complete your Haitech Medical order.", { noindex: true });

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return children;
}
