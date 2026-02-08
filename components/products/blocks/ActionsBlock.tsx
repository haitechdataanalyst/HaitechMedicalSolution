"use client";

import { useState, useCallback } from "react";
import { ActionsBlock as ActionsBlockType, Product, CartItem, Frame, HeadlightCategory } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui";
import VariantSelector, { VariantSelection } from "./VariantSelector";
import ProductQuoteModal from "./ProductQuoteModal";
import FrameSizeSelector from "./FrameSizeSelector";
import PrescriptionSection from "./PrescriptionSection";
import MatchHeadlightsSection from "./MatchHeadlightsSection";
import TempleTipEngraving from "./TempleTipEngraving";
import BoxEngraving from "./BoxEngraving";
import { formatColorName } from "./variant-utils";
import { ShoppingCart, FileDown, MessageSquare } from "lucide-react";

interface ActionsBlockProps {
  data: ActionsBlockType["data"];
  product: Product;
  onVariantSelect?: (imageUrl: string) => void;
  frames?: Frame[];
  headlightCategories?: HeadlightCategory[];
}

export default function ActionsBlock({ data, product, onVariantSelect, frames = [], headlightCategories = [] }: ActionsBlockProps) {
  const { addItem } = useCart();
  const [quantity] = useState(1);
  const [customFields] = useState<Record<string, string | number>>({});
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [variantSelection, setVariantSelection] = useState<VariantSelection>({});
  const [selectedFrameSize, setSelectedFrameSize] = useState<string | null>(data.frameSizes?.[1]?.value ?? null);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [templeTipText, setTempleTipText] = useState("");
  const [boxEngravingText, setBoxEngravingText] = useState("");
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
  };

  // Get variant description for quote modal
  const getVariantDescription = (): string | undefined => {
    if (variantSelection.frameId && variantSelection.colorId && product.frameVariants) {
      const frame = frames.find((f) => f.id === variantSelection.frameId);
      const frameName = frame?.name || formatColorName(variantSelection.frameId);
      const colorName = formatColorName(variantSelection.colorId);
      return `${frameName} - ${colorName}`;
    }

    if (variantSelection.legacyVariant) {
      const variant = variantSelection.legacyVariant;
      if (product.variantType === "color") {
        return variant.name ?? variant.color ?? formatColorName(variant.id);
      }
      if (product.variantType === "grit") {
        return variant.sku ?? variant.name ?? variant.id;
      }
      return variant.name ?? variant.id;
    }

    return undefined;
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

  if (!data.addToCart) {
    return null;
  }

  return (
    <div className="bg-surface sticky top-24 space-y-6 rounded-xl border border-neutral-200 p-4 sm:p-6">
      {/* Variant Selection - VariantSelector handles all product types */}
      <VariantSelector product={product} frames={frames} onSelectionChange={handleVariantChange} />

      {/* Frame Size Selector */}
      {data.frameSizes && data.frameSizes.length > 0 && <FrameSizeSelector sizes={data.frameSizes} selectedSize={selectedFrameSize} onSizeChange={setSelectedFrameSize} />}

      {/* Prescription Section */}
      {data.prescription?.enabled && <PrescriptionSection config={data.prescription} onFileChange={setPrescriptionFile} />}

      {/* Match Headlights Section */}
      {data.matchHeadlights?.enabled && headlightCategories.length > 0 && <MatchHeadlightsSection config={data.matchHeadlights} headlightCategories={headlightCategories} />}

      {/* Temple Tip Engraving Section */}
      {data.templeTipEngraving?.enabled && <TempleTipEngraving config={data.templeTipEngraving} onTextChange={setTempleTipText} />}

      {/* Box Engraving Section */}
      {data.boxEngraving?.enabled && <BoxEngraving config={data.boxEngraving} onTextChange={setBoxEngravingText} />}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button onClick={() => setIsQuoteModalOpen(true)} variant="outline" size="lg" className="flex-1 gap-2">
          <MessageSquare className="h-4 w-4" />
          Get a Quote
        </Button>
      </div>

      {/* Download Catalogue Button */}
      {product.catalogueFile && (
        <Button onClick={handleDownloadCatalogue} variant="secondary" size="lg" className="w-full gap-2">
          <FileDown className="h-4 w-4" />
          Get Catalogue
        </Button>
      )}

      <p className="text-muted text-center text-xs">Add items to your cart and request a quote. We&apos;ll respond within 24 hours.</p>

      {/* Quote Modal */}
      <ProductQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={product.name}
        productSku={product.sku}
        productId={String(product.id)}
        selectedVariant={getVariantDescription()}
      />
    </div>
  );
}
