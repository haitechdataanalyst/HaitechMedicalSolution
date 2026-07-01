"use client";

import { useState } from "react";
import Image from "next/image";
import { Frame } from "@/types";

function ColorSwatch({ hex, name, isSelected, onClick }: { hex: string | string[]; name: string; isSelected: boolean; onClick: () => void }) {
    const isGradient = Array.isArray(hex);

    const style = isGradient
        ? { background: `linear-gradient(135deg, ${hex[0]} 50%, ${hex[1]} 50%)` }
        : { backgroundColor: hex };

    return (
        <button onClick={onClick} className="flex cursor-pointer flex-col items-center gap-1" title={name}>
            <div className={`h-8 w-8 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${isSelected ? "border-primary-600 ring-2 ring-primary-200" : "border-neutral-200"}`} style={style} />
            <span className={`text-xs transition-colors ${isSelected ? "font-medium text-primary-600" : "text-neutral-500"}`}>{name}</span>
        </button>
    );
}

export function FrameCard({ frame }: { frame: Frame }) {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const selectedColor = frame.colors[selectedColorIndex];
    const displayImage = selectedColor?.image || frame.image;

    return (
        <div className="group h-full rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-primary-100 hover:shadow-[0_12px_32px_rgba(31,182,205,0.14)] active:translate-y-0">
            {/* Frame Image */}
            <div className="relative mb-6 aspect-4/3 w-full overflow-hidden rounded-xl">
                <Image
                    src={displayImage}
                    alt={`${frame.name} frame in ${selectedColor?.name || "default"}`}
                    fill
                    className="object-contain p-4 transition-all duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            {/* Frame Name */}
            <h3 className="mb-4 text-center text-2xl font-semibold text-neutral-900">{frame.name}</h3>

            {/* Color Swatches */}
            <div className="mb-4">
                <div className="flex flex-wrap justify-center gap-3">
                    {frame.colors.map((color, index) => (
                        <ColorSwatch key={color.id} hex={color.hex} name={color.name} isSelected={index === selectedColorIndex} onClick={() => setSelectedColorIndex(index)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
