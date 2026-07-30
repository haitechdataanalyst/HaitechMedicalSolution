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
        <ul className="flex flex-wrap gap-2" aria-label="Product highlights">
            {badges.map((badge) => {
                const Icon = ICONS[badge.icon];
                return (
                    <li key={badge.icon} className="label-tag label-tag-neutral text-[11px] font-semibold normal-case tracking-normal">
                        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {badge.label}
                    </li>
                );
            })}
        </ul>
    );
}
