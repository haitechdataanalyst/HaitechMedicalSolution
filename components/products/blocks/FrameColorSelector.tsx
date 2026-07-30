"use client";

import { useState, useMemo, useRef, useLayoutEffect, useCallback } from "react";
import { Frame, FrameVariantConfig } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// Color mapping for deriving hex values from color IDs
// This makes products.json independent - colors are derived from frameVariants.images keys
const COLOR_HEX_MAP: Record<string, string | string[]> = {
    // Basic colors
    black: "#000000",
    white: "#edefee",
    grey: "#6b7280",
    gray: "#6b7280",
    blue: "#0390d5",
    pink: "#e35e95",
    red: "#dc2626",
    green: "#548558",
    orange: "#f97316",
    brown: "#8b4513",
    bronze: "#967444",
    champagne: "#ceb9b5",
    turquoise: "#48899b",
    bordo: "#7c2d12",
    "navy-blue": "#363966",
    // Compound colors (two-tone)
    "bronze-blue": ["#967444", "#0390d5"],
    "blue-bronze": ["#0390d5", "#967444"],
    "purple-grey": ["#776094", "#87847f"],
    "rose-gold": ["#d9ad8a"],
    "blue-black": ["#4e7dc4", "#000000"],
    "orange-black": ["#fc7c29", "#000000"],
    "red-black": ["#d24d50", "#000000"],
    "green-black": ["#4d885a", "#282a29"],
    "turquoise-rose-gold": ["#4e8999", "#d5a986"],
    "red-gold": ["#8c3c55", "#a87f51"],
    "brown-blue": ["#4f4043", "#80bedd"],
    "blue-brown": ["#80bedd", "#4f4043"],
    "white-snow": "#f8fafc",
    "midnight-blue": "#353557",
    "orange-lava": "#c32f2b",
    "white-blue": ["#ffffff", "#3b82f6"],
};

// Helper to format color ID into display name
const formatColorName = (colorId: string): string => {
    return colorId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Helper to get hex color from color ID
const getColorHex = (colorId: string): string | string[] => {
    // Direct match
    if (COLOR_HEX_MAP[colorId]) {
        return COLOR_HEX_MAP[colorId];
    }
    // Fallback to a neutral color
    return "#9ca3af";
};

interface ParsedColor {
    id: string;
    name: string;
    hex: string | string[];
    image: string;
}

interface ParsedFrame {
    id: string;
    name: string;
    image: string;
    colors: ParsedColor[];
}

interface FrameColorSelectorProps {
    frames: Frame[];
    frameVariants: FrameVariantConfig;
    onSelectionChange: (selection: { frameId: string; colorId: string; image: string } | null) => void;
    className?: string;
}

export default function FrameColorSelector({ frames, frameVariants, onSelectionChange, className }: FrameColorSelectorProps) {
    // Parse frameVariants.images to extract available frames and their colors
    // This makes products.json the source of truth for available variants
    const parsedFrames = useMemo(() => {
        const frameColorMap: Record<string, ParsedColor[]> = {};

        // Parse all image keys to extract frame-color combinations
        Object.entries(frameVariants.images).forEach(([key, imagePath]) => {
            // Key format: "frameId-colorId" (e.g., "blues-black", "jazz-blue-black")
            const frameId = frameVariants.availableFrames.find((f) => key.startsWith(f + "-"));
            if (!frameId) return;

            const colorId = key.slice(frameId.length + 1); // Remove "frameId-" prefix
            if (!colorId) return;

            if (!frameColorMap[frameId]) {
                frameColorMap[frameId] = [];
            }

            frameColorMap[frameId].push({
                id: colorId,
                name: formatColorName(colorId),
                hex: getColorHex(colorId),
                image: imagePath,
            });
        });

        // Build parsed frames array using frames.json only for display image and name
        const result: ParsedFrame[] = frameVariants.availableFrames
            .map((frameId) => {
                const frameFromJson = frames.find((f) => f.id === frameId);
                const colors = frameColorMap[frameId] || [];

                if (colors.length === 0) return null;

                return {
                    id: frameId,
                    name: frameFromJson?.name || formatColorName(frameId),
                    image: frameFromJson?.image || PLACEHOLDER_IMAGE,
                    colors,
                };
            })
            .filter((f): f is ParsedFrame => f !== null);

        return result;
    }, [frames, frameVariants]);

    // Helper to get the first available color for a frame
    const getFirstColorForFrame = useCallback(
        (frameId: string): string | null => {
            const frame = parsedFrames.find((f) => f.id === frameId);
            return frame && frame.colors.length > 0 ? frame.colors[0].id : null;
        },
        [parsedFrames]
    );

    // Initialize with first available frame and its first color
    const initialFrameId = parsedFrames.length > 0 ? parsedFrames[0].id : null;
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
        const frame = parsedFrames.find((f) => f.id === selectedFrameId);
        return frame?.colors || [];
    }, [selectedFrameId, parsedFrames]);

    // Get selected frame object
    const selectedFrame = useMemo(() => {
        return parsedFrames.find((f) => f.id === selectedFrameId) || null;
    }, [parsedFrames, selectedFrameId]);

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

        // For compound colors (two-tone), render as split circle with dividing line
        if (Array.isArray(hex) && hex.length === 2) {
            return (
                <div className={cn(baseClasses, isSelected ? selectedClasses : unselectedClasses, "rotate-0")}>
                    <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Left semicircle */}
                        <circle cx="50" cy="50" r="45" fill={hex[0]} />
                        {/* Right semicircle */}
                        <path d="M 50 5 A 45 45 0 0 1 50 95 Z" fill={hex[1]} />
                        {/* Dividing line */}
                        {/* <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="1.5" opacity="0.6" /> */}
                    </svg>
                </div>
            );
        }

        // For single colors, simple solid background
        return <span className={cn(baseClasses, isSelected ? selectedClasses : unselectedClasses)} style={{ backgroundColor: hex as string }} />;
    };

    if (parsedFrames.length === 0) {
        return null;
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Frame Selection */}
            <div>
                <label className="mb-3 block text-sm font-medium text-neutral-700">Select Frame</label>
                <div className="flex flex-wrap gap-3">
                    {parsedFrames.map((frame) => (
                        <button
                            key={frame.id}
                            type="button"
                            onClick={() => handleFrameSelect(frame.id)}
                            aria-label={`Frame ${frame.name}`}
                            aria-pressed={selectedFrameId === frame.id}
                            className={cn(
                                "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-1 transition-all",
                                selectedFrameId === frame.id ? "border-primary-500 bg-primary-50" : "hover:border-primary-300 cursor-pointer border-neutral-200 bg-white hover:bg-neutral-50"
                            )}
                        >
                            <div className="relative h-16 w-24 overflow-hidden rounded">
                                <Image
                                    src={failedImages.has(frame.id) ? PLACEHOLDER_IMAGE : frame.image}
                                    alt={frame.name}
                                    fill
                                    sizes="96px"
                                    className="object-contain"
                                    onError={() => handleImageError(frame.id)}
                                />
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
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => handleColorSelect(color.id)}
                                className="group relative"
                                title={color.name}
                                aria-label={`Color ${color.name}`}
                                aria-pressed={selectedColorId === color.id}
                            >
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
