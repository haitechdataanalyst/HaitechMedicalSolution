import { Globe, ShieldCheck, BadgeCheck, Factory } from "lucide-react";
import type { Product } from "@/types";
import { getProductTrustBadges, type TrustBadge } from "@/lib/product-badges";

const ICONS: Record<TrustBadge["icon"], typeof Globe> = {
    origin: Globe,
    warranty: ShieldCheck,
    certification: BadgeCheck,
    manufacturer: Factory,
};

export default function TrustBadges({ product }: { product: Product }) {
    const badges = getProductTrustBadges(product);
    if (badges.length === 0) return null;

    return (
        <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Product highlights">
            {badges.map((badge) => {
                const Icon = ICONS[badge.icon];
                return (
                    <li key={badge.icon} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                        <Icon className="text-primary-700 h-4 w-4 shrink-0" aria-hidden="true" />
                        {badge.label}
                    </li>
                );
            })}
        </ul>
    );
}
