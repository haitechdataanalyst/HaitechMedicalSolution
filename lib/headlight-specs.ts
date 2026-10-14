import type { HeadlightCategory, HeadlightProduct } from "@/types";

// Turns the "Label: value" feature lines in data/headlights.json into structured specs and headline figures.
// Pure, so it can be checked directly.

export interface HeadlightSpec {
    label: string;
    value: string;
}

export interface ParsedFeatures {
    specs: HeadlightSpec[];
    /** Feature lines that are not "Label: value" (e.g. "Accessory for …"). */
    notes: string[];
}

const MAX_LABEL_LENGTH = 24;

/** Defensive: drops U+FFFD (the "unknown character" mark) if an imported data file ever loses a symbol such as ™. */
export function cleanText(text: string): string {
    return text.replace(/�/g, "");
}

export function parseFeatures(features: string[]): ParsedFeatures {
    const specs: HeadlightSpec[] = [];
    const notes: string[] = [];
    for (const raw of features) {
        const line = cleanText(raw);
        const colon = line.indexOf(":");
        if (colon > 0 && colon <= MAX_LABEL_LENGTH) {
            specs.push({ label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() });
        } else {
            notes.push(line);
        }
    }
    return { specs, notes };
}

export function specOf(product: HeadlightProduct, label: string): string | undefined {
    return parseFeatures(product.features).specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
}

/** Leading number of a spec value, with a "K" suffix read as thousands ("150K LUX" -> 150000, "11 gr" -> 11). */
function leadingNumber(value: string | undefined): number | null {
    const match = value?.match(/^([\d.,]+)\s*(K)?/i);
    if (!match) return null;
    const n = parseFloat(match[1].replace(/,/g, ""));
    return Number.isNaN(n) ? null : match[2] ? n * 1000 : n;
}

export interface HeadlightFigures {
    models: number;
    maxIntensity?: string;
    lightestWeight?: string;
    colorTemperature?: string;
}

function extreme(products: HeadlightProduct[], label: string, pick: "max" | "min"): string | undefined {
    let best: { n: number; value: string } | null = null;
    for (const product of products) {
        const value = specOf(product, label);
        const n = leadingNumber(value);
        if (value === undefined || n === null) continue;
        if (!best || (pick === "max" ? n > best.n : n < best.n)) best = { n, value };
    }
    return best?.value;
}

export function headlightFigures(categories: HeadlightCategory[]): HeadlightFigures {
    const models = categories.flatMap((c) => c.products).filter((p) => !p.isAccessory);
    return {
        models: models.length,
        maxIntensity: extreme(models, "Intensity", "max"),
        lightestWeight: extreme(models, "Weight", "min"),
        colorTemperature: models.map((p) => specOf(p, "Color temp.")).find((v) => v !== undefined),
    };
}

/** Highest intensity within one series, for series cards. */
export function seriesMaxIntensity(category: HeadlightCategory): string | undefined {
    return extreme(
        category.products.filter((p) => !p.isAccessory),
        "Intensity",
        "max"
    );
}
