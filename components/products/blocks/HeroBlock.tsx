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

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                    key={selectedImage}
                    src={failedImages.has(selectedImage) ? PLACEHOLDER_IMAGE : selectedImage}
                    alt="Product"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="animate-in fade-in object-contain duration-500"
                    onError={() => handleImageError(selectedImage)}
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
                                "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105",
                                selectedImage === image ? "border-primary-600 ring-primary-500 ring-2 ring-offset-2" : "cursor-pointer border-transparent hover:border-neutral-300"
                            )}
                        >
                            <Image
                                src={failedImages.has(image) ? PLACEHOLDER_IMAGE : image}
                                alt={`Product view ${index + 1}`}
                                width={80}
                                height={80}
                                className="object-cover"
                                onError={() => handleImageError(image)}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
