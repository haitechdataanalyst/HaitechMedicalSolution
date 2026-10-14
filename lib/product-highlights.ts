import type { Product } from "@/types";

// Reads marketing-ready pieces out of a catalogue product's content blocks, so a brand page can feature a
// product without copying its facts into the page. Pure, so it can be checked directly.

export interface NumberedFeature {
    title: string;
    text: string;
}

/**
 * Splits "… 1. Voice Recording: record … 2. AI Editing: instantly …" into items.
 * Only matches "<number>. <short title>: <text>", so decimals like "4.0x" never start an item.
 */
export function parseNumberedFeatures(text: string): NumberedFeature[] {
    const item = /(?:^|\s)\d{1,2}\.\s+([^:]{2,40}):\s*([\s\S]*?)(?=\s\d{1,2}\.\s+[A-Z]|$)/g;
    return [...text.matchAll(item)].map((m) => ({ title: m[1].trim(), text: m[2].trim() }));
}

export function longDescription(product: Product): string {
    const block = product.contentBlocks.find((b) => b.type === "description");
    return block?.type === "description" ? (block.data.secondary ?? block.data.primary ?? "") : "";
}

export function specValue(product: Product, label: string): string | undefined {
    const block = product.contentBlocks.find((b) => b.type === "specifications");
    const rows = block?.type === "specifications" ? (block.data.rows ?? block.data.specs ?? []) : [];
    return rows.find((r) => r.label.toLowerCase() === label.toLowerCase())?.value;
}

export function packageContents(product: Product): string[] {
    const block = product.contentBlocks.find((b) => b.type === "info");
    return block?.type === "info" ? (block.data.packageContents ?? []) : [];
}

export interface LensOption {
    millimetres: number;
    name: string;
}

/** `21 mm "Wide", 25 mm "Focus", 35 mm "Precision"` -> three options. */
export function parseLenses(value: string | undefined): LensOption[] {
    if (!value) return [];
    return [...value.matchAll(/(\d+)\s*mm\s*"([^"]+)"/g)].map((m) => ({ millimetres: Number(m[1]), name: m[2] }));
}
