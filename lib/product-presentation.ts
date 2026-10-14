import type { PresentationBlock, Product, Responsive } from "@/types";

/**
 * Fully resolved page presentation for one product, or null when the product
 * has no "presentation" block (it then renders exactly as before).
 *
 * readMoreMinChars defaults follow the description column width times the
 * visible lines: ~45 chars/line at 375px (4 lines ≈ 180), 80–125 between
 * 640 and 1023px (4 lines ≈ 320–500, so 400) and 60–80 in the two-column
 * layout from 1024px (6 lines ≈ 360–480, so 420). Over-estimating only ever shows the full text without a
 * toggle; the clamp is applied only where the toggle is rendered.
 */
export interface ResolvedPresentation {
    sectionNav: boolean;
    quickEnquiry: boolean;
    overviewLines: Responsive<number>;
    overviewReadMoreMinChars: Responsive<number>;
    featuresVisible: Responsive<number>;
    specVisibleRows: number;
}

const DEFAULTS: Omit<ResolvedPresentation, "sectionNav" | "quickEnquiry"> = {
    overviewLines: { base: 4, sm: 4, lg: 6 },
    overviewReadMoreMinChars: { base: 180, sm: 400, lg: 420 },
    featuresVisible: { base: 6, sm: 6, lg: 8 },
    specVisibleRows: 8,
};

export function resolvePresentation(product: Product): ResolvedPresentation | null {
    const block = product.contentBlocks.find((b): b is PresentationBlock => b.type === "presentation");
    if (!block) return null;
    const { data } = block;
    return {
        sectionNav: data.sectionNav ?? false,
        quickEnquiry: data.quickEnquiry ?? false,
        overviewLines: data.overview?.lines ?? DEFAULTS.overviewLines,
        overviewReadMoreMinChars: data.overview?.readMoreMinChars ?? DEFAULTS.overviewReadMoreMinChars,
        featuresVisible: data.features?.visible ?? DEFAULTS.featuresVisible,
        specVisibleRows: data.specifications?.visibleRows ?? DEFAULTS.specVisibleRows,
    };
}
