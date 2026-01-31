'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = '/images/placeholder.jpg',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={cn('aspect-square bg-gray-100 relative overflow-hidden', containerClassName)}>
      <img
        src={imgSrc}
        alt={alt}
        className={cn('w-full h-full object-cover', className)}
        onError={handleError}
      />
    </div>
  );
}
