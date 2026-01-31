'use client';

import { useState } from 'react';
import { GalleryBlock as GalleryBlockType } from '@/types';
import { cn } from '@/lib/utils';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface GalleryBlockProps {
  data: GalleryBlockType['data'];
}

export default function GalleryBlock({ data }: GalleryBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const layout = data.layout || 'grid';

  if (data.images.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          layout === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 gap-4'
            : 'flex gap-4 overflow-x-auto pb-4'
        )}
      >
        {data.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'aspect-square rounded-lg overflow-hidden bg-surface-secondary hover:opacity-90 transition-opacity',
              layout === 'carousel' && 'w-48 flex-shrink-0'
            )}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedIndex(null)}
          >
            <CloseIcon size={32} />
          </button>

          {selectedIndex > 0 && (
            <button
              className="absolute left-4 text-white hover:text-gray-300 p-2"
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
              className="absolute right-4 text-white hover:text-gray-300 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(selectedIndex + 1);
              }}
            >
              <ChevronRightIcon size={32} />
            </button>
          )}

          <img
            src={data.images[selectedIndex]}
            alt={`Gallery image ${selectedIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
