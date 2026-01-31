'use client';

import { useState } from 'react';
import { HeroBlock as HeroBlockType } from '@/types';
import { cn } from '@/lib/utils';

interface HeroBlockProps {
  data: HeroBlockType['data'];
}

export default function HeroBlock({ data }: HeroBlockProps) {
  const [selectedImage, setSelectedImage] = useState(data.primaryImage);
  const allImages = [data.primaryImage, ...(data.gallery || [])];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-surface-secondary rounded-xl overflow-hidden">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.jpg';
          }}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={cn(
                'w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImage === image
                  ? 'border-primary-600'
                  : 'border-transparent hover:border-neutral-300'
              )}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
