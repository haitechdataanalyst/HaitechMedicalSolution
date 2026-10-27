import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import AdmetecBrandBadge, { ADMETEC_URL } from "@/components/brand/AdmetecBrandBadge";
import { linkAdmetec } from "@/components/brand/AdmetecText";
import { BRAND_LEAD, BrandFeature, MediaTile } from "@/components/brand/BrandSections";
import { PILL_PRIMARY } from "@/components/ui/surfaces";

// Only facts Admetec states on its own site; Haitech's role is the dealer line below, kept apart from them.
const FACTS = ["Since 2006", "Made in Haifa, Israel", "45+ countries", "Authorised dealer in India"];

const DISTRIBUTORS_URL = `${ADMETEC_URL}/distributors`;

/**
 * Who Admetec is, then what Haitech does for it in India. One short block in place of the generic pillars, so the
 * page says plainly that Admetec makes the product and Haitech is the authorised dealer.
 */
export function AdmetecAbout() {
    return (
        <BrandFeature
            reverse
            eyebrow="About the brand"
            title={linkAdmetec("Admetec, brought to India by Haitech")}
            media={
                <div className="space-y-5">
                    <MediaTile src="/images/products/admetec/ergo/ergo-5.0x-blues-rose-gold.jpg" alt="Admetec Ergo loupes, handcrafted to the clinician's measurements" />
                    {/* The logo is the larger of the two, so it is clear whose product this is and who is the dealer */}
                    <div className="flex items-center justify-center gap-4">
                        <AdmetecBrandBadge size="brand" />
                        <span className="text-primary-800 bg-primary-50 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium">
                            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Authorised Dealer
                        </span>
                    </div>
                </div>
            }
        >
            <p className={BRAND_LEAD}>
                {linkAdmetec(
                    "Admetec is an Israeli company, founded in Haifa in 2006, that designs and manufactures custom ergonomic loupes, LED headlights and the Flamingo procedure camera. Every pair of loupes is handcrafted to the clinician's own measurements, and Admetec develops its optics, electronics and software in-house. Its products are used by dental and medical professionals in more than 45 countries."
                )}
            </p>
            <p className={BRAND_LEAD}>
                {linkAdmetec(
                    "Haitech Medical Solutions is Admetec's authorised dealer in India. We help you choose the right magnification and light, take your fitting measurements, place your order with Admetec, and support you after delivery."
                )}
            </p>

            <div>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-neutral-900/[0.08] pt-6 text-[15px] font-medium text-neutral-900">
                    {FACTS.map((fact) => (
                        <li key={fact}>{fact}</li>
                    ))}
                </ul>
                <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">
                    {linkAdmetec("Haitech Medical Solutions Pvt. Ltd. is listed as Admetec's distributor for India on")}{" "}
                    <a href={DISTRIBUTORS_URL} target="_blank" rel="noopener" className="underline decoration-current/50 underline-offset-2 hover:text-neutral-900">
                        admetec.com
                    </a>
                    .
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/support/contact" className={PILL_PRIMARY}>
                    Book a fitting consultation
                </Link>
                <a href={ADMETEC_URL} target="_blank" rel="noopener" className="btn btn-secondary btn-lg">
                    Visit admetec.com
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
            </div>
        </BrandFeature>
    );
}
