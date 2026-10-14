"use client";

import { useState } from "react";
import { FrameSizeOption } from "@/types";
import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";
import { OPTION_IDLE, OPTION_SELECTED, OPTION_TILE } from "./option-styles";

const SIZE_GUIDE: Record<string, string> = {
    S: "Small — fits face width up to 130 mm. Typical for petite faces.",
    M: "Medium — fits face width 130–140 mm. Most common fit.",
    L: "Large — fits face width above 140 mm. For wider face profiles.",
};

interface FrameSizeSelectorProps {
    sizes: FrameSizeOption[];
    selectedSize: string | null;
    onSizeChange: (size: string) => void;
}

export default function FrameSizeSelector({ sizes, selectedSize, onSizeChange }: FrameSizeSelectorProps) {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div role="group" aria-labelledby="frame-size-label">
            <div className="mb-3 flex items-center justify-between">
                <p id="frame-size-label" className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                    Frame Size
                </p>
                <button
                    type="button"
                    onClick={() => setShowGuide((v) => !v)}
                    aria-expanded={showGuide}
                    aria-controls="frame-size-guide"
                    className="text-primary-700 hover:text-primary-800 focus-visible:outline-primary-500 -mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <Info className="h-4 w-4" aria-hidden="true" />
                    Size guide
                </button>
            </div>

            {showGuide && (
                <div id="frame-size-guide" className="mb-4 rounded-xl bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-[15px] font-semibold text-neutral-900">Frame Size Guide</p>
                        <button
                            type="button"
                            onClick={() => setShowGuide(false)}
                            aria-label="Close size guide"
                            className="focus-visible:outline-primary-500 -mt-2.5 -mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-800 focus-visible:outline-2"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                    <ul className="space-y-1.5">
                        {Object.entries(SIZE_GUIDE).map(([size, desc]) => (
                            <li key={size} className="text-[13px] leading-relaxed text-neutral-600">
                                <span className="font-semibold text-neutral-900">{size}:</span> {desc}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-[13px] text-neutral-500">Not sure? Contact us and we&apos;ll help you choose.</p>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2.5">
                {sizes.map((size) => {
                    const isSelected = selectedSize === size.value;
                    return (
                        <button
                            key={size.value}
                            type="button"
                            onClick={() => onSizeChange(size.value)}
                            title={SIZE_GUIDE[size.value] ?? size.label}
                            aria-label={`Frame size ${size.label}`}
                            aria-pressed={isSelected}
                            className={cn(OPTION_TILE, "min-h-12 font-medium", isSelected ? OPTION_SELECTED : OPTION_IDLE)}
                        >
                            {size.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
