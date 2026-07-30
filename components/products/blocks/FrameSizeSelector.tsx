"use client";

import { useState } from "react";
import { FrameSizeOption } from "@/types";
import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";

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
        <div>
            <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">Frame Size</label>
                <button
                    type="button"
                    onClick={() => setShowGuide((v) => !v)}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                    <Info className="h-3.5 w-3.5" />
                    Size guide
                </button>
            </div>

            {showGuide && (
                <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-xs font-semibold text-blue-700">Frame Size Guide</p>
                        <button onClick={() => setShowGuide(false)} className="text-blue-400 hover:text-blue-600"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <ul className="space-y-1">
                        {Object.entries(SIZE_GUIDE).map(([size, desc]) => (
                            <li key={size} className="text-xs text-blue-700"><span className="font-semibold">{size}:</span> {desc}</li>
                        ))}
                    </ul>
                    <p className="mt-2 text-[11px] text-blue-500">Not sure? Contact us and we&apos;ll help you choose.</p>
                </div>
            )}

            <div className="flex items-center gap-4">
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
                            className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                                isSelected
                                    ? "border-primary-500 bg-primary-500 text-white shadow-md"
                                    : "hover:border-primary-300 hover:bg-primary-50 cursor-pointer border-neutral-300 bg-white text-neutral-600"
                            )}
                        >
                            {size.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
