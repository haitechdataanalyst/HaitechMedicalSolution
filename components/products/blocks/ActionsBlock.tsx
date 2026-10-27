"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ActionsBlock as ActionsBlockType, Product, CartItem, Frame, HeadlightCategory, SpecificationsBlock } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/cart/WishlistProvider";
import { useCompare } from "@/components/compare";
import { getCompareGroup } from "@/lib/compare-group.resolve";
import { Button } from "@/components/ui";
import VariantSelector, { VariantSelection } from "./VariantSelector";
import FrameSizeSelector from "./FrameSizeSelector";
import PrescriptionSection from "./PrescriptionSection";
import MatchHeadlightsSection from "./MatchHeadlightsSection";
import TempleTipEngraving from "./TempleTipEngraving";
import BoxEngraving from "./BoxEngraving";
import SalliCustomizationSection, { SalliSelection } from "./SalliCustomizationSection";
import { ShoppingCart, FileDown, HelpCircle, Tag, Zap, FileText, Heart, GitCompareArrows, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { detectBrand, requiresConsultation } from "@/lib/brand";
import ProductQuoteModal from "./ProductQuoteModal";
import { isCatalogueProductId } from "@/lib/headlight-products";
import { COMMERCE_ENABLED, shouldShowPrice } from "@/lib/config";

/** Quiet, pill-shaped convenience action (Save / Compare / Share): 44px tall, press feedback only. */
const QUIET_ACTION =
    "focus-visible:outline-primary-500 flex min-h-11 items-center gap-1.5 rounded-full px-3.5 transition-[transform,background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]";

interface ActionsBlockProps {
    data: ActionsBlockType["data"];
    product: Product;
    onVariantSelect?: (imageUrl: string) => void;
    frames?: Frame[];
    headlightCategories?: HeadlightCategory[];
}

export default function ActionsBlock({ data, product, onVariantSelect, frames = [], headlightCategories = [] }: ActionsBlockProps) {
    const { addItem, openCart } = useCart();
    const [quantity] = useState(1);
    const [customFields, setCustomFields] = useState<Record<string, string | number>>({});
    const [variantSelection, setVariantSelection] = useState<VariantSelection>({});
    const [selectedFrameSize, setSelectedFrameSize] = useState<string | null>(data.frameSizes?.[1]?.value ?? null);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [templeTipText, setTempleTipText] = useState("");
    const [boxEngravingText, setBoxEngravingText] = useState("");
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    // Stable identity: an inline `() => setQuoteModalOpen(false)` is recreated every
    // render, which retriggers ProductQuoteModal's success effect (it depends on
    // onClose) on any unrelated re-render — firing the "sent" toast more than once.
    const handleCloseQuoteModal = useCallback(() => setQuoteModalOpen(false), []);
    const [salliSelection, setSalliSelection] = useState<SalliSelection>({ piston: null, material: null, seatSize: null, accessoryIds: [] });
    const [showStickyBar, setShowStickyBar] = useState(false);
    const primaryActionRef = useRef<HTMLDivElement>(null);

    const brandName = detectBrand(product.sku).name;
    // Capital equipment (loupes, dental chairs, saddle chairs) is bought via
    // quote/consultation, not instant checkout — see DESIGN_PRINCIPLES.md.
    const needsQuote = requiresConsultation(brandName);
    const hasPrimaryAction = data.addToCart && (needsQuote || COMMERCE_ENABLED);

    // Long configurators (Salli piston/upholstery, Admetec frame + prescription
    // + engraving) push the primary button far down the page — once it's been
    // scrolled past, a persistent bottom bar keeps it one tap away.
    useEffect(() => {
        if (!hasPrimaryAction) return;
        const el = primaryActionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasPrimaryAction]);

    // Convenience actions (Wishlist, Compare, Share) support research without
    // competing with the primary Quote decision — see DESIGN_PRINCIPLES.md,
    // Principle 12: Decision-Based Interfaces.
    const { toggle: toggleWishlist, isWished } = useWishlist();
    const wished = isWished(String(product.id));
    const { add: compareAdd, remove: compareRemove, isAdded: compareIsAdded, items: compareItems, activeGroup: compareActiveGroup } = useCompare();
    const compareAdded = compareIsAdded(String(product.id));
    const compareFull = compareItems.length >= 3 && !compareAdded;
    // Only products from the same category family can be compared (e.g. loupes with loupes, never with a Salli chair)
    const compareGroup = getCompareGroup(product.category);
    const compareMismatch = !!compareActiveGroup && !compareAdded && compareActiveGroup.key !== compareGroup.key;
    const compareAllowed = brandName === "Admetec" || brandName === "Salli";

    const handleToggleCompare = () => {
        if (compareAdded) {
            compareRemove(String(product.id));
            return;
        }
        if (compareFull) return;
        const specs = product.contentBlocks?.filter((b): b is SpecificationsBlock => b.type === "specifications").flatMap((b) => b.data.rows ?? b.data.specs ?? []);
        compareAdd({
            id: String(product.id),
            name: product.name,
            image: product.defaultImage,
            href: typeof window !== "undefined" ? window.location.pathname : "",
            price: product.basePrice,
            currency: product.currency,
            brand: brandName,
            specs,
            group: compareGroup,
        });
    };

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title: product.name, url });
            } catch {
                // user cancelled the native share sheet — no action needed
            }
        } else if (typeof navigator !== "undefined") {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard");
        }
    };

    const CATALOGUE_URLS: Partial<Record<string, string>> = {
        Admetec: "https://workdrive.zohoexternal.com/embed/383450ad81ce1c0b64e39baa4600dc9953d5e?toolbar=true&appearance=light&themecolor=green",
        Medesy: "https://workdrive.zohoexternal.com/embed/tlv0k963378cb12984924abbfac5fbfd6f68e?toolbar=false&appearance=light&themecolor=green",
        Strauss: "https://workdrive.zohoexternal.com/embed/ennpwb647c682dd6d4b1abd144afa40d87fac?toolbar=false&appearance=light&themecolor=green",
        Salli: "https://workdrive.zohoexternal.com/embed/ennpw95aa7f76e70640aca14258fec72e09e8?toolbar=false&appearance=light&themecolor=green",
    };
    const catalogueUrl = CATALOGUE_URLS[brandName];

    const handleOpenCatalogue = () => {
        if (catalogueUrl) window.open(catalogueUrl, "_blank", "noopener,noreferrer");
    };
    // Handle variant selection changes from VariantSelector
    const handleVariantChange = useCallback(
        (selection: VariantSelection) => {
            setVariantSelection(selection);
            if (selection.image && onVariantSelect) {
                onVariantSelect(selection.image);
            }
        },
        [onVariantSelect]
    );

    const handleCustomFieldChange = (name: string, value: string | number) => {
        setCustomFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Build customization data for cart
    const buildCustomization = (): Record<string, string | number> => {
        const customization: Record<string, string | number> = { ...customFields };

        if (variantSelection.frameId && variantSelection.colorId) {
            customization.frame = variantSelection.frameId;
            customization.color = variantSelection.colorId;
        }

        if (variantSelection.legacyVariant) {
            customization.color = variantSelection.legacyVariant.name ?? variantSelection.legacyVariant.id;
            customization.variantSku = variantSelection.legacyVariant.sku;
        }

        if (selectedFrameSize) {
            customization.frameSize = selectedFrameSize;
        }

        if (prescriptionFile) {
            customization.prescription = prescriptionFile.name;
        }

        if (templeTipText) {
            customization.templeTipEngraving = templeTipText;
        }

        if (boxEngravingText) {
            customization.boxEngraving = boxEngravingText;
        }

        if (data.salliCustomization?.enabled) {
            const materials = data.salliCustomization.materials ?? [];
            const selectedMaterial = materials.find((m) => m.value === salliSelection.material) ?? materials[0];

            if (salliSelection.piston) customization.pistonSize = salliSelection.piston;
            if (salliSelection.seatSize) customization.seatSize = salliSelection.seatSize;
            if (selectedMaterial) customization.upholstery = selectedMaterial.label;
            if (salliSelection.accessoryIds.length > 0) {
                const labels = (data.salliCustomization.accessories ?? []).filter((a) => salliSelection.accessoryIds.includes(a.id)).map((a) => a.label);
                if (labels.length > 0) customization.accessories = labels.join(", ");
            }
        }

        return customization;
    };

    const handleAddToCart = () => {
        const customization = buildCustomization();

        const cartItem: CartItem = {
            productId: String(product.id),
            productName: product.name,
            sku: variantSelection.legacyVariant?.sku ?? product.sku,
            quantity,
            basePrice: product.basePrice,
            customization: Object.keys(customization).length > 0 ? customization : undefined,
            image: variantSelection.image ?? product.defaultImage,
        };

        addItem(cartItem);
        toast.success("Added to cart", {
            description: product.name,
            duration: 3500,
            action: { label: "View Cart", onClick: openCart },
        });
    };

    // Handle catalogue download
    const handleDownloadCatalogue = () => {
        if (product.catalogueFile) {
            const link = document.createElement("a");
            link.href = product.catalogueFile;
            link.download = `${product.slug}-catalogue.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Only bail if there is truly nothing to show
    if (!data.addToCart && !catalogueUrl && !product.catalogueFile) {
        return null;
    }

    return (
        <>
            {/* overflow-visible overrides .card's overflow-hidden — this panel hosts
            absolutely-positioned children (e.g. FrameColorSelector's swatch
            tooltip) that must be able to extend past its edges. */}
            <div className="card sticky top-24 space-y-6 overflow-visible p-5 sm:p-7">
                {/* Commerce sections — only when addToCart is enabled */}
                {data.addToCart && (
                    <>
                        {/* Price display */}
                        {shouldShowPrice(brandName) && (
                            <div>
                                {product.basePrice ? (
                                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                                        <span className="text-[2rem] leading-none font-semibold tracking-[-0.02em] text-neutral-900 tabular-nums">
                                            {formatPrice(product.basePrice, product.currency ?? "INR")}
                                        </span>
                                        <span className="text-[13px] text-neutral-500">incl. GST &amp; all taxes</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-neutral-600">
                                        <Tag className="h-4 w-4" aria-hidden="true" />
                                        <span className="text-[15px] font-medium">Price available on request</span>
                                    </div>
                                )}
                                {/* "Frames included free" is a loupe-frame-customization claim —
                                only true for products that actually offer frame variants
                                (Admetec), not every INR-priced product regardless of brand. */}
                                {product.frameVariants && <p className="mt-2 text-[13px] text-neutral-500">All frames included free · Prices valid 2026-2027</p>}
                            </div>
                        )}

                        {/* Variant Selection */}
                        <VariantSelector product={product} frames={frames} onSelectionChange={handleVariantChange} />

                        {/* Salli Saddle Chair Customization (piston size, upholstery, accessories) */}
                        {data.salliCustomization?.enabled && (
                            <SalliCustomizationSection config={data.salliCustomization} selection={salliSelection} onChange={setSalliSelection} currency={product.currency} />
                        )}

                        {/* Frame Size Selector */}
                        {data.frameSizes && data.frameSizes.length > 0 && <FrameSizeSelector sizes={data.frameSizes} selectedSize={selectedFrameSize} onSizeChange={setSelectedFrameSize} />}

                        {/* Generic Custom Fields */}
                        {data.customFields &&
                            data.customFields.map((field) => {
                                const isWorkingDistance = (field.name || field.label || "").toLowerCase().includes("working");
                                return (
                                    <div key={field.name || field.label} className="space-y-1.5">
                                        <label htmlFor={`cf-${field.name || field.label}`} className="form-label">
                                            {field.label}
                                            {field.required && <span className="ml-1 text-red-600">*</span>}
                                        </label>
                                        {isWorkingDistance && (
                                            <p className="flex items-start gap-2 rounded-xl bg-neutral-50 px-3.5 py-3 text-[13px] leading-relaxed text-neutral-600">
                                                <HelpCircle className="text-primary-700 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                                                <span>
                                                    Working distance is the distance between your eyes and the patient&apos;s mouth while working. Measure when seated in your natural working posture.{" "}
                                                    <strong className="font-semibold text-neutral-800">Typical range: 340–500 mm.</strong>
                                                </span>
                                            </p>
                                        )}
                                        {field.type === "select" && (
                                            <select
                                                id={`cf-${field.name || field.label}`}
                                                className="form-input"
                                                value={customFields[field.name || ""] || ""}
                                                onChange={(e) => handleCustomFieldChange(field.name || "", e.target.value)}
                                                required={field.required}
                                            >
                                                <option value="">Select {field.label}</option>
                                                {field.options?.map((option) => {
                                                    const opt = typeof option === "string" ? { value: option, label: option } : option;
                                                    return (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    </div>
                                );
                            })}

                        {/* Prescription Section */}
                        {data.prescription?.enabled && <PrescriptionSection config={data.prescription} onFileChange={setPrescriptionFile} />}

                        {/* Match Headlights Section */}
                        {data.matchHeadlights?.enabled && headlightCategories.length > 0 && <MatchHeadlightsSection config={data.matchHeadlights} headlightCategories={headlightCategories} />}

                        {/* Temple Tip Engraving Section */}
                        {data.templeTipEngraving?.enabled && <TempleTipEngraving config={data.templeTipEngraving} onTextChange={setTempleTipText} />}

                        {/* Box Engraving Section */}
                        {data.boxEngraving?.enabled && <BoxEngraving config={data.boxEngraving} onTextChange={setBoxEngravingText} />}

                        {/* Cart / order buttons — the quote CTA for capital equipment
                        is never gated behind COMMERCE_ENABLED: requesting a quote
                        is the site's primary lead-generation path today and has
                        never depended on online payment being live. Only the
                        actual cart/checkout actions wait for that flag.

                        Hierarchy follows DESIGN_PRINCIPLES.md, Principle 12
                        (Decision-Based Interfaces): one primary business
                        objective, supporting documentation demoted below,
                        convenience actions kept small so they never compete
                        with the decision the buyer actually needs to make. */}
                        <div ref={primaryActionRef} className="flex flex-col gap-3">
                            {needsQuote ? (
                                <>
                                    {/* Primary — the core business objective */}
                                    <Button onClick={() => setQuoteModalOpen(true)} size="lg" className="w-full gap-2">
                                        <FileText className="h-4 w-4" />
                                        Request a Quote
                                    </Button>
                                    {/* Convenience — Add to Cart stays part of the system for when
                                    e-commerce goes live, but for consultation-based products it
                                    is subordinate to Quote, not equal to it. */}
                                    {COMMERCE_ENABLED && (
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="focus-visible:outline-primary-500 flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium text-neutral-600 transition-[transform,background-color,color] duration-200 ease-out hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97]"
                                        >
                                            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                                            Add to Cart
                                        </button>
                                    )}
                                </>
                            ) : (
                                COMMERCE_ENABLED && (
                                    <>
                                        <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
                                            <ShoppingCart className="h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleAddToCart();
                                                window.location.href = "/cart";
                                            }}
                                            variant="outline"
                                            size="lg"
                                            className="w-full gap-2"
                                        >
                                            <Zap className="h-4 w-4" />
                                            Buy Now
                                        </Button>
                                    </>
                                )
                            )}
                        </div>
                    </>
                )}

                {/* Convenience row — Wishlist, Compare, Share assist research
                without competing for attention against the primary decision. */}
                <div className="flex items-center justify-center gap-1 text-[13px] font-medium text-neutral-500">
                    {/* A wishlist entry is a products.id; products that live only in the static catalogue (Admetec lights) have none. */}
                    {isCatalogueProductId(product.id) && (
                        <button
                            type="button"
                            aria-pressed={wished}
                            onClick={() => toggleWishlist(String(product.id))}
                            className={cn(QUIET_ACTION, "hover:bg-neutral-100 hover:text-neutral-900", wished && "text-rose-600")}
                        >
                            <Heart className={wished ? "h-4 w-4 fill-current" : "h-4 w-4"} aria-hidden="true" />
                            {wished ? "Saved" : "Save"}
                        </button>
                    )}
                    {compareAllowed && (
                        <button
                            type="button"
                            aria-pressed={compareAdded}
                            onClick={handleToggleCompare}
                            disabled={compareFull}
                            title={compareMismatch ? `Compare works within one category — you are comparing ${compareActiveGroup?.label}` : undefined}
                            className={cn(
                                QUIET_ACTION,
                                compareAdded
                                    ? "bg-primary-50 text-primary-800"
                                    : compareFull
                                      ? "cursor-not-allowed opacity-50"
                                      : compareMismatch
                                        ? "opacity-60 hover:bg-neutral-100"
                                        : "hover:bg-neutral-100 hover:text-neutral-900"
                            )}
                        >
                            <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                            {compareAdded ? "Added" : "Compare"}
                        </button>
                    )}
                    <button type="button" onClick={handleShare} className={cn(QUIET_ACTION, "hover:bg-neutral-100 hover:text-neutral-900")}>
                        <Share2 className="h-4 w-4" aria-hidden="true" />
                        Share
                    </button>
                </div>

                {/* Supporting — documentation aids the decision but should never
                visually compete with Quote; hence ghost, not filled or
                outlined. */}
                {catalogueUrl ? (
                    <Button onClick={handleOpenCatalogue} variant="ghost" size="lg" className="w-full gap-2 text-neutral-600">
                        <FileDown className="h-4 w-4" />
                        Download Brochure
                    </Button>
                ) : product.catalogueFile ? (
                    <Button onClick={handleDownloadCatalogue} variant="ghost" size="lg" className="w-full gap-2 text-neutral-600">
                        <FileDown className="h-4 w-4" />
                        Download Brochure
                    </Button>
                ) : null}
            </div>

            {/* Quote modal — capital equipment brands only (see DESIGN_PRINCIPLES.md) */}
            {needsQuote && (
                <ProductQuoteModal
                    isOpen={quoteModalOpen}
                    onClose={handleCloseQuoteModal}
                    productName={product.name}
                    productSku={variantSelection.legacyVariant?.sku ?? product.sku}
                    productId={isCatalogueProductId(product.id) ? String(product.id) : ""}
                    selectedVariant={
                        variantSelection.frameId && variantSelection.colorId ? `${variantSelection.frameId} / ${variantSelection.colorId}` : (variantSelection.legacyVariant?.name ?? undefined)
                    }
                />
            )}

            {/* Sticky bar — reappears once the primary CTA above has scrolled out
            of view, so it's always one tap away on long configurator pages.
            Sits above CompareBar (68px, see FloatingButtons) when that's open. */}
            {hasPrimaryAction && showStickyBar && (
                <div
                    className="material-bar motion-safe:animate-in motion-safe:slide-in-from-bottom-4 fixed inset-x-0 z-50 border-t border-neutral-900/[0.06] duration-200"
                    style={{ bottom: compareAllowed && compareItems.length > 0 ? "68px" : 0 }}
                >
                    <div className="container flex items-center gap-3 py-2.5" style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom, 0px))" }}>
                        <div className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-neutral-50 sm:block">
                            <Image src={product.defaultImage || product.gallery?.[0] || "/images/site/placeholder.svg"} alt="" fill className="object-contain p-1 mix-blend-multiply" sizes="44px" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">{product.name}</p>
                            {shouldShowPrice(brandName) && product.basePrice && (
                                <p className="text-[13px] text-neutral-500 tabular-nums">{formatPrice(product.basePrice, product.currency ?? "INR")}</p>
                            )}
                        </div>
                        {needsQuote ? (
                            <Button onClick={() => setQuoteModalOpen(true)} className="shrink-0 gap-2">
                                <FileText className="h-4 w-4" />
                                Request a Quote
                            </Button>
                        ) : (
                            <Button onClick={handleAddToCart} className="shrink-0 gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
