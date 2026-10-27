"use client";

import { useState, useCallback } from "react";
import { HeroBlock as HeroBlockType, Product } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { productNameWithBrand } from "@/lib/product-seo";

const PLACEHOLDER_IMAGE = "/images/site/placeholder.svg";

interface HeroBlockProps {
    data: HeroBlockType["data"];
    product?: Product;
    externalSelectedImage?: string;
}

export default function HeroBlock({ data, product, externalSelectedImage }: HeroBlockProps) {
    const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageError = useCallback((imageSrc: string) => {
        setFailedImages((prev) => new Set(prev).add(imageSrc));
    }, []);

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
        // Priority 1: User explicitly clicked a thumbnail in this session
        if (userSelectedImage && userSelectedImage.trim() !== "") {
            return userSelectedImage;
        }

        // Priority 2: External variant selection (only if enabled for this product)
        // This allows loupes to switch images on variant select, but keeps others stable
        if (data.useVariantImages && externalSelectedImage && externalSelectedImage.trim() !== "") {
            return externalSelectedImage;
        }

        // Priority 3: Default first image from computed gallery
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

    // Brand-prefixed ("Strauss A0") so bare model codes still describe the photo
    const productName = product ? productNameWithBrand(product) : "Product";

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-50">
                <Image
                    key={selectedImage}
                    src={failedImages.has(selectedImage) ? PLACEHOLDER_IMAGE : selectedImage}
                    alt={productName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="motion-safe:animate-in motion-safe:fade-in object-contain p-8 mix-blend-multiply duration-300 sm:p-14"
                    onError={() => handleImageError(selectedImage)}
                />
            </div>

            {/* Thumbnails - hidden for products with frame variants */}
            {showThumbnails && (
                <div className="scrollbar-hide -mx-1 flex gap-2.5 overflow-x-auto px-1 py-1" role="listbox" aria-label={`${productName} images`}>
                    {allImages.map((image, index) => {
                        const isSelected = selectedImage === image;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setUserSelectedImage(image)}
                                role="option"
                                aria-selected={isSelected}
                                aria-label={`View ${productName} — image ${index + 1} of ${allImages.length}`}
                                className={cn(
                                    "focus-visible:outline-primary-500 h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50 transition-[transform,opacity] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.97] sm:h-20 sm:w-20",
                                    isSelected ? "ring-primary-700 ring-2" : "opacity-70 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={failedImages.has(image) ? PLACEHOLDER_IMAGE : image}
                                    alt="" // the surrounding button carries the descriptive aria-label
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-contain p-2 mix-blend-multiply"
                                    onError={() => handleImageError(image)}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
