"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "@/components/icons";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
}

export default function ImageWithFallback({ src, alt, className, containerClassName, fallbackText = "No Image" }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={cn("relative aspect-square overflow-hidden bg-neutral-100", containerClassName)}>
      {hasError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400">
          <ImageIcon size={48} className="opacity-50" />
          <span className="text-sm font-medium">{fallbackText}</span>
        </div>
      ) : (
        <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} onError={handleError} />
      )}
    </div>
  );
}
