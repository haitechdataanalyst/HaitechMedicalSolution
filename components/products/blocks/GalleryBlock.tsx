"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { GalleryBlock as GalleryBlockType } from "@/types";
import { cn } from "@/lib/utils";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

const LIGHTBOX_BUTTON =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color] duration-200 ease-out hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:active:scale-[0.94]";

interface GalleryBlockProps {
    data: GalleryBlockType["data"];
    /** Brand + product name, used for descriptive alt text. */
    productName?: string;
}

export default function GalleryBlock({ data, productName = "Product" }: GalleryBlockProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    const handleImageError = useCallback((index: number) => {
        setFailedImages((prev) => new Set(prev).add(index));
    }, []);

    const layout = data.layout || "grid";

    if (data.images.length === 0) {
        return null;
    }

    return (
        <>
            <div className={cn(layout === "grid" ? "grid grid-cols-2 gap-3 md:grid-cols-3" : "scrollbar-hide flex gap-3 overflow-x-auto pb-2")}>
                {data.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        type="button"
                        aria-label={`Open ${productName}, photo ${index + 1}`}
                        className={cn(
                            "focus-visible:outline-primary-500 relative aspect-square overflow-hidden rounded-xl bg-neutral-50 transition-[transform,opacity] duration-200 ease-out hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.985]",
                            layout === "carousel" && "w-48 flex-shrink-0"
                        )}
                    >
                        <Image
                            src={failedImages.has(index) ? PLACEHOLDER_IMAGE : image}
                            alt={`${productName}, photo ${index + 1}`}
                            fill
                            className="object-contain p-3 mix-blend-multiply"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            onError={() => handleImageError(index)}
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${productName} photos`}
                    className="fixed inset-0 z-80 flex items-center justify-center bg-neutral-950/90 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedIndex(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setSelectedIndex(null);
                    }}
                >
                    <button type="button" autoFocus aria-label="Close" className={LIGHTBOX_BUTTON + " absolute top-4 right-4"} onClick={() => setSelectedIndex(null)}>
                        <CloseIcon size={22} />
                    </button>

                    {selectedIndex > 0 && (
                        <button
                            type="button"
                            aria-label="Previous photo"
                            className={LIGHTBOX_BUTTON + " absolute left-4"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex - 1);
                            }}
                        >
                            <ChevronLeftIcon size={22} />
                        </button>
                    )}

                    {selectedIndex < data.images.length - 1 && (
                        <button
                            type="button"
                            aria-label="Next photo"
                            className={LIGHTBOX_BUTTON + " absolute right-4"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex + 1);
                            }}
                        >
                            <ChevronRightIcon size={22} />
                        </button>
                    )}

                    <img
                        src={failedImages.has(selectedIndex) ? PLACEHOLDER_IMAGE : data.images[selectedIndex]}
                        alt={`${productName}, photo ${selectedIndex + 1}`}
                        className="max-h-[85vh] max-w-full rounded-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                        onError={() => handleImageError(selectedIndex)}
                    />
                </div>
            )}
        </>
    );
}
