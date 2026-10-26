import Image from "next/image";
import { cn } from "@/lib/utils";

export const ADMETEC_URL = "https://www.admetec.com";
export const ADMETEC_LOGO_SRC = "/BrandLogo/admetec-logo.webp";
// The file's own size (397 x 100); only the ratio matters, the logo's width is set per context below.
const LOGO_WIDTH = 397;
const LOGO_HEIGHT = 100;

// The logo is always secondary to the heading or label it accompanies, so its width follows that text's size.
// Heights stay in proportion (about 25% of the width); nothing is recoloured, stretched or cropped.
const SIZES = {
    /** Replaces the small manufacturer tag under a product title (13px text): 22px tall. */
    tag: { image: "w-[88px]", link: "-my-2.5 py-2.5" },
    /** Beside a category page heading: 1.875rem, 2.25rem from sm. */
    category: { image: "w-[88px] sm:w-[104px]", link: "min-h-11" },
    /** Beside the brand page name, which is 3rem up to 6rem. */
    brand: { image: "w-[120px] md:w-[150px]", link: "min-h-11" },
} as const;

/**
 * The official Admetec logo, required by Admetec on every Admetec page. The logo itself is the link: it opens
 * www.admetec.com in a new tab. Whether a page shows it is decided where it is used: product pages through the SKU
 * brand (lib/brand.ts), so a new Admetec product gets it without any extra work.
 */
export default function AdmetecBrandBadge({ size, className }: { size: keyof typeof SIZES; className?: string }) {
    const { image, link } = SIZES[size];
    return (
        <span className={cn("inline-flex items-center", className)}>
            <a
                href={ADMETEC_URL}
                target="_blank"
                rel="noopener"
                className={cn("focus-visible:outline-primary-500 inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2", link)}
            >
                {/* unoptimized: the 3 KB file is served exactly as supplied, so the brand colours are never touched */}
                <Image src={ADMETEC_LOGO_SRC} alt="Admetec logo" width={LOGO_WIDTH} height={LOGO_HEIGHT} unoptimized loading="eager" className={cn("h-auto", image)} />
            </a>
        </span>
    );
}
