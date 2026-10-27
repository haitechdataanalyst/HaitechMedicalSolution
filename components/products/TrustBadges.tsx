import type { ReactNode } from "react";
import { Globe, ShieldCheck, BadgeCheck, Factory } from "lucide-react";
import type { Product } from "@/types";
import { getProductTrustBadges, type TrustBadge } from "@/lib/product-badges";
import { linkAdmetec } from "@/components/brand/AdmetecText";

const ICONS: Record<TrustBadge["icon"], typeof Globe> = {
    origin: Globe,
    warranty: ShieldCheck,
    certification: BadgeCheck,
    manufacturer: Factory,
};

/** `manufacturerLogo`, when given, stands in for the manufacturer's text tag, and is shown even if the product has no such tag. */
export default function TrustBadges({ product, manufacturerLogo }: { product: Product; manufacturerLogo?: ReactNode }) {
    const all = getProductTrustBadges(product);
    const badges = manufacturerLogo ? all.filter((badge) => badge.icon !== "manufacturer") : all;
    if (badges.length === 0 && !manufacturerLogo) return null;

    return (
        <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Product highlights">
            {badges.map((badge) => {
                const Icon = ICONS[badge.icon];
                return (
                    <li key={badge.icon} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                        <Icon className="text-primary-700 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{linkAdmetec(badge.label)}</span>
                    </li>
                );
            })}
            {manufacturerLogo && <li className="inline-flex items-center">{manufacturerLogo}</li>}
        </ul>
    );
}
