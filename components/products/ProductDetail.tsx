"use client";

import { useCallback, useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Product, Frame, HeadlightCategory } from "@/types";
import ContentRenderer from "./ContentRenderer";
import ProductGrid from "./ProductGrid";
import { CompareActionPanel, InlineComparisonSection } from "@/components/compare";
import { detectBrand } from "@/lib/brand";
import { isCatalogueProductId } from "@/lib/headlight-products";
import { resolvePresentation } from "@/lib/product-presentation";
import TrustBadges from "./TrustBadges";
import { FAQ } from "@/components/misc/FAQ";
import { DescriptionBlock } from "./blocks";
import ProductQuoteModal from "./blocks/ProductQuoteModal";
import ProductSectionNav, { SectionNavLink } from "./ProductSectionNav";
import MobileEnquiryBar from "./MobileEnquiryBar";
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/misc/SectionHeader";

// Product with computed path for linking
interface ProductWithPath extends Product {
    path: string;
}

interface ProductDetailProps {
    product: Product;
    relatedProducts?: ProductWithPath[];
    accessories?: ProductWithPath[];
    frames?: Frame[];
    headlightCategories?: HeadlightCategory[];
    /** "Related Products" for curated lists, "More Endo Motor" for same-category fallbacks. */
    relatedTitle?: string;
    /** Hub comparison for this product type, linked from the section nav. */
    compareHref?: string;
    /** The page's H1 when it should differ from the catalogue name (brand added); defaults to the name. */
    heading?: string;
}

export default function ProductDetail({ product, relatedProducts = [], accessories = [], frames = [], headlightCategories = [], relatedTitle = "Related Products", compareHref, heading }: ProductDetailProps) {
    const [selectedVariantImage, setSelectedVariantImage] = useState<string | undefined>(undefined);
    const [enquiryOpen, setEnquiryOpen] = useState(false);
    // Stable identity — ProductQuoteModal's success effect depends on onClose.
    const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);
    const openEnquiry = useCallback(() => setEnquiryOpen(true), []);

    const brand = detectBrand(product.sku);
    const compareAllowed = brand.name === "Admetec" || brand.name === "Salli";
    const presentation = resolvePresentation(product);

    // Separate blocks for layout purposes
    const heroBlock = product.contentBlocks.find((b) => b.type === "hero");
    const actionsBlock = product.contentBlocks.find((b) => b.type === "actions");
    const descriptionBlock = product.contentBlocks.find((b) => b.type === "description");
    const specsBlock = product.contentBlocks.find((b) => b.type === "specifications");
    const faqBlock = product.contentBlocks.find((b) => b.type === "faq");
    const faqItems = faqBlock?.type === "faq" ? faqBlock.data.items.filter((item) => item.question && item.answer) : [];
    const otherBlocks = product.contentBlocks.filter((b) => !["hero", "actions", "description", "faq", "seo", "presentation"].includes(b.type));
    const hasFeatures = descriptionBlock?.type === "description" && /\d+\.\s/.test(descriptionBlock.data.secondary ?? "");

    const sectionLinks: SectionNavLink[] = presentation?.sectionNav
        ? [
              ...(descriptionBlock ? [{ label: "Overview", href: "#overview" }] : []),
              ...(hasFeatures ? [{ label: "Features", href: "#features" }] : []),
              ...(specsBlock ? [{ label: "Specifications", href: "#specifications" }] : []),
              ...(compareHref ? [{ label: "Compare models", href: compareHref }] : []),
              ...(faqItems.length > 0 ? [{ label: "FAQ", href: "#faq" }] : []),
          ]
        : [];

    const handleVariantSelect = (imageUrl: string) => {
        setSelectedVariantImage(imageUrl);
    };

    const quickEnquiry = presentation?.quickEnquiry ? (
        // A link to the contact page without JavaScript; opens the product quote modal with it.
        <Link
            href="/support/contact"
            onClick={(event) => {
                event.preventDefault();
                openEnquiry();
            }}
            className="btn btn-lg btn-primary w-fit gap-2"
        >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Request a quote
        </Link>
    ) : null;

    return (
        <div className={cn("container mx-auto px-4 pt-4 pb-16 sm:pt-6 lg:pb-24", presentation && "pd-sections", sectionLinks.length > 0 && "pd-has-section-nav")}>
            <ProductSectionNav links={sectionLinks} />

            {/* Product Main Content - Two Column Layout */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
                {/* Left Column - Sticky Images */}
                <div className="pd-sticky-col lg:sticky lg:top-24 lg:w-[55%] lg:self-start">
                    {heroBlock && <ContentRenderer blocks={[heroBlock]} product={product} selectedVariantImage={selectedVariantImage} />}
                </div>

                {/* Right Column - All Product Info */}
                <div className="space-y-8 lg:w-[45%]">
                    {/* Title */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-neutral-900 lg:text-[2.75rem]">{heading ?? product.name}</h1>
                        </div>

                        {/* Dynamic trust badges — only ever shows fields this product actually has */}
                        <TrustBadges product={product} />
                    </div>

                    {/* Description — with presentation: short description, quick enquiry, then collapsible overview and features */}
                    {descriptionBlock?.type === "description" &&
                        (presentation ? (
                            <DescriptionBlock data={descriptionBlock.data} presentation={presentation} afterPrimary={quickEnquiry} />
                        ) : (
                            <ContentRenderer blocks={[descriptionBlock]} product={product} />
                        ))}

                    {/* Actions (Add to Cart) */}
                    {actionsBlock && <ContentRenderer blocks={[actionsBlock]} product={product} onVariantSelect={handleVariantSelect} frames={frames} headlightCategories={headlightCategories} />}

                    {/* Technical Specs & Other Info - Now in right column */}
                    {otherBlocks.length > 0 && (
                        <div className="pt-2">
                            <ContentRenderer blocks={otherBlocks} product={product} presentation={presentation} />
                        </div>
                    )}

                    {/* Compare action — at the bottom of right column */}
                    <CompareActionPanel product={product} />
                </div>
            </div>

            {/* Product FAQ — only when the product has its own questions */}
            {faqItems.length > 0 && (
                <div id="faq" className="mt-16 lg:mt-24">
                    <FAQ
                        groups={[{ id: "product", label: product.name, faqs: faqItems.map((item, index) => ({ id: index, ...item })) }]}
                        title={`Questions about ${product.name}`}
                        subtitle="Answers from the product documentation and the Haitech team."
                    />
                </div>
            )}

            {/* Accessories */}
            {accessories.length > 0 && (
                <section className="mt-16 lg:mt-24">
                    <SectionHeader title="Recommended Accessories" />
                    <ProductGrid items={accessories} />
                </section>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-16 lg:mt-24">
                    <SectionHeader title={relatedTitle} />
                    <ProductGrid items={relatedProducts} />
                </section>
            )}

            {/* Inline comparison — Admetec and Salli only */}
            {compareAllowed && <InlineComparisonSection />}

            {presentation?.quickEnquiry && (
                <>
                    <MobileEnquiryBar onEnquire={openEnquiry} />
                    <ProductQuoteModal
                        isOpen={enquiryOpen}
                        onClose={closeEnquiry}
                        productName={product.name}
                        productSku={product.sku}
                        productId={isCatalogueProductId(product.id) ? String(product.id) : ""}
                    />
                </>
            )}
        </div>
    );
}
