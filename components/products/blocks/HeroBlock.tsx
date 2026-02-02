"use client";

import { useState } from "react";
import { HeroBlock as HeroBlockType, Product } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface HeroBlockProps {
  data: HeroBlockType["data"];
  product?: Product;
  externalSelectedImage?: string;
}

export default function HeroBlock({ data, product, externalSelectedImage }: HeroBlockProps) {
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);

  // Build the image gallery based on variant images or static gallery
  const buildImageGallery = (): string[] => {
    // If using variant images, check for both old and new structures
    if (data.useVariantImages && product) {
      // New frame variants structure
      if (product.frameVariants && Object.keys(product.frameVariants.images).length > 0) {
        const frameImages = Object.values(product.frameVariants.images).filter((img): img is string => Boolean(img && img.trim() !== ""));
        if (frameImages.length > 0) {
          return frameImages;
        }
      }

      // Legacy variants structure
      if (product.variants && product.variants.length > 0) {
        const variantImages = product.variants.map((v) => v.image).filter((img): img is string => Boolean(img && img.trim() !== ""));
        if (variantImages.length > 0) {
          return variantImages;
        }
      }
    }

    // Otherwise use the static gallery from block data
    const images: string[] = [];

    if (data.primaryImage && data.primaryImage.trim() !== "") {
      images.push(data.primaryImage);
    }

    if (data.gallery) {
      const galleryImages = data.gallery.filter((img): img is string => Boolean(img && img.trim() !== "" && img !== data.primaryImage));
      images.push(...galleryImages);
    }

    // Fallback to product's defaultImage if no images found
    if (images.length === 0 && product?.defaultImage && product.defaultImage.trim() !== "") {
      images.push(product.defaultImage);
    }

    // Fallback to product's gallery if still no images
    if (images.length === 0 && product?.gallery) {
      const productGallery = product.gallery.filter((img): img is string => Boolean(img && img.trim() !== ""));
      images.push(...productGallery);
    }

    return images;
  };

  const allImages = buildImageGallery();

  // Determine the primary image to show
  const getPrimaryImage = (): string => {
    if (externalSelectedImage && externalSelectedImage.trim() !== "") {
      return externalSelectedImage;
    }
    if (userSelectedImage && userSelectedImage.trim() !== "") {
      return userSelectedImage;
    }
    if (allImages.length > 0) {
      return allImages[0];
    }
    return PLACEHOLDER_IMAGE;
  };

  const selectedImage = getPrimaryImage();

  // Determine if we should show the thumbnail gallery
  // Hide it for products with frameVariants since selection is done via FrameColorSelector
  const hasFrameVariants = product?.frameVariants && Object.keys(product.frameVariants.images).length > 0;
  const showThumbnails = !hasFrameVariants && allImages.length > 1;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-surface-secondary relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      {/* Thumbnails - hidden for products with frame variants */}
      {showThumbnails && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setUserSelectedImage(image)}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                selectedImage === image ? "border-primary-600" : "cursor-pointer border-transparent hover:border-neutral-300"
              )}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                width={80}
                height={80}
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
