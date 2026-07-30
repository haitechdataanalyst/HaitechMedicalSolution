import type { Product, SpecificationsBlock, InfoBlock } from "@/types";

export interface TrustBadge {
    icon: "origin" | "warranty" | "certification" | "manufacturer";
    label: string;
}

// Matches whatever a brand's data actually calls the field — no brand list,
// no hardcoded country/certification names. A badge only appears when the
// matching label exists on that specific product's contentBlocks.
const ORIGIN_LABEL = /^(country of origin|origin|made in|country)$/i;
// Exact-label match only — a loose "iso"/"ce" substring match would wrongly
// catch unrelated spec labels like "Short ISO" (a bur sizing code, not a
// quality certification) and manufacture a misleading trust claim.
const CERTIFICATION_LABEL = /^(certifications?|ce mark|ce certification)$/i;

export function getProductTrustBadges(product: Product): TrustBadge[] {
    const badges: TrustBadge[] = [];

    const specRows = product.contentBlocks
        .filter((b): b is SpecificationsBlock => b.type === "specifications")
        .flatMap((b) => b.data.rows ?? b.data.specs ?? []);
    const info = product.contentBlocks.find((b): b is InfoBlock => b.type === "info")?.data;

    const origin = specRows.find((r) => ORIGIN_LABEL.test(r.label.trim()));
    if (origin?.value) badges.push({ icon: "origin", label: `Made in ${origin.value}` });

    if (info?.warranty) badges.push({ icon: "warranty", label: info.warranty });

    const certification = specRows.find((r) => CERTIFICATION_LABEL.test(r.label.trim()));
    if (certification?.value) badges.push({ icon: "certification", label: certification.value });

    if (info?.manufacturer) badges.push({ icon: "manufacturer", label: info.manufacturer });

    return badges;
}
