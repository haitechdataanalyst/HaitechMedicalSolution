"use client";

import { useState } from "react";
import Image from "next/image";
import { Frame } from "@/types";
import { cn } from "@/lib/utils";
import { SURFACE_CARD } from "@/components/ui/surfaces";

function ColorSwatch({ hex, name, isSelected, onClick }: { hex: string | string[]; name: string; isSelected: boolean; onClick: () => void }) {
    const isGradient = Array.isArray(hex);

    const style = isGradient ? { background: `linear-gradient(135deg, ${hex[0]} 50%, ${hex[1]} 50%)` } : { backgroundColor: hex };

    // 44px hit area around a 32px swatch; the selected ring sits outside the swatch with a white gap.
    return (
        <button
            type="button"
            aria-pressed={isSelected}
            aria-label={name}
            title={name}
            onClick={onClick}
            className="focus-visible:outline-primary-500 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 motion-safe:active:scale-[0.94]"
        >
            <span className={cn("h-8 w-8 rounded-full ring-offset-2 ring-offset-white", isSelected ? "ring-primary-600 ring-2" : "ring-1 ring-neutral-900/[0.15] ring-offset-0")} style={style} />
        </button>
    );
}

export function FrameCard({ frame }: { frame: Frame }) {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const selectedColor = frame.colors[selectedColorIndex];
    const displayImage = selectedColor?.image || frame.image;

    return (
        <div className={cn(SURFACE_CARD, "flex h-full flex-col p-2")}>
            {/* Frame Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-neutral-50">
                <Image
                    src={displayImage}
                    alt={`${frame.name} frame in ${selectedColor?.name || "default"}`}
                    fill
                    className="object-contain p-6 mix-blend-multiply"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-1 flex-col items-center px-4 pt-5 pb-4 text-center">
                {/* Frame Name */}
                <h3 className="text-xl font-semibold tracking-[-0.015em] text-neutral-900">{frame.name}</h3>
                {selectedColor && (
                    <p className="mt-1 text-[13px] text-neutral-500" aria-live="polite">
                        {selectedColor.name}
                    </p>
                )}

                {/* Color Swatches */}
                <div role="group" aria-label={`${frame.name} colours`} className="mt-3 flex flex-wrap justify-center gap-1">
                    {frame.colors.map((color, index) => (
                        <ColorSwatch key={color.id} hex={color.hex} name={color.name} isSelected={index === selectedColorIndex} onClick={() => setSelectedColorIndex(index)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
