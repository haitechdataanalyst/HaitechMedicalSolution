"use client";

import { useState, useEffect } from "react";
import { HeroBlock as HeroBlockType } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroBlockProps {
  data: HeroBlockType["data"];
  externalSelectedImage?: string;
}

export default function HeroBlock({ data, externalSelectedImage }: HeroBlockProps) {
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);
  const selectedImage = externalSelectedImage ?? userSelectedImage ?? data.primaryImage;

  const allImages = [data.primaryImage, ...(data.gallery?.filter((img) => img !== data.primaryImage) || [])];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-surface-secondary relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setUserSelectedImage(image)}
              className={cn("h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors", selectedImage === image ? "border-primary-600" : "border-transparent hover:border-neutral-300 cursor-pointer")}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                width={80}
                height={80}
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
