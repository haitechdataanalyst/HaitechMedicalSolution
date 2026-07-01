"use client";

import { useState, useCallback } from "react";
import { ActionsBlock as ActionsBlockType, Product, CartItem, Frame, HeadlightCategory } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui";
import VariantSelector, { VariantSelection } from "./VariantSelector";
import FrameSizeSelector from "./FrameSizeSelector";
import PrescriptionSection from "./PrescriptionSection";
import MatchHeadlightsSection from "./MatchHeadlightsSection";
import TempleTipEngraving from "./TempleTipEngraving";
import BoxEngraving from "./BoxEngraving";
import { ShoppingCart, FileDown, HelpCircle, Tag, Zap, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { detectBrand } from "@/lib/brand";
import ProductQuoteModal from "./ProductQuoteModal";
import { COMMERCE_ENABLED } from "@/lib/config";

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

    const brandName = detectBrand(product.sku).name;
    const isAdmetec = brandName === "Admetec";

    const CATALOGUE_URLS: Partial<Record<string, string>> = {
        Admetec: "https://workdrive.zohoexternal.com/embed/383450ad81ce1c0b64e39baa4600dc9953d5e?toolbar=true&appearance=light&themecolor=green",
        Medesy:  "https://workdrive.zohoexternal.com/embed/tlv0k963378cb12984924abbfac5fbfd6f68e?toolbar=false&appearance=light&themecolor=green",
        Strauss: "https://workdrive.zohoexternal.com/embed/ennpwb647c682dd6d4b1abd144afa40d87fac?toolbar=false&appearance=light&themecolor=green",
        Salli:   "https://workdrive.zohoexternal.com/embed/ennpw95aa7f76e70640aca14258fec72e09e8?toolbar=false&appearance=light&themecolor=green",
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
        <div className="bg-surface sticky top-24 space-y-6 rounded-xl border border-neutral-200 p-4 sm:p-6">

            {/* Commerce sections — only when addToCart is enabled */}
            {data.addToCart && (
                <>
                    {/* Price display */}
                    {COMMERCE_ENABLED && (
                        <div className="border-b border-neutral-100 pb-4">
                            {product.basePrice ? (
                                <div className="flex flex-wrap items-end gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-neutral-900">
                                        {formatPrice(product.basePrice, product.currency ?? "INR")}
                                    </span>
                                    <span className="mb-0.5 text-sm text-neutral-400">incl. GST &amp; all taxes</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-neutral-500">
                                    <Tag className="h-4 w-4" />
                                    <span className="text-sm font-medium">Price available on request</span>
                                </div>
                            )}
                            {product.currency === "INR" && (
                                <p className="mt-1 text-xs text-emerald-600">All frames included free · Prices valid 2026-2027</p>
                            )}
                        </div>
                    )}

                    {/* Variant Selection */}
                    <VariantSelector product={product} frames={frames} onSelectionChange={handleVariantChange} />

                    {/* Frame Size Selector */}
                    {data.frameSizes && data.frameSizes.length > 0 && <FrameSizeSelector sizes={data.frameSizes} selectedSize={selectedFrameSize} onSizeChange={setSelectedFrameSize} />}

                    {/* Generic Custom Fields */}
                    {data.customFields &&
                        data.customFields.map((field) => {
                            const isWorkingDistance = (field.name || field.label || "").toLowerCase().includes("working");
                            return (
                                <div key={field.name || field.label} className="space-y-1.5">
                                    <label className="block text-sm font-medium text-neutral-700">
                                        {field.label}
                                        {field.required && <span className="ml-1 text-red-500">*</span>}
                                    </label>
                                    {isWorkingDistance && (
                                        <p className="flex items-start gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                            <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                                            <span>Working distance is the distance between your eyes and the patient&apos;s mouth while working. Measure when seated in your natural working posture. <strong>Typical range: 340–500 mm.</strong></span>
                                        </p>
                                    )}
                                    {field.type === "select" && (
                                        <select
                                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
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

                    {/* Cart / order buttons */}
                    {COMMERCE_ENABLED && (
                        <div className="flex flex-col gap-3">
                            {isAdmetec ? (
                                <div className="flex gap-3">
                                    <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                    <Button onClick={() => setQuoteModalOpen(true)} variant="outline" size="lg" className="flex-1 gap-2">
                                        <FileText className="h-4 w-4" />
                                        Get a Quote
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        onClick={() => { handleAddToCart(); window.location.href = "/cart"; }}
                                        variant="outline"
                                        size="lg"
                                        className="w-full gap-2"
                                    >
                                        <Zap className="h-4 w-4" />
                                        Buy Now
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Catalogue button — always shown for every brand that has a URL */}
            {catalogueUrl ? (
                <Button onClick={handleOpenCatalogue} variant="secondary" size="lg" className="w-full gap-2">
                    <FileDown className="h-4 w-4" />
                    Get Catalogue
                </Button>
            ) : product.catalogueFile ? (
                <Button onClick={handleDownloadCatalogue} variant="secondary" size="lg" className="w-full gap-2">
                    <FileDown className="h-4 w-4" />
                    Download Catalogue
                </Button>
            ) : null}

        </div>

        {/* Quote modal — Admetec only */}
        {isAdmetec && (
            <ProductQuoteModal
                isOpen={quoteModalOpen}
                onClose={() => setQuoteModalOpen(false)}
                productName={product.name}
                productSku={variantSelection.legacyVariant?.sku ?? product.sku}
                productId={String(product.id)}
                selectedVariant={
                    variantSelection.frameId && variantSelection.colorId
                        ? `${variantSelection.frameId} / ${variantSelection.colorId}`
                        : variantSelection.legacyVariant?.name ?? undefined
                }
            />
        )}

        </>
    );
}
