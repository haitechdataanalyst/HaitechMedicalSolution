/**
 * Search titles and descriptions for the Admetec loupe pages, so "dental loupes in India" is said on each of them.
 * Pure and import-free (testable with node --test). Every figure comes from the catalogue's own spec rows or the
 * existing Admetec copy (lib/admetec-faq.ts, data/categories.json); nothing new is claimed.
 */
export interface SeoText {
    title: string;
    description?: string;
}

interface SpecRowLike {
    label?: string;
    value?: string;
}

/** Galilean (G), prismatic (P) and Ergo (E) loupes, plus Ergo-V (EV) and Ergo-V PRO (EVP); not lights, frames or the camera. */
const LOUPE_SKU = /^ADM-(?:[GPE]-\d+|EVP?)$/;
const SOLD_BY = "Supplied by Haitech Medical.";

const withoutNote = (value?: string) => value?.replace(/\s*\(.*\)$/, "").trim();

/** "Admetec Prismatic 3.8x dental loupes in India: 90mm field of view at 450mm working distance, ..." */
export function admetecLoupeSeo(sku: string, name: string, rows: SpecRowLike[]): SeoText | undefined {
    if (!LOUPE_SKU.test(sku)) return undefined;
    const row = (label: string) => rows.find((r) => r.label?.trim() === label)?.value;
    const workingDistance = withoutNote(row("Working Distance"));
    const fieldOfView = row("Field of View")?.trim();
    const magnifications = withoutNote(row("Magnification Options"));

    const facts = magnifications ? `switchable ${magnifications} magnification` : fieldOfView && workingDistance ? `${fieldOfView} field of view at ${workingDistance} working distance` : undefined;

    return {
        title: `${name} Dental Loupes in India`,
        description: facts ? `${name} dental loupes in India: ${facts}, made to your measurements. ${SOLD_BY}` : undefined,
    };
}

/** Keyed by category slug; only the five Admetec categories that list loupes, cameras or lights. */
export const ADMETEC_CATEGORY_SEO: Record<string, Required<SeoText>> = {
    admetec: {
        title: "Admetec Loupes, Headlights & Camera in India",
        description: "Admetec dental loupes, LED headlights and the Flamingo loupe camera in India: Galilean, prismatic, Ergo and Ergo V. Authorised dealer: Haitech Medical.",
    },
    "galilean-loupes": {
        title: "Admetec Galilean Loupes 2.5x to 3.2x in India",
        description: "Admetec Galilean dental loupes in India: lightweight with a wide field of view, at 2.5x, 2.7x and 3.2x, made to your measurements. Supplied by Haitech Medical.",
    },
    "prismatic-loupes": {
        title: "Admetec Prismatic Loupes 3.8x to 7.2x in India",
        description: "Admetec prismatic (Keplerian) dental loupes in India at 3.8x, 4.8x, 5.8x and 7.2x: high magnification and a true-colour image. Supplied by Haitech Medical.",
    },
    "ergo-loupes": {
        title: "Admetec Ergo Loupes 3.0x to 10x in India",
        description: "Admetec Ergo dental loupes in India from 3.0x to 10x, with an ergonomic declination angle for natural posture. Made to your measurements; from Haitech Medical.",
    },
    "ergo-v-series": {
        title: "Admetec Ergo V and Ergo V Pro Loupes in India",
        description: "Admetec Ergo V and Ergo V Pro dental loupes in India: switchable magnification in one device, made to your measurements. Supplied by Haitech Medical.",
    },
};
