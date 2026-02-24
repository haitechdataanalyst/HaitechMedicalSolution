"use client";

import { useState, useCallback } from "react";
import { GalleryBlock as GalleryBlockType } from "@/types";
import { cn } from "@/lib/utils";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface GalleryBlockProps {
    data: GalleryBlockType["data"];
}

export default function GalleryBlock({ data }: GalleryBlockProps) {
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
            <div className={cn(layout === "grid" ? "grid grid-cols-2 gap-4 md:grid-cols-3" : "flex gap-4 overflow-x-auto pb-4")}>
                {data.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn("bg-surface-secondary aspect-square overflow-hidden rounded-lg transition-opacity hover:opacity-90", layout === "carousel" && "w-48 flex-shrink-0")}
                    >
                        <img
                            src={failedImages.has(index) ? PLACEHOLDER_IMAGE : image}
                            alt={`Gallery image ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(index)}
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedIndex(null)}>
                    <button className="absolute top-4 right-4 p-2 text-white hover:text-gray-300" onClick={() => setSelectedIndex(null)}>
                        <CloseIcon size={32} />
                    </button>

                    {selectedIndex > 0 && (
                        <button
                            className="absolute left-4 p-2 text-white hover:text-gray-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex - 1);
                            }}
                        >
                            <ChevronLeftIcon size={32} />
                        </button>
                    )}

                    {selectedIndex < data.images.length - 1 && (
                        <button
                            className="absolute right-4 p-2 text-white hover:text-gray-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex + 1);
                            }}
                        >
                            <ChevronRightIcon size={32} />
                        </button>
                    )}

                    <img
                        src={failedImages.has(selectedIndex) ? PLACEHOLDER_IMAGE : data.images[selectedIndex]}
                        alt={`Gallery image ${selectedIndex + 1}`}
                        className="max-h-[90vh] max-w-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                        onError={() => handleImageError(selectedIndex)}
                    />
                </div>
            )}
        </>
    );
}
