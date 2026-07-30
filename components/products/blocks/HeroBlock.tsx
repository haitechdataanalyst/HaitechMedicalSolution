    "use client";

import { useState, useCallback } from "react";
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

    const productName = product?.name ?? "Product";

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="card group relative aspect-square overflow-hidden bg-neutral-50">
                <Image
                    key={selectedImage}
                    src={failedImages.has(selectedImage) ? PLACEHOLDER_IMAGE : selectedImage}
                    alt={productName}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="animate-in fade-in object-contain p-6 duration-500 transition-transform group-hover:scale-[1.03] sm:p-10"
                    onError={() => handleImageError(selectedImage)}
                />
            </div>

            {/* Thumbnails - hidden for products with frame variants */}
            {showThumbnails && (
                <div className="flex gap-3 overflow-x-auto pb-2" role="listbox" aria-label={`${productName} images`}>
                    {allImages.map((image, index) => {
                        const isSelected = selectedImage === image;
                        return (
                            <button
                                key={index}
                                onClick={() => setUserSelectedImage(image)}
                                role="option"
                                aria-selected={isSelected}
                                aria-label={`View ${productName} — image ${index + 1} of ${allImages.length}`}
                                className={cn(
                                    "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-50 transition-all duration-200 hover:scale-105 sm:h-24 sm:w-24",
                                    isSelected ? "border-primary-600 ring-2 ring-primary-500 ring-offset-2 shadow-md" : "cursor-pointer border-transparent hover:border-neutral-300"
                                )}
                            >
                                <Image
                                    src={failedImages.has(image) ? PLACEHOLDER_IMAGE : image}
                                    alt={`${productName} — view ${index + 1}`}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-contain p-1.5"
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
