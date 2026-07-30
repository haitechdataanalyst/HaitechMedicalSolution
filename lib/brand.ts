export interface BrandInfo {
    name: string;
    cls: string;
}

// One restrained, neutral treatment for every brand — a manufacturer label is
// informational metadata, not a decorative marketplace tag. The site's single
// primary color stays reserved for actionable/interactive emphasis.
const NEUTRAL_BADGE = "bg-neutral-100 text-neutral-600 border-neutral-200";

export const BRAND_MAP: Record<string, BrandInfo> = {
    ADM: { name: "Admetec",  cls: NEUTRAL_BADGE },
    MED: { name: "Medesy",   cls: NEUTRAL_BADGE },
    SAL: { name: "Salli",    cls: NEUTRAL_BADGE },
    ALM: { name: "Almadent", cls: NEUTRAL_BADGE },
    BON: { name: "Bondent",  cls: NEUTRAL_BADGE },
};

const STRAUSS: BrandInfo = { name: "Strauss", cls: NEUTRAL_BADGE };

export function detectBrand(sku: string): BrandInfo {
    const prefix = sku.split("-")[0].toUpperCase();
    return BRAND_MAP[prefix] ?? STRAUSS;
}

// Capital equipment — dental chairs, saddle chairs, and prescription loupe
// systems — is bought by clinics through a quote/consultation, never instant
// checkout, regardless of what an e-commerce default would suggest. Diamond
// burs and hand instruments are genuine consumables and stay on instant
// Add to Cart + Buy Now. See DESIGN_PRINCIPLES.md — "Consideration-based
// purchase flow" — before adding or removing a brand from this set.
const CONSULTATION_BRANDS = new Set(["Admetec", "Almadent", "Salli"]);

export function requiresConsultation(brandName: string): boolean {
    return CONSULTATION_BRANDS.has(brandName);
}
