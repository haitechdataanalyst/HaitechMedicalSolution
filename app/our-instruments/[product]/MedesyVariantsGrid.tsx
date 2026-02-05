"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui";
import ProductQuoteModal from "@/components/products/blocks/ProductQuoteModal";

interface VariantCardProps {
  variant: ProductVariant;
  onGetQuote: (variant: ProductVariant) => void;
}

function VariantCard({ variant, onGetQuote }: VariantCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
      {/* Variant Image */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={variant.image}
          alt={variant.name || variant.id}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Variant Name */}
      <div className="mb-3 flex justify-center">
        <span className="bg-primary-600 inline-block rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white">
          {variant.name || variant.id}
        </span>
      </div>

      {/* SKU */}
      <p className="mb-4 grow text-center text-sm text-gray-500">
        SKU: {variant.sku}
      </p>

      {/* Get a Quote */}
      <div className="mt-auto pt-2">
        <Button variant="outline" className="w-full" onClick={() => onGetQuote(variant)}>
          Get a Quote
        </Button>
      </div>
    </div>
  );
}

interface SingleProductCardProps {
  product: Product;
  onGetQuote: () => void;
}

function SingleProductCard({ product, onGetQuote }: SingleProductCardProps) {
  const image = product.defaultImage || product.gallery?.[0] || "/images/placeholder.jpg";
  
  return (
    <div className="group mx-auto flex max-w-md flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
      {/* Product Image */}
      <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </div>

      {/* Product Name */}
      <div className="mb-4 flex justify-center">
        <span className="bg-primary-600 inline-block rounded-md px-6 py-3 text-base font-semibold uppercase tracking-wide text-white">
          {product.name}
        </span>
      </div>

      {/* SKU */}
      <p className="mb-6 text-center text-sm text-gray-500">
        SKU: {product.sku}
      </p>

      {/* Get a Quote */}
      <div className="mt-auto">
        <Button variant="primary" className="w-full" size="lg" onClick={onGetQuote}>
          Get a Quote
        </Button>
      </div>
    </div>
  );
}

interface MedesyVariantsGridProps {
  product: Product;
}

export function MedesyVariantsGrid({ product }: MedesyVariantsGridProps) {
  const [variantForQuote, setVariantForQuote] = useState<ProductVariant | null>(null);
  const [showProductQuote, setShowProductQuote] = useState(false);

  const handleGetQuote = (variant: ProductVariant) => {
    setVariantForQuote(variant);
  };

  const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;

  return (
    <>
      {hasVariants ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {product.variants!.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              onGetQuote={handleGetQuote}
            />
          ))}
        </div>
      ) : (
        <SingleProductCard 
          product={product} 
          onGetQuote={() => setShowProductQuote(true)} 
        />
      )}

      {/* Quote modal for variant */}
      {variantForQuote && (
        <ProductQuoteModal
          isOpen={!!variantForQuote}
          onClose={() => setVariantForQuote(null)}
          productName={`${product.name} - ${variantForQuote.name || variantForQuote.id}`}
          productSku={variantForQuote.sku}
          productId={variantForQuote.id}
        />
      )}

      {/* Quote modal for single product (no variants) */}
      {showProductQuote && (
        <ProductQuoteModal
          isOpen={showProductQuote}
          onClose={() => setShowProductQuote(false)}
          productName={product.name}
          productSku={product.sku}
          productId={String(product.id)}
        />
      )}
    </>
  );
}
