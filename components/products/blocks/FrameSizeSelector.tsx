"use client";

import { FrameSizeOption } from "@/types";
import { cn } from "@/lib/utils";

interface FrameSizeSelectorProps {
    sizes: FrameSizeOption[];
    selectedSize: string | null;
    onSizeChange: (size: string) => void;
}

export default function FrameSizeSelector({ sizes, selectedSize, onSizeChange }: FrameSizeSelectorProps) {
    return (
        <div>
            <label className="mb-3 block text-sm font-medium text-neutral-700">Frame Size</label>
            <div className="flex items-center gap-4">
                {sizes.map((size) => {
                    const isSelected = selectedSize === size.value;
                    return (
                        <button
                            key={size.value}
                            type="button"
                            onClick={() => onSizeChange(size.value)}
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
