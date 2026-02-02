"use client";

import { useState, useMemo, useRef, useLayoutEffect, useCallback } from "react";
import { Frame, FrameVariantConfig } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

interface FrameColorSelectorProps {
  frames: Frame[];
  frameVariants: FrameVariantConfig;
  onSelectionChange: (selection: { frameId: string; colorId: string; image: string } | null) => void;
  className?: string;
}

export default function FrameColorSelector({ frames, frameVariants, onSelectionChange, className }: FrameColorSelectorProps) {
  // Filter frames to only those available for this product
  const availableFrames = useMemo(() => {
    return frames.filter((frame) => frameVariants.availableFrames.includes(frame.id));
  }, [frames, frameVariants.availableFrames]);

  // Helper to get available colors for a frame
  const getAvailableColors = (frameId: string) => {
    const frame = availableFrames.find((f) => f.id === frameId);
    if (!frame) return [];
    return frame.colors.filter((color) => {
      const imageKey = `${frameId}-${color.id}`;
      return frameVariants.images[imageKey] !== undefined;
    });
  };

  // Helper to get the first available color for a frame
  const getFirstColorForFrame = (frameId: string): string | null => {
    const colors = getAvailableColors(frameId);
    return colors.length > 0 ? colors[0].id : null;
  };

  // Initialize with first available frame and its first color
  const initialFrameId = availableFrames.length > 0 ? availableFrames[0].id : null;
  const initialColorId = initialFrameId ? getFirstColorForFrame(initialFrameId) : null;

  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(initialFrameId);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(initialColorId);

  // Track if we've notified parent of initial selection
  const hasNotifiedInitial = useRef(false);

  // Track which frame images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((frameId: string) => {
    setFailedImages((prev) => new Set(prev).add(frameId));
  }, []);

  // Get currently available colors based on selected frame
  const availableColors = useMemo(() => {
    if (!selectedFrameId) return [];
    return getAvailableColors(selectedFrameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFrameId, availableFrames, frameVariants.images]);

  // Get selected frame object
  const selectedFrame = useMemo(() => {
    return availableFrames.find((f) => f.id === selectedFrameId) || null;
  }, [availableFrames, selectedFrameId]);

  // Notify parent on initial mount and on subsequent changes
  useLayoutEffect(() => {
    if (selectedFrameId && selectedColorId) {
      const imageKey = `${selectedFrameId}-${selectedColorId}`;
      const image = frameVariants.images[imageKey];
      if (image) {
        onSelectionChange({
          frameId: selectedFrameId,
          colorId: selectedColorId,
          image,
        });
        hasNotifiedInitial.current = true;
      }
    }
  }, [selectedFrameId, selectedColorId, frameVariants.images, onSelectionChange]);

  const handleFrameSelect = (frameId: string) => {
    if (frameId === selectedFrameId) return;

    setSelectedFrameId(frameId);
    // When frame changes, auto-select first available color
    const newColorId = getFirstColorForFrame(frameId);
    setSelectedColorId(newColorId);
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  // Render hex color as a visual swatch
  const renderColorSwatch = (hex: string | string[], isSelected: boolean) => {
    const baseClasses = "block h-10 w-10 rounded-full border-4 shadow-sm transition-all";
    const selectedClasses = "border-white rounded-full ring-primary-500 ring-2";
    const unselectedClasses = "border-white cursor-pointer hover:scale-110";

    const style = Array.isArray(hex) ? { background: `linear-gradient(135deg, ${hex.join(", ")})` } : { backgroundColor: hex };

    return <span className={cn(baseClasses, isSelected ? selectedClasses : unselectedClasses)} style={style} />;
  };

  if (availableFrames.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Frame Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-neutral-700">Select Frame</label>
        <div className="flex flex-wrap gap-3">
          {availableFrames.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => handleFrameSelect(frame.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-1 transition-all",
                selectedFrameId === frame.id ? "border-primary-500 bg-primary-50" : "hover:border-primary-300 cursor-pointer border-neutral-200 bg-white hover:bg-neutral-50"
              )}
            >
              <div className="relative h-16 w-24 overflow-hidden rounded">
                <Image src={failedImages.has(frame.id) ? PLACEHOLDER_IMAGE : frame.image} alt={frame.name} fill sizes="96px" className="object-contain" onError={() => handleImageError(frame.id)} />
              </div>
              <span className={cn("text-sm font-medium", selectedFrameId === frame.id ? "text-primary-700" : "text-neutral-600")}>{frame.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {selectedFrame && availableColors.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">Select Color</label>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button key={color.id} type="button" onClick={() => handleColorSelect(color.id)} className="group relative" title={color.name}>
                {renderColorSwatch(color.hex, selectedColorId === color.id)}
                {/* Tooltip */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-neutral-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected combination display */}
      {selectedFrame && selectedColorId && (
        <div className="text-muted text-sm">
          Selected:{" "}
          <span className="font-medium text-neutral-700">
            {selectedFrame.name} - {availableColors.find((c) => c.id === selectedColorId)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
